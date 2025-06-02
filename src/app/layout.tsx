import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import './globals.css';
import { Provider } from '@/components/ui/provider';
import { Box, VStack } from '@chakra-ui/react';
import { Toaster } from '@/components/ui/toaster';

const raleway = Raleway({
  variable: '--font-raleway',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Stephanie - GitHub repositories explorer',
  description: 'Created by Stephanie',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${raleway.variable}`}>
        <Provider>
          <Box bg={'black'}>
            <VStack
              maxW="496px"
              minH={'100vh'}
              margin="0 auto"
              paddingX="4"
              paddingY="8"
              bg={'gray.50'}
              color={'black'}
            >
              {children}
            </VStack>
            <Toaster />
          </Box>
        </Provider>
      </body>
    </html>
  );
}
