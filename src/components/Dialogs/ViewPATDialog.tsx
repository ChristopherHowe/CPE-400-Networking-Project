import SmoothDialog from './Dialog';
import { useContext } from 'react';
import { PATEntry } from '@/models/network';
import { NetworkContext } from '../NetworkContext';

function PATTable({ table }: { table: PATEntry[] }) {
  return (
    <div className="mt-8 max-w-[35em] truncate">
      <div className="mt-3 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Internal IP
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      External IP
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {table.map((entry) => (
                    <tr key={entry.intIP + entry.extIP}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {entry.intIP}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {entry.extIP}
                      </td>
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

export default function ViewPatDialog(props: QueueHostPacketsDialogProps) {
  const { open, onClose } = props;
  const { getRouter, editMac } = useContext(NetworkContext);

  const router = getRouter(editMac);

  return (
    <SmoothDialog
      title="Router PAT Table"
      submitLabel="Done"
      {...{ open, onClose }}
      validationMsg=""
      onSubmit={onClose}
    >
      <div className="w-96">
        {router && (
          <>
            {router.PATTable.length >= 1 ? (
              <PATTable table={router.PATTable} />
            ) : (
              <div className="text-gray-700 w-full flex flex-col items-center mt-5">
                No PAT Table Entries for this router yet
              </div>
            )}
          </>
        )}
      </div>
    </SmoothDialog>
  );
}
