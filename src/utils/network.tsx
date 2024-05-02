import * as ip from 'ip';
import { Datagram, Router } from '@/models/network';
import { Edge } from 'reactflow';

/**
 * Gets the first available ip address not contained in the leases array
 * @param cidr
 * @param leases
 * @returns
 */
export function findUnusedIP(router: Router) {
  const subnet = ip.cidrSubnet(router.subnet);
  const hostBits = 32 - subnet.subnetMaskLength;
  const min = subnet.firstAddress;

  for (let i = 0; i < 2 ** hostBits; i++) {
    const currentIP = ip.fromLong(ip.toLong(min) + i);
    if (!subnet.contains(currentIP)) {
      throw new Error('Generated an ip not contained in the subnet');
    }
    if (!router.activeLeases.some((lease) => lease.ipAddress === currentIP)) {
      if (!(router.intIPAddress === currentIP)) {
        return currentIP;
      }
    }
  }
  throw new Error(`Failed to find a valid IP for router ${router.macAddress}`);
}

export function isCIDRFormat(cidr: string): boolean {
  const parts = cidr.split('/');
  if (parts.length !== 2) return false; // CIDR should have two parts: IP address and subnet mask
  if (!ip.isV4Format(parts[0])) {
    return false;
  }
  // Validate subnet mask, should be a number between 0 and 32
  const subnetMask = parseInt(parts[1], 10);
  if (isNaN(subnetMask) || subnetMask < 0 || subnetMask > 32) {
    return false;
  }

  return true;
}

export function IPAndPortFromString(ipWithPort: string): [string, number] {
  const match = ipWithPort.split(':');
  if (match.length !== 2) {
    throw new Error(`Failed to split PAT Table entry internal ip ${ipWithPort} into a IP and a port`);
  }
  if (!ip.isV4Format(match[0])) {
    throw new Error(`IP from ${ipWithPort} is not a valid IP`);
  }
  const port = parseInt(match[1]);
  if (isNaN(port)) {
    throw new Error(`Port ${match[1]} from ${ipWithPort} is not a number`);
  }
  return [match[0], port];
}

function getAdjList(nodeMac: string, edges: Edge[]) {
  const adjList: string[] = [];
  for (const edge of edges) {
    if (edge.source === nodeMac) {
      adjList.push(edge.target);
    } else if (edge.target === nodeMac) {
      adjList.push(edge.source);
    }
  }
  return adjList;
}

export function getPath(destMac: string, srcMac: string, edges: Edge[]) {
  const visitedMacs: Set<string> = new Set();
  const path: string[] = [];

  const dfs = (start: string): boolean => {
    if (start === destMac) {
      path.push(start);
      return true;
    }
    visitedMacs.add(start);
    path.push(start);
    const adjList = getAdjList(start, edges);
    if (adjList) {
      for (const neighbor of adjList) {
        if (!visitedMacs.has(neighbor)) {
          if (dfs(neighbor)) {
            return true;
          }
        }
      }
    }

    path.pop();
    return false;
  };

  dfs(srcMac);
  if (path.length > 0) {
    return path.reverse(); // Reverse the path before returning
  } else {
    return null;
  }
}

export function wrapHTTPData(packetID: string, data: any, destIP: string, srcIP: string, srcPort: number): Datagram {
  return {
    id: packetID,
    destIP: destIP,
    srcIP: srcIP,
    segment: {
      destPort: 80,
      srcPort: srcPort,
      data: data,
    },
  };
}
