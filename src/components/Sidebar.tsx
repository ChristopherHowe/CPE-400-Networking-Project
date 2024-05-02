import { Cog6ToothIcon, PlusIcon, ListBulletIcon, WifiIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { Simulation } from '@/models/network';
import data from '../../examples/multiPAT.json';
import HelpDialog from './Dialogs/HelpDialog';

function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar({
  loadSimulation,
  newSimulation,
}: {
  loadSimulation: (sim: Simulation) => void;
  newSimulation: () => void;
}) {
  const [helpDialogOpen, setHelpDialogOpen] = useState<boolean>(false);

  const navigation = [
    { name: 'Create a New Environment', onClick: newSimulation, icon: PlusIcon, current: false },
    {
      name: 'Example simulation',
      onClick: () => {
        loadSimulation(data);
      },
      icon: ListBulletIcon,
      current: false,
    },
    {
      name: 'Help',
      onClick: () => {
        setHelpDialogOpen(true);
      },
      icon: QuestionMarkCircleIcon,
      current: false,
    },
  ];

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <WifiIcon className="h-8 w-auto text-white" />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={item.onClick}
                    className={classNames(
                      item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                    )}
                  >
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
            <a
              href="#"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
              Settings
            </a>
          </li>
        </ul>
      </nav>
      <HelpDialog open={helpDialogOpen} onClose={() => setHelpDialogOpen(false)} />
    </div>
  );
}
