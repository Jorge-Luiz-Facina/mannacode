import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import MuiButton from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Link from '../components/style/Link';
import BasePage from '../components/page/general/BasePage';
import { PathName } from '../components/static/Route';
import palette from 'components/singleton/palette';

const useStyles = makeStyles((theme) => ({
  div: {
    minHeight: '93vh',
    width: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    justifyContent: 'center',
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
    fontSize: '1.4rem',
    fontFamily: 'IBM Plex Sans',
    width: '100%',
    paddingTop: '1rem',
    paddingBottom: '1rem',
  },
}));

export default function page404() {
  const classes = useStyles();
  return (
    BasePage(
      <div className={classes.div} style={{background: palette.get().background}}>
        
        <Grid
          className={classes.divValidate}
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid
            className={classes.area}
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <div className={classes.fields}>
              <Grid className={classes.divContainer} item>
                <Typography className={classes.textTitleArea}>
                  Essa pagina não existe
                </Typography>
              </Grid>
            </div>
          </Grid>
          <Grid
            className={classes.area}
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{paddingTop: 0}}
          >
            <div className={classes.fields}>
              <div className={classes.divField}>
                <Link href={PathName.home} >
                  <MuiButton
                    type="button"
                    style={{ height: 45, color: palette.get().topGradient, fontSize:'1.8rem'}}
                    fullWidth
                    variant='outlined'
                    color="primary"
                  > Voltar para pagina inicial</MuiButton>
                </Link>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>,
    )
  );
}
