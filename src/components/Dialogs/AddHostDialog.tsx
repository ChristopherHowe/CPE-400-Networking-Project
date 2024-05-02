import SmoothDialog from './Dialog';
import { useState } from 'react';
import Textbox from '../Textbox';
import { Host } from '@/models/network';
import { generateUniqueMACAddress } from '@/utils';

interface AddHostDialogProps {
  open: boolean;
  onClose: () => void;
  addHost: (host: Host) => void;
}

export default function AddHostDialog(props: AddHostDialogProps) {
  const { open, onClose, addHost } = props;
  const [hostName, setHostName] = useState<string>('');
  const [macAddr, setMacAddr] = useState<string>('');

  const validationMsg = validateFields();

  function validateFields(): string {
    if (hostName.length < 1) {
      return 'Please enter a hostname';
    }
    return '';
  }

  async function onSubmit() {
    const newMac = await generateUniqueMACAddress();
    addHost({
      name: hostName,
      macAddress: macAddr !== '' ? macAddr : newMac,
      queuedPackets: [],
      recievedPackets: [],
      gateway: '',
    });
    onClose();
  }

  return (
    <SmoothDialog title="Add a New Host" {...{ open, onClose, onSubmit, validationMsg }}>
      <Textbox label="Host Name" value={hostName} setValue={setHostName} />
      <Textbox label="Mac Address (optional)" value={macAddr} setValue={setMacAddr} />
    </SmoothDialog>
  );
}
