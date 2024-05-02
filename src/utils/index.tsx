import { Datagram } from '@/models/network';

const usedMACAddresses: Set<string> = new Set();

function randomMacAddress(): string {
  return 'XX:XX:XX:XX:XX:XX'.replace(/X/g, function () {
    return '0123456789ABCDEF'.charAt(Math.floor(Math.random() * 16));
  });
}

export async function generateUniqueMACAddress(): Promise<string> {
  let macAddress: string;
  do {
    macAddress = randomMacAddress();
  } while (usedMACAddresses.has(macAddress));
  usedMACAddresses.add(macAddress);
  return macAddress;
}

export default function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function getRandomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function DatagramToString(d: Datagram): string {
  return `{{data: ${d.segment.data}}, srcPort: ${d.segment.srcPort}, destPort:${d.segment.destPort}}, srcIP: ${d.srcIP}, destIP: ${d.destIP}}`;
}
