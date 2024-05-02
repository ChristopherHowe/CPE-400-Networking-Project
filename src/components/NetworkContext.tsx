import { createContext, useState, useCallback, useEffect } from 'react';
import { Router, Host, Simulation } from '@/models/network';
import { Edge, Node } from 'reactflow';
import { isFunction } from 'util';

export interface NetworkContextProps {
  hosts: Host[];
  routers: Router[];
  getHost: (mac: string) => Host | undefined;
  addHost: (host: Host) => void;
  editHost: (id: string, updater: Host | ((prev: Host) => Host)) => void;
  getRouter: (mac: string) => Router | undefined;
  getGatewayRouter: (mac: string, gateway: string) => Router | undefined;
  addRouter: (router: Router) => void;
  editRouter: (id: string, updater: Router | ((prev: Router) => Router)) => void;
  getDeviceType: (mac: string) => 'router' | 'host' | undefined;
  saveSimulation: (nodes: Node[], edges: Edge[]) => void;
  editMac: string;
  setEditMac: (mac: string) => void;
  clearNetwork: () => void;
  getNewPacketID: () => string;
  freePacketID: (id: string) => void;
}

export const NetworkContext = createContext<NetworkContextProps>({
  hosts: [],
  routers: [],
  getHost: (mac: string) => undefined,
  addHost: (host: Host) => {},
  editHost: (id: string, updater: Host | ((prev: Host) => Host)) => {},
  getRouter: (mac: string) => undefined,
  getGatewayRouter: (mac: string, gateway: string) => undefined,
  addRouter: (router: Router) => {},
  editRouter: (id: string, updater: Router | ((prev: Router) => Router)) => {},
  getDeviceType: (mac: string) => undefined,
  saveSimulation: (nodes: Node[], edges: Edge[]) => '',
  editMac: '',
  setEditMac: (mac: string) => {},
  clearNetwork: () => {},
  getNewPacketID: () => '',
  freePacketID: () => {},
});

export function NetworkContextProvider({ children }: { children: any }) {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [routers, setRouters] = useState<Router[]>([]);
  const [editMac, setEditMac] = useState<string>('');
  const [packetIDs, setPacketIDs] = useState<string[]>([]);

  const getHost = useCallback(
    (mac: string) => {
      return hosts.find((host) => host.macAddress === mac);
    },
    [hosts],
  );

  function clearNetwork() {
    setHosts([]);
    setRouters([]);
    setEditMac('');
  }

  function addHost(host: Host) {
    setHosts((prev) => [...prev, host]);
  }

  function editHost(id: string, updater: Host | ((prev: Host) => Host)): void {
    if (!getHost(id)) {
      throw new Error(`Host with mac address ${id} does not exist`);
    }
    setHosts((prev) =>
      prev.map((host) => (host.macAddress !== id ? host : typeof updater === 'function' ? updater(host) : updater)),
    );
  }

  const getRouter = useCallback(
    (mac: string) => {
      return routers.find((host) => host.macAddress === mac);
    },
    [routers],
  );

  const getGatewayRouter = useCallback(
    (mac: string, gateway: string) => {
      return routers.find(
        (router) => gateway === router.intIPAddress && router.activeLeases.some((lease) => lease.macAddress === mac),
      );
    },
    [routers],
  );

  function addRouter(router: Router) {
    setRouters((prev) => [...prev, router]);
  }

  function editRouter(id: string, updater: Router | ((prev: Router) => Router)) {
    if (!getRouter(id)) {
      throw new Error(`Router with mac address ${id} does not exist`);
    }
    setRouters((prev) =>
      prev.map((router) =>
        router.macAddress !== id ? router : typeof updater === 'function' ? updater(router) : updater,
      ),
    );
  }

  function getDeviceType(mac: string): 'router' | 'host' | undefined {
    if (routers.some((router) => router.macAddress === mac)) {
      return 'router';
    }
    if (hosts.some((host) => host.macAddress === mac)) {
      return 'host';
    }
  }

  function saveSimulation(nodes: Node[], edges: Edge[]) {
    const simulation: Simulation = {
      nodes: nodes,
      edges: edges,
      Hosts: hosts,
      Routers: routers,
    };
    const blob = new Blob([JSON.stringify(simulation)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'simulation.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function getNewPacketID() {
    if (packetIDs.length === 0) return 'p-1'; // If array is empty, start with p-1
    const lastID = packetIDs[packetIDs.length - 1];
    const lastNumber = parseInt(lastID.split('-')[1]);
    if (isNaN(lastNumber)) throw new Error(`Packet IDs are not following format ${packetIDs}`);
    const newID = `p-${lastNumber + 1}`;
    setPacketIDs((prev) => [...prev, newID]);
    return newID;
  }

  function freePacketID(id: string) {
    setPacketIDs((prev) => prev.filter((i) => i !== id));
  }

  useEffect(() => {
    console.log('Routers');
    console.log(routers);
  }, [routers]);

  useEffect(() => {
    console.log('Hosts');
    console.log(hosts);
  }, [hosts]);

  return (
    <NetworkContext.Provider
      value={{
        hosts,
        routers,
        getHost,
        addHost,
        editHost,
        getRouter,
        addRouter,
        editRouter,
        getDeviceType,
        saveSimulation,
        editMac,
        setEditMac,
        clearNetwork,
        getNewPacketID,
        freePacketID,
        getGatewayRouter,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}
