import { Handle, NodeProps, Position } from 'reactflow';
import { Router } from '@/models/network';
import { useContext, useState, useEffect } from 'react';
import { NetworkContext } from './NetworkContext';

interface NodeData {
  mac: string;
}
export default function RouterNode({ data }: NodeProps<NodeData>) {
  const { getRouter, setEditMac } = useContext(NetworkContext);
  const [router, setRouter] = useState<Router>({
    macAddress: '',
    name: '',
    intIPAddress: '',
    extIPAddress: '',
    subnet: '',
    activeLeases: [],
    gateway: '',
    PATTable: [],
  });

  useEffect(() => {
    const newRouter = getRouter(data.mac);
    if (newRouter) {
      setRouter(newRouter);
    }
  }, [getRouter, data.mac]);

  return (
    <div className="host-node border-2 bg-gray-200 border-black p-3 flex flex-col items-center justify-center rounded-xl">
      <Handle type="target" id={'top-internal'} position={Position.Top} style={{ background: '#f00' }} isConnectable />
      <Handle
        type="source"
        id={'left-external'}
        position={Position.Left}
        style={{ background: '#555' }}
        isConnectable
      />
      <Handle
        type="target"
        id={'bottom-internal'}
        position={Position.Bottom}
        style={{ background: '#f00' }}
        isConnectable
      />
      <Handle
        type="source"
        id={'right-external'}
        position={Position.Right}
        style={{ background: '#555' }}
        isConnectable
      />
      <div className="text-sm">{router.name}</div>
      <div className="text-xs text-gray-400">{router.macAddress}</div>
      <div className="text-xs text-gray-400">Internal: {router.intIPAddress}</div>
      <div className="text-xs text-gray-400">External: {router.extIPAddress}</div>
      <div className="text-xs text-gray-400">Subnet: {router.subnet}</div>
      <button onClick={() => setEditMac(router.macAddress)} className="text-black underline hover:text-gray-700">
        PAT Table
      </button>
    </div>
  );
}
