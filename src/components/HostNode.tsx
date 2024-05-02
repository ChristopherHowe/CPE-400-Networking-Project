import { Handle, NodeProps, Position } from 'reactflow';
import { Host } from '@/models/network';
import { useContext, useState, useEffect } from 'react';
import { NetworkContext } from './NetworkContext';

interface NodeData {
  mac: string;
}
export default function HostNode({ data }: NodeProps<NodeData>) {
  const { getHost, setEditMac } = useContext(NetworkContext);
  const [host, setHost] = useState<Host>({
    macAddress: '',
    name: '',
    queuedPackets: [],
    recievedPackets: [],
    gateway: '',
  });

  useEffect(() => {
    const newHost = getHost(data.mac);
    if (newHost) {
      setHost(newHost);
    }
  }, [getHost, data.mac]);

  return (
    <>
      <Handle type="source" id={'top'} position={Position.Top} style={{ background: '#555' }} isConnectable />
      <Handle type="source" id={'bottom'} position={Position.Bottom} style={{ background: '#555' }} isConnectable />
      <div className="border-2 bg-blue-500 border-black p-2 w-40 flex flex-col items-center justify-center rounded-md">
        <div className="text-sm text-white">{host.name}</div>
        <div className="text-xs text-gray-300">{host.macAddress}</div>
        {host.ipAddress && <div className="text-xs text-gray-300">{host.ipAddress}</div>}
        <div className="flex flex-row items-center gap-3">
          <button onClick={() => setEditMac(host.macAddress)} className="text-gray-300 hover:text-gray-50 underline">
            Packets
          </button>
          {host.queuedPackets.length >= 1 ? (
            <div className="bg-yellow-300 border-yellow-400 border-2 rounded-full text-yellow-600 px-1 text-xs h-5">
              Waiting
            </div>
          ) : (
            <div className="bg-green-300 border-green-400 border-2 rounded-full text-green-600 px-1 text-xs h-5">
              Ready
            </div>
          )}
        </div>
      </div>
    </>
  );
}
