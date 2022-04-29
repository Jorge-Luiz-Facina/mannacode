import React from 'react'
import { makeStyles } from '@material-ui/core'
import { useEffect, useState } from 'react';
import clsx from 'clsx';
/* eslint-disable-next-line no-unused-vars */
import { defaultProperties, Palette, paletteDark, palettes } from '../../base/Theme';
import palette from 'components/singleton/palette';
import { LocalStorageItem, getLocalStorage } from 'components/static/LocalStorage';
import { useAuth } from 'components/context/auth';
import { PathName } from 'components/static/Route';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: `${defaultProperties.globalHeigthVH}`,
    padding: '0px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  main: {
    width: '100%',
    padding: '0px',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    scrollMarginTop: `${defaultProperties.globalHeaderHeigth}px`,
  },
  mainSigned: {
    width: defaultProperties.globalWidth,
    scrollMarginTop: `${defaultProperties.globalHeaderHeigth}px`,
    marginLeft: 'auto',
    [theme.breakpoints.down('xs')]: {
      width: defaultProperties.globalWidthXS,
    },
    padding: '0px',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
  },
}));

export default function BasePage(children) {
  const classes = useStyles();
  const [paletteTheme, setPaletteTheme] = useState<Palette>(paletteDark);
  const { signed, requiredSigned, setRequiredSigned } = useAuth();
  const router = useRouter();
  const interfaceClear = (router.pathname === `${PathName.class}${PathName.player}${PathName.activities}${PathName.challenges}${PathName.challenge}` ||
  router.pathname === `${PathName.class}${PathName.player}${PathName.login}`)
  useEffect(() => {
    const storagedUser = getLocalStorage(LocalStorageItem.user);
    if ((storagedUser === null || storagedUser === 'null') && requiredSigned) {
      setRequiredSigned(false);
      localStorage.setItem(LocalStorageItem.routeLogin, router.asPath);
      router.push(`${PathName.notLogged}?routePage=true`);
    }
  }, [requiredSigned]);

  useEffect(() => {
    const paletteLocalStorage = getLocalStorage(LocalStorageItem.paletteTheme);
    if (paletteLocalStorage && paletteLocalStorage !== paletteTheme.tag) {
      const paletteColors  = palettes.find(p => p.tag === paletteLocalStorage)
      palette.set(paletteColors);
      setPaletteTheme(paletteColors);
    }
  }, [])
  return (
    <div className={classes.container}>
      <main   className={clsx(classes.main, {
        [classes.mainSigned]: (signed && !interfaceClear),
      })}>
        {children}
      </main>
      {/* <Footer></Footer> */}
    </div>
  )
}
