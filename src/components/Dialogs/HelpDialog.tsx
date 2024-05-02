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
}

export default function HelpDialog(props: AddHostDialogProps) {
  const { open, onClose } = props;

  return (
    <SmoothDialog title="Help" {...{ open, onClose }} onSubmit={onClose} validationMsg="" submitLabel="Done">
      <div className="text-md w-[40rem]">
        <h1 className="text-xl mb-2 mt-3">Connecting components</h1>
        <div className="flex flex-row gap-2">
          <div className="bg-black rounded-full h-5 w-5 flex justify-center items-center">
            <div className="bg-red-500 border-white rounded-full border-2 h-4 w-4" />
          </div>
          <p>Signifies internal router network connection</p>
        </div>
        <div className="flex flex-row gap-2">
          <div className="bg-black rounded-full h-5 w-5 flex justify-center items-center">
            <div className="bg-gray-600 border-white rounded-full border-2 h-4 w-4" />
          </div>
          <p>Signifies external connection</p>
        </div>
        <h1 className="text-xl mb-2 mt-3">Routing</h1>
        <p>
          All routers implement something similar to dynamic PAT. Hosts can send to other hosts in their same network or
          in a public network that they are attached to. This means that hosts can not directly send requests to hosts
          behind private networks.
        </p>
        <h1 className="text-xl mb-2 mt-3">IP Leasing</h1>
        <p>
          No explicit DHCP Protocol is implemented to give IP addresses to devices in a network. Instead, each device is
          given the next available IP in the router it connected to. Currently, hosts can only connect to one router.
        </p>
      </div>
    </SmoothDialog>
  );
}
