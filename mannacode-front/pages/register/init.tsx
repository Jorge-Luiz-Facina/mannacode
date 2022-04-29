import React from 'react';
import BasePage from '../../components/page/general/BasePage';
import { makeStyles } from '@material-ui/core/styles';
import { defaultProperties } from '../../components/base/Theme';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { validateEmail } from '@/services/users'
import palette from 'components/singleton/palette';

const useStyles = makeStyles(theme => ({
  div: {
    minHeight: '93vh',
    width: '100%',
    position: 'relative',
    scrollMarginTop: `${defaultProperties.globalHeaderHeigth}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textTitleArea: {
    color: '#4c4c4c',
    fontFamily: 'Bahnschrift',
    fontSize: '3.5rem',
    fontWeight: 'bold',
    fontStretch: 'condensed',
    textAlign: 'center',
    paddingBottom: '2rem',
  },
  divValidate: {
    padding: 0,
    backgroundColor: 'white',
    zIndex: 10,
    width: '31%',
    minHeight: '60%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '65%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  divContainer: {
    zIndex: 10,
    width: '100%',
    maxWidth: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fields: {
    width: '70%',
    zIndex: 10,
    position: 'relative',
    verticalAlign: 'middle',
    [theme.breakpoints.down('xs')]: {
      width: '80%',
    },
  },
}));

export default function init({ response }) {
  const classes = useStyles()
  const router = useRouter()
  const [isValidate, setValidate] = useState<any>(null)
  const [message, setMessage] = useState<any>(null)
  useEffect(() => {
    if (response.ok) {
      window.setTimeout(function () {
        router.push('/login')
      }, 3000)
    }
    else
      setMessage(response.data.message)
    setValidate(response.ok)
  }, [response])

  return (
    BasePage(
      <div className={classes.div} style={{background: palette.get().background}}>
        <Grid className={classes.divValidate}
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <div className={classes.fields}>

            <Grid className={classes.divContainer} item >
              <Typography className={classes.textTitleArea} style={{ display: isValidate === null ? 'flex' : 'none' }}>
                Validando E-mail...
              </Typography>

              <Typography className={classes.textTitleArea} style={{ display: isValidate === false ? 'flex' : 'none' }}>
                {message}
              </Typography>

              <Typography className={classes.textTitleArea} style={{ display: isValidate === true ? 'flex' : 'none' }}>
                E-mail confirmado com sucesso!
              </Typography>
            </Grid>
          </div>
        </Grid >
      </div >
    )
  )
}

init.getInitialProps = async ({ query }) => {
  const { token } = query
  const response = await validateEmail(token);
  return { response }
}