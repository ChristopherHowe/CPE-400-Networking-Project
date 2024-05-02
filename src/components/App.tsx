import Diagram from '@/components/Diagram';
import Layout from '@/components/Layout';
import { Controls } from '@/components/Controls';
import { useState, useCallback, useContext } from 'react';
import { addEdge, useNodesState, useEdgesState, Connection, Edge } from 'reactflow';
import AddHostDialog from './Dialogs/AddHostDialog';
import { Host, Router, Simulation } from '@/models/network';
import AddRouterDialog from './Dialogs/AddRouterDialog';
import { findUnusedIP } from '@/utils/network';
import { NetworkContext } from './NetworkContext';
import QueueHostPacketsDialog from './Dialogs/HostPacketsDialog';
import CurrentEvent from './CurrentEvent';
import runSimulation, { SimState } from '@/simulation';
import ViewPatDialog from './Dialogs/ViewPATDialog';

class UserError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, UserError.prototype);
  }
}

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [openDialog, setOpenDialog] = useState<'' | 'AddHost' | 'AddRouter'>('');
  const [simState, setSimState] = useState<SimState>(SimState.Off);
  const [simMsg, setSimMsg] = useState<string>('');

  const context = useContext(NetworkContext);

  const {
    hosts,
    routers,
    addHost,
    addRouter,
    getHost,
    getRouter,
    editHost,
    editRouter,
    saveSimulation,
    editMac,
    setEditMac,
    clearNetwork,
  } = context;

  const getEditMacType: (editMac: string) => 'router' | 'host' | undefined = () => {
    if (hosts.some((host) => host.macAddress === editMac)) {
      return 'host';
    } else if (routers.some((router) => router.macAddress === editMac)) {
      return 'router';
    }
  };
  const editMacType = getEditMacType(editMac);

  function addHostNode(mac: string) {
    setNodes((prevNodes) => [
      ...prevNodes,
      {
        id: mac,
        position: { x: 0, y: 0 },
        data: { mac: mac },
        type: 'hostNode',
      },
    ]);
  }

  function addRouterNode(mac: string) {
    setNodes((prevNodes) => [
      ...prevNodes,
      {
        id: mac,
        position: { x: 0, y: 0 },
        data: { mac: mac },
        type: 'routerNode',
      },
    ]);
  }

  async function handleAddHost(host: Host) {
    addHost(host);
    addHostNode(host.macAddress);
  }

  async function handleAddRouter(router: Router) {
    addRouter(router);
    addRouterNode(router.macAddress);
  }

  function closeDialog() {
    setOpenDialog('');
    setEditMac('');
  }

  function giveHostIP(connection: Connection) {
    const memberId = connection.source;
    const routerId = connection.target;
    if (!memberId || !routerId) {
      throw new Error('Connection source or target is null');
    }
    let member: Router | Host | undefined = getHost(memberId);
    let memberType: 'router' | 'host' = 'host';

    // Get the member
    if (!member) {
      memberType = 'router';
      member = getRouter(memberId);
      if (!member) {
        throw new Error(`given member id ${memberId} doesn't correspond to a host or a router`);
      }
    }
    // Make sure the member is not already connected to a network
    if (memberType === 'host') {
      if ((member as Host).ipAddress) {
        throw new UserError('Connecting hosts to more than one network is not supported');
      }
    } else {
      if ((member as Router).extIPAddress) {
        throw new UserError('Connecting routers to more than one other network is not supported');
      }
    }

    const router = getRouter(routerId);
    if (!router) {
      throw new Error(`given router id ${routerId} is invalid`);
    }

    const newIP = findUnusedIP(router);

    if (memberType === 'host') {
      editHost(member.macAddress, { ...(member as Host), ipAddress: newIP, gateway: router.intIPAddress });
    } else {
      editRouter(member.macAddress, { ...(member as Router), extIPAddress: newIP, gateway: router.intIPAddress });
    }
    editRouter(member.macAddress, {
      ...router,
      activeLeases: [...router.activeLeases, { ipAddress: newIP, macAddress: memberId }],
    });
  }

  const onConnect = useCallback(
    (connection: Connection) => {
      try {
        giveHostIP(connection);
      } catch (e) {
        setSimState(SimState.Error);
        if (e instanceof UserError) {
          setSimMsg(e.message);
        } else {
          setSimMsg(`Something went wrong while trying to connect ${connection.source} ${connection.target}`);
        }
        return;
      }
      setEdges((eds) => addEdge({ ...connection }, eds));
    },
    [setEdges, giveHostIP],
  );

  function loadSimulation(sim: Simulation) {
    clearNetwork();
    setNodes(sim.nodes);
    setEdges(sim.edges);
    for (const router of sim.Routers) {
      addRouter(router);
    }
    for (const host of sim.Hosts) {
      addHost(host);
    }
  }

  function newSimulation() {
    clearNetwork();
    setNodes([]);
    setEdges([]);
  }

  function setEdgeActive(active: boolean, src?: string, dest?: string) {
    function makeActiveEdge(e: Edge): Edge {
      return { ...e, animated: true, style: { stroke: 'red' } };
    }
    function makeOfflineEdge(e: Edge): Edge {
      return { ...e, animated: false, style: { stroke: 'black' } };
    }
    if (active) {
      if (!src || !dest) {
        throw new Error('while attempting to set edge as active src or dest was not specified');
      }
      setEdges((prev) =>
        prev.map((edge) =>
          (edge.source === src && edge.target === dest) || (edge.source === dest && edge.target === src)
            ? makeActiveEdge(edge)
            : makeOfflineEdge(edge),
        ),
      );
    } else {
      setEdges((prev) => prev.map((edge) => makeOfflineEdge(edge)));
    }
  }

  return (
    <>
      <Layout {...{ loadSimulation, newSimulation }}>
        <div className="relative h-full">
          <Diagram {...{ nodes, onNodesChange, edges, onEdgesChange, onConnect }} />
          <Controls
            setOpenDialog={setOpenDialog}
            runSimulation={() => runSimulation(context, setEdgeActive, setSimState, setSimMsg)}
            saveSimulation={() => saveSimulation(nodes, edges)}
          />
          {simState !== SimState.Off && (
            <CurrentEvent
              heading={simState}
              message={simMsg}
              dismissable={simState === SimState.Complete || simState === SimState.Error}
              onDismiss={() => setSimState(SimState.Off)}
            />
          )}
        </div>
      </Layout>
      <AddHostDialog open={openDialog === 'AddHost'} onClose={closeDialog} addHost={handleAddHost} />
      <AddRouterDialog open={openDialog === 'AddRouter'} onClose={closeDialog} addRouter={handleAddRouter} />
      <QueueHostPacketsDialog open={editMacType === 'host'} onClose={closeDialog} />
      <ViewPatDialog open={editMacType === 'router'} onClose={closeDialog} />
    </>
  );
}
