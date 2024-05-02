import SmoothDialog from './Dialog';
import { useState } from 'react';
import Textbox from '../Textbox';
import { Router } from '@/models/network';
import { generateUniqueMACAddress } from '@/utils';
import * as ip from 'ip';
import { isCIDRFormat } from '@/utils/network';

interface AddHostDialogProps {
  open: boolean;
  onClose: () => void;
  addRouter: (router: Router) => void;
}

export default function AddRouterDialog(props: AddHostDialogProps) {
  const { open, onClose, addRouter } = props;
  const [hostName, setHostName] = useState<string>('');
  const [intIPAddress, setIntIPAddress] = useState<string>('');
  const [macAddr, setMacAddr] = useState<string>('');
  const [subnet, setSubnet] = useState<string>('');

  function validateFields(): string {
    if (hostName.length < 1) {
      return 'Please enter a hostname';
    }
    if (!ip.isV4Format(intIPAddress)) {
      return 'Ip Address is invalid';
    }
    if (!isCIDRFormat(subnet)) {
      return 'Subnet string is not in CIDR Format';
    }
    return '';
  }

  const validationMsg = validateFields();

  async function onSubmit() {
    const newMac = await generateUniqueMACAddress();
    addRouter({
      name: hostName,
      macAddress: macAddr !== '' ? macAddr : newMac,
      intIPAddress: intIPAddress,
      extIPAddress: '',
      gateway: '',
      subnet: subnet,
      activeLeases: [],
      PATTable: [],
    });
    onClose();
  }

  return (
    <SmoothDialog title="Add a New Router" {...{ open, onClose, onSubmit, validationMsg }}>
      <p>Adding a Dynamic PAT Router...</p>
      <Textbox label="Host Name" value={hostName} setValue={setHostName} />
      <Textbox label="Internal Ip Address" value={intIPAddress} setValue={setIntIPAddress} />
      <Textbox label="Subnet (CIDR Form)" value={subnet} setValue={setSubnet} />
      <Textbox label="Mac Address (optional)" value={macAddr} setValue={setMacAddr} />
    </SmoothDialog>
  );
}
