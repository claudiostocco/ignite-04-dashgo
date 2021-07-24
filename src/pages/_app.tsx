import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { theme } from '../styles/theme';
import { SideBarDrawerProvider } from '../contexts/SideBarDrawerContext';
import { makeServer } from '../services/mirage';
import { queryClient } from '../services/queryClient';
import { AuthProvider } from '../contexts/AuthContext';

if (process.env.NODE_ENV === 'development') {
  // makeServer();
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChakraProvider theme={theme}>
          <SideBarDrawerProvider>
            <Component {...pageProps} />
          </SideBarDrawerProvider>
        </ChakraProvider>
      </AuthProvider>

      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default MyApp
