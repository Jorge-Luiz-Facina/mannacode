import React from 'react';
import BasePage from '../../components/page/general/BasePage';
import { makeStyles } from '@material-ui/core/styles';
import { defaultProperties } from '../../components/base/Theme';
import { Grid } from '@material-ui/core';
import MuiButton from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Link from '../../components/style/Link';
import { useRouter } from 'next/router';
import { sendEmailConfirm } from '@/services/users'
import { useState } from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
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
  textSubTitleArea: {
    color: '#4c4c4c',
    fontWeight: 'bold',
    fontStretch: 'condensed',
    fontSize: '2rem',
    textAlign: 'center'
  },
  divValidate: {
    padding: 0,
    backgroundColor: 'white',
    zIndex: 10,
    width: '31%',
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
  area: {
    paddingTop: '4rem',
    paddingBottom: '4.0rem',
    borderBottomColor: 'rgba(112, 112, 112, 0.3)',
    borderBottom: '1px solid',
    [theme.breakpoints.down('xs')]: {
      paddingTop: '0.5rem',
      paddingBottom: '0.5rem',
    },
  },
  divField: {
    paddingTop: '6rem',
    paddingBottom: '1rem',
    width: '100%',
  },
  button: {
    fontSize: '1.6rem',
    width: '100%',
    paddingTop: '1rem',
    paddingBottom: '1rem',
  },
  textClose: {
    textAlign: 'center',
    color: '#0F61FD',
    fontSize: '1.6rem',
    fontWeight: 'bold',
    fontFamily: 'Bahnschrift',
    paddingTop: '2rem',
    [theme.breakpoints.down('xs')]: {
      paddingTop: '1rem',
      paddingBottom: '1rem',
    },
  },
  textError: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#DA1E27',
    fontFamily: 'IBM Plex Sans',
    margin: 0,
  }
}));


export default function validate() {
  const classes = useStyles()
  const router = useRouter()

  const { email } = router.query
  const [messageEmail, setMessageEmail] = useState<any>(null)

  const handleSubmit = async e => {
    e.preventDefault()
    const response = await sendEmailConfirm(email)
    if (!response.ok)
      setMessageEmail(response.data.message)
  }

  return (
    BasePage(
      <div className={classes.div} style={{background: palette.get().background}}>
        <Grid className={classes.divValidate}
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid className={classes.area}
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <div className={classes.fields}>

              <Grid className={classes.divContainer} item >
                <Typography className={classes.textTitleArea}>
                  CADASTRO EFETUADO NA PLATAFORMA
                </Typography>
              </Grid>
            </div>
          </Grid>
          <Grid className={classes.area}

            container
            direction="column"
            justify="center"
            alignItems="center">
            <div className={classes.fields}>
              <Grid className={classes.divContainer} item >
                <Typography className={classes.textTitleArea}>
                  VALIDAÇÃO DE E-MAIL
                </Typography>
              </Grid>
              <Grid className={classes.divContainer} item >
                <Typography className={classes.textSubTitleArea}>
                  Acabamos de te enviar um e-mail de confirmação.
                </Typography>
              </Grid>
              <form onSubmit={handleSubmit}>
                <div className={classes.divField}>
                  <MuiButton
                    type="submit"
                    className={classes.button}
                    style={{ backgroundColor: palette.get().topGradient, color: palette.get().primaryText }}
                    fullWidth
                    variant='outlined'
                  >Enviar novamente</MuiButton>
                </div>
              </form >
              <Grid
                container
                justify="center"
                alignItems="center"
              >
                <Link href="/login">
                  <Typography className={classes.textClose}>
                    Login
                  </Typography>
                </Link>
              </Grid>
              <FormHelperText className={classes.textError} {...(messageEmail !== null && { error: true })}>{messageEmail !== null ? messageEmail : ''}</FormHelperText>
            </div>
          </Grid>
        </Grid >

      </div >
    )
  )
}