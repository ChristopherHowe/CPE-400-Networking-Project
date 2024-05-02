import { DataHTMLAttributes } from 'react';
import { Router, Host, Datagram, RouterPATPortRange, PATEntry } from './models/network';
import sleep from './utils';
import * as ip from 'ip';
import { IPAndPortFromString } from './utils/network';
import { NetworkContext, NetworkContextProps } from './components/NetworkContext';

const speed = 2000;

export class SimError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, SimError.prototype);
  }
}

export enum SimState {
  Off = 'Sim is not running.',
  Running = 'Running Simulation...',
  Preparing = 'Preparing packet',
  SendingPacket = 'Sending packet...',
  FinishedPacket = 'Successfully sent a packet',
  TranslatingAddress = 'Handling address translation...',
  Error = 'Error:',
  Complete = 'Finished Simulation.',
}

function getDestIPMacOnNet(router: Router, destIp: string): string | undefined {
  return router.activeLeases.find((lease) => lease.ipAddress === destIp)?.macAddress;
}

function dropPacketFromQueueWhenDone(
  h: Host,
  completedPacketID: string,
  editHost: (id: string, updater: Host | ((prev: Host) => Host)) => void,
) {
  editHost(h.macAddress, (prev) => {
    return { ...prev, queuedPackets: prev.queuedPackets.filter((p) => p.id !== completedPacketID) };
  });
}

function getHostRouter(hostMac: string, hostGateway: string, routers: Router[]) {
  if (hostGateway != '') {
    return routers.find(
      (router) =>
        router.activeLeases.some((lease) => lease.macAddress === hostMac) && router.intIPAddress === hostGateway,
    );
  }
}

function getUnusedPATPort(PATTable: PATEntry[]) {
  function portIsUsedInPATTable(PATTable: PATEntry[], port: number) {
    return PATTable.some((entry) => {
      const [ip, p] = IPAndPortFromString(entry.extIP);
      return p === port;
    });
  }
  for (let i = RouterPATPortRange.min; i < RouterPATPortRange.max, i++; ) {
    if (!portIsUsedInPATTable(PATTable, i)) {
      return i;
    }
  }
  throw new SimError('All ports used in PAT table');
}
async function addPATEntryAndChangeSrcIP(
  packet: Datagram,
  routeMAC: string,
  context: NetworkContextProps,
): Promise<Datagram> {
  let hackStruct: { packetPort: number; routerExtIP: string } = { packetPort: -1, routerExtIP: '' };

  context.editRouter(routeMAC, (prev) => {
    const unusedPort = getUnusedPATPort(prev.PATTable);
    const newPatEntry = {
      intIP: `${packet.srcIP}:${packet.segment.srcPort}`,
      extIP: `${prev.extIPAddress}:${unusedPort}`,
    };
    hackStruct = { packetPort: unusedPort, routerExtIP: prev.extIPAddress };
    return { ...prev, PATTable: [...prev.PATTable, newPatEntry] };
  });
  let counter = 0;
  while (hackStruct.routerExtIP === '') {
    counter++;
    if (counter >= 100) {
      throw new Error('Failed to wait for hackstruct to be complete');
    }
    await sleep(50);
  }

  return {
    id: packet.id,
    destIP: packet.destIP,
    srcIP: hackStruct.routerExtIP,
    segment: {
      destPort: packet.segment.destPort,
      srcPort: hackStruct.packetPort,
      data: packet.segment.data,
    },
  };
}

async function travelWire(
  setSimState: React.Dispatch<React.SetStateAction<SimState>>,
  setSimMsg: React.Dispatch<React.SetStateAction<string>>,
  setEdgeActive: (active: boolean, src?: string, dest?: string) => void,
  src: string,
  dest: string,
) {
  setSimState(SimState.SendingPacket);
  setSimMsg(`Sending packet from ${src} to ${dest}`);
  setEdgeActive(true, src, dest);
  await sleep(speed);
}

async function simulatePacket(
  packet: Datagram,
  srcHost: Host,
  context: NetworkContextProps,
  setEdgeActive: (active: boolean, src?: string, dest?: string) => void,
  setSimState: React.Dispatch<React.SetStateAction<SimState>>,
  setSimMsg: React.Dispatch<React.SetStateAction<string>>,
) {
  console.log('Simulating Packet', JSON.stringify(packet));
  let current: { macAddress: string; gateway: string } = srcHost;
  let currentPacket = packet;

  while (true) {
    const hostRouter = getHostRouter(current.macAddress, current.gateway, context.routers);
    if (!hostRouter) {
      throw new SimError(`Host/Router with mac ${current.macAddress} is not connected to a router`);
    }
    await travelWire(setSimState, setSimMsg, setEdgeActive, current.macAddress, hostRouter.macAddress);

    const destMac = getDestIPMacOnNet(hostRouter, currentPacket.destIP);
    // Case 1: Destination is in network
    if (destMac) {
      console.log('handling case 1');
      const destHost = context.getHost(destMac);
      if (!destHost) {
        throw new Error(`Got destination mac addr ${destMac} but no corresponding host`);
      }

      await travelWire(setSimState, setSimMsg, setEdgeActive, hostRouter.macAddress, destMac);
      setEdgeActive(false);
      context.editHost(destHost.macAddress, (h) => {
        return { ...h, recievedPackets: [...h.recievedPackets, currentPacket] };
      });

      return;
    }
    // Case 2: Destination is not in network
    else {
      console.log('Handling case 2');

      if (hostRouter.gateway !== '') {
        setEdgeActive(false);

        currentPacket = await addPATEntryAndChangeSrcIP(currentPacket, hostRouter.macAddress, context);
        setSimState(SimState.TranslatingAddress);
        setSimMsg(
          `Adding PAT Table Entry to router (${hostRouter.macAddress}). Packet now has source IP ${currentPacket.srcIP}:${currentPacket.segment.srcPort}`,
        );
        await sleep(speed);

        current = hostRouter;
      } else {
        throw new SimError(
          `Failed to deliver packet, after reaching router with mac ${hostRouter.macAddress}, could not proceed to anymore routers`,
        );
      }
    }
  }
}

export default async function runSimulation(
  context: NetworkContextProps,
  setEdgeActive: (active: boolean, src?: string, dest?: string) => void,
  setSimState: React.Dispatch<React.SetStateAction<SimState>>,
  setSimMsg: React.Dispatch<React.SetStateAction<string>>,
) {
  setSimState(SimState.Running);
  try {
    for (const host of context.hosts) {
      for (const packet of host.queuedPackets) {
        setSimState(SimState.Preparing);
        setSimMsg(`Getting ready to send packet with destination ${packet.destIP} and source ${packet.srcIP}`);
        await sleep(speed);

        await simulatePacket(packet, host, context, setEdgeActive, setSimState, setSimMsg);
        dropPacketFromQueueWhenDone(host, packet.id, context.editHost);

        setSimState(SimState.FinishedPacket);
        setSimMsg('Finished sending packet');
        await sleep(speed);
      }
    }
    setSimState(SimState.Complete);
    setSimMsg('Finished');
  } catch (e) {
    setSimState(SimState.Error);
    if (e instanceof SimError) {
      setSimMsg(e.message);
    } else {
      setSimMsg('An unexpected error occured while running the simulator');
      console.log(e);
    }
  }
}
