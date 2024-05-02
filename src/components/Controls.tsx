import React from 'react';

interface ControlButtonProps {
  text: string;
  onClick: () => void;
}
function ControlButton(props: ControlButtonProps) {
  const { text, onClick } = props;
  return (
    <button
      className="rounded bg-white px-2 py-1 m-2 text-md font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

interface ControlsProps {
  setOpenDialog: React.Dispatch<React.SetStateAction<'' | 'AddHost' | 'AddRouter'>>;
  runSimulation: () => void;
  saveSimulation: () => void;
}

export function Controls(props: ControlsProps) {
  const { setOpenDialog, runSimulation, saveSimulation } = props;
  return (
    <div className="absolute top-0">
      <ControlButton text="Add Host" onClick={() => setOpenDialog('AddHost')} />
      <ControlButton text="Add Router" onClick={() => setOpenDialog('AddRouter')} />
      <ControlButton text="Run Simulation" onClick={runSimulation} />
      <ControlButton text="Save Environment" onClick={saveSimulation} />
    </div>
  );
}
