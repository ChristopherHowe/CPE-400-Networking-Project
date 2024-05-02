import App from '@/components/App';
import { NetworkContextProvider } from '@/components/NetworkContext';

export default function Index() {
  return (
    <NetworkContextProvider>
      <App />
    </NetworkContextProvider>
  );
}
