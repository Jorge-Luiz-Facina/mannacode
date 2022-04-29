import React from 'react';
import Typography from '@material-ui/core/Typography';
import {
  createStyles, makeStyles,
  /* eslint-disable-next-line no-unused-vars */
  Theme
} from '@material-ui/core/styles';
import BasePage from 'components/page/general/BasePage';
import { defaultProperties } from '../components/base/Theme';
import palette from 'components/singleton/palette';
import { Grid, Paper } from '@material-ui/core';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
const useStyles = makeStyles(theme => ({
  div: {
    width: '100%',
    position: 'relative',
    scrollMarginTop: defaultProperties.globalHeaderHeigth,
    display: 'flex',
    padding: theme.spacing(0, 1),
    justifyContent: 'center',
  },
  gridRoot: {
    paddingTop: '15rem',
    paddingBottom: '15rem'
  },
  image: {
    zIndex: 0,
    width: '100%',
    height: '100%',
  },
}));

export default function Home() {
  const classes = useStyles();
  const useStylesTheme = makeStyles((theme: Theme) =>
    createStyles({
      text: {
        fontSize: '5rem',
        textAlign: 'center',
        color: palette.get().secondaryText,
        [theme.breakpoints.down('xs')]: {
          fontSize: '3rem',
        },
      },
    }),
  );
  const classesTheme = useStylesTheme()
  return (
    BasePage(
      < div className={classes.div} style={{ backgroundColor: palette.get().background }}>
        <Grid className={classes.gridRoot} style={{ width: '80%' }}
          container
          direction="column"
          justify="space-around"
          alignItems="center"
        >
          <Grid>
            <Typography className={classesTheme.text} variant='h2'>Crie desafios de programação e desafie seus alunos/equipe para resolvê-los em um modelo de turma ou multiplayer.</Typography>
          </Grid>
          <div style={{ paddingBottom: '5rem' }}> </div>
          <Grid>
            <Carousel
              width='80%'
              showArrows={false}
              interval={5000}
              autoPlay={true}
              showStatus={false}
              showThumbs={false}
              infiniteLoop={true}
            >
              <Paper >
                <img className={classes.image} src="/images/soma_java_inicio.png" />
              </Paper>
              <Paper >
                <img className={classes.image} src="/images/soma_java_ok.png" />
              </Paper>
              <Paper >
                <img className={classes.image} src="/images/soma_java_erro.png" />
              </Paper>
              <Paper >
                <img className={classes.image} src="/images/soma_python_ok.png" />
              </Paper>
            </Carousel>
          </Grid>
        </Grid>
      </div >
    )
  )
}