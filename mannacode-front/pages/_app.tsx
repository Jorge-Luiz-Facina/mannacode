import React, { useEffect, useState } from 'react';
import '../styles/globals.css'
/* eslint-disable-next-line no-unused-vars */
import theme, { Palette, paletteDark, palettes } from '../components/base/Theme';
import { ThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { AuthProvider } from 'components/context/auth';
import Router from 'next/router'
import NProgress from 'nprogress'
import Head from 'next/head';
import HeaderAppBar from 'components/page/general/Header';
import { getLocalStorage, LocalStorageItem } from 'components/static/LocalStorage';
import palette from 'components/singleton/palette';

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({ Component, pageProps }) {
  const [paletteTheme, setPaletteTheme] = useState<Palette>(paletteDark);

  const handleChange = (event: React.ChangeEvent<{ value: Palette }>) => {
    palette.set(event.target.value as Palette);
    localStorage.setItem(LocalStorageItem.paletteTheme, event.target.value.tag);
    setPaletteTheme(event.target.value as Palette);
  };

  useEffect(() => {
    const paletteLocalStorage = getLocalStorage(LocalStorageItem.paletteTheme);
    if (paletteLocalStorage && paletteLocalStorage !== paletteTheme.tag) {
      const paletteColors = palettes.find(p => p.tag === paletteLocalStorage)
      palette.set(paletteColors);
      setPaletteTheme(paletteColors);
    }
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <>
          <Head>
            <title>Class Coding</title>
            <meta name="description" content="Crie desafios de programação e desafie seus alunos/equipe para resolvê-los em um modelo de turma ou multiplayer." />
            <meta property="og:title" content="Class Coding" />
            <meta property="og:description" content="Crie desafios de programação e desafie seus alunos/equipe para resolvê-los em um modelo de turma ou multiplayer." />
            <meta property="og:url" content="https://www.class-coding.com/" />
            <meta property="og:type" content="website" />
            <link rel="stylesheet" type="text/css" href="/nprogress.css" />
          </Head>
          <HeaderAppBar paletteTheme={paletteTheme} onChange={handleChange}></HeaderAppBar>
          <Component {...pageProps} />
        </>
      </AuthProvider>
    </ThemeProvider>
  )
}
MyApp.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.any.isRequired,
};
export default MyApp
