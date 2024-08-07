import type { AppProps } from 'next/app';

import '../styles/globals.scss';

import '../services/firebase';
import { AuthProvider } from '../contexts/authContext';

export default function MyApp({ Component, pageProps }: AppProps) {

  return (
    <AuthProvider>

      <Component {...pageProps} />
      
    </AuthProvider>
  );
}

