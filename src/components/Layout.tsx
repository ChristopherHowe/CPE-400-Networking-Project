import { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import MediumSidebarTransition from './SidebarTransition';
import Seperator from './seperator';
import { Simulation } from '@/models/network';

interface LayoutProps {
  children: ReactNode;
  loadSimulation: (sim: Simulation) => void;
  newSimulation: () => void;
}
export default function Layout(props: LayoutProps) {
  const { children, loadSimulation, newSimulation } = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <MediumSidebarTransition {...{ sidebarOpen, setSidebarOpen }}>
        <Sidebar {...{ loadSimulation, newSimulation }} />
      </MediumSidebarTransition>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <Sidebar {...{ loadSimulation, newSimulation }} />
      </div>
      <div className="lg:pl-72 h-screen flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <Seperator />
          <h1 className="text-xl font-semibold">CPE 400 Networking Project</h1>
          <div className="absolute right-0 p-10 text-right">
            <div className="text-md">Created by Christopher Howe</div>
            <div className="text-xs">Styling from tailwind UI</div>
          </div>
        </div>

        <main className="py-10 flex-grow">
          <div className="px-4 sm:px-6 lg:px-8 h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
