import SmoothDialog from './Dialog';
import { useContext, useState, useEffect } from 'react';
import Textbox from '../Textbox';
import { Datagram } from '@/models/network';
import Button from '../Button';
import { NetworkContext } from '../NetworkContext';
import * as ip from 'ip';
import { wrapHTTPData } from '@/utils/network';
import { DatagramToString, getRandomInRange } from '@/utils';

function PacketsTable({
  packets,
  setPackets,
  queuedNRecieved,
}: {
  packets: Datagram[];
  setPackets?: React.Dispatch<React.SetStateAction<Datagram[]>>;
  canEdit: boolean;
  queuedNRecieved?: boolean;
}) {
  function deletePacket(removing: Datagram) {
    if (!setPackets) {
      throw new Error('Tried to delete a packet when set packets was not passed');
    }
    setPackets((prev) => prev.filter((packet) => packet !== removing));
  }
  return (
    <div className="mt-8 max-w-[35em] truncate">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            {queuedNRecieved ? 'Queued Packets' : 'Recieved Packets'}
          </h1>
        </div>
      </div>
      <div className="mt-3 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      {queuedNRecieved ? 'Destination' : 'Source'}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {packets.map((packet) => (
                    <tr key={packet.segment.data + packet.destIP}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {queuedNRecieved ? packet.destIP : packet.srcIP}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 w-5">{DatagramToString(packet)}</td>
                      {queuedNRecieved && (
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => deletePacket(packet)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface QueueHostPacketsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function QueueHostPacketsDialog(props: QueueHostPacketsDialogProps) {
  const { open, onClose } = props;
  const [newData, setNewData] = useState<string>('');
  const [newDestIP, setNewDestIP] = useState<string>('');
  const [packets, setPackets] = useState<Datagram[]>([]);
  const { editHost, getHost, editMac, getNewPacketID } = useContext(NetworkContext);

  const host = getHost(editMac);

  function validateAddButton(): string {
    if (!ip.isV4Format(newDestIP)) {
      return 'Destination IP is not valid';
    }
    if (!ip.isV4Format(host?.ipAddress || '')) {
      return 'Host does not have an IP address';
    }
    return '';
  }

  const validationMsg = validateAddButton();

  function addPacket() {
    if (host) {
      const newPacket = wrapHTTPData(
        getNewPacketID(),
        newData,
        newDestIP,
        host.ipAddress || '',
        getRandomInRange(3000, 6000),
      );
      setPackets((prev) => [...prev, newPacket]);
    }
  }

  useEffect(() => {
    if (host) {
      setPackets(host.queuedPackets);
    }
  }, [setPackets, host]);

  async function onSubmit() {
    if (!host) {
      throw new Error(`Failed to get host for mac ${host}`);
    }
    editHost(host.macAddress, { ...host, queuedPackets: packets });
    onClose();
  }

  return (
    <SmoothDialog title="Queue HTTP Packets" submitLabel="Save" validationMsg="" {...{ open, onClose, onSubmit }}>
      <div className="flex flex-row items-end">
        <Textbox label="Packet Data" value={newData} setValue={setNewData} />
        <Textbox label="Destination IP" value={newDestIP} setValue={setNewDestIP} />
        <div>
          <Button disabled={validationMsg !== ''} label="add" onClick={addPacket} />
        </div>
      </div>
      <PacketsTable queuedNRecieved {...{ packets, setPackets }} canEdit />
      <PacketsTable packets={host?.recievedPackets || []} canEdit />
    </SmoothDialog>
  );
}
