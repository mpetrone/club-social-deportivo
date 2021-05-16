import React, { useState, useEffect } from 'react';
import Head from 'next/head';

import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { darkTheme, lightTheme } from '../src/utils/theme';
import Navbar from '../src/components/Navbar';

const App = ({ Component, pageProps }) => {
  const [darkMode, setDarkMode] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [provider, setProvider] = useState(undefined);
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    // Setup darkmode
    setDarkMode(
      localStorage.getItem('mode')
        ? parseInt(localStorage.getItem('mode'))
        : 0
    )
    // Naive check for mobile
    setIsMobile(
      navigator.userAgent.match(
        /(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i
      )
    )
  }, []);

  const toggleMode = () => {
    localStorage.setItem('mode', (1 - darkMode).toString())
    setDarkMode(1 - darkMode)
  }

  const muiTheme = darkMode ? lightTheme : darkTheme;

  return (
    <React.Fragment>
      <Head>
        <title>Dao FC</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Navbar
          {...pageProps}
          darkMode={darkMode}
          toggleMode={toggleMode}
          provider={provider}
          setProvider={setProvider}
          userAddress={userAddress}
          setUserAddress={setUserAddress}
        />
        <Component
          {...pageProps}
          darkMode={darkMode}
          isMobile={isMobile}
          injectedProvider={provider}
          userAddress={userAddress}
        />
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;