import { useState } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { AppShell, MantineProvider, ColorSchemeProvider, ColorScheme } from "@mantine/core";

import { SignerContext, IAuthData } from '../context/SignerContext';
import { RouterTransition } from '@/components/router/RouterTransition';
import { Notifications } from '@mantine/notifications';

import AppHeader from "@/components/app-header/AppHeader";
import AppNav from "@/components/app-nav/AppNav";

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [authData, setAuthData] = useState<IAuthData>({isLogin: false});
  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <>
      <Head>
        <title>Puzzlify</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <SignerContext.Provider value={{authData, setAuthData}}>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme }}
      >
        <Notifications />
        <RouterTransition />
        <AppShell
            padding="md"
            fixed={false}
            header={
              <AppHeader />
            }
            navbar={<AppNav />}
            styles={(theme) => ({
              main: { backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
          >
            <Component {...pageProps} />
        </AppShell>
      </MantineProvider>
      </ColorSchemeProvider>
      </SignerContext.Provider>
    </>
  );
}