import React from 'react';
import Typography from '@material-ui/core/Typography';
/* eslint-disable-next-line no-unused-vars */
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import BasePage from 'components/page/general/BasePage';
import { defaultProperties } from '../components/base/Theme';
import palette from 'components/singleton/palette';
import { Grid } from '@material-ui/core';

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
  }
}));

export default function Home() {
  const classes = useStyles();
  const useStylesTheme = makeStyles((theme: Theme) =>
    createStyles({
      textItem: {
        textAlign: 'left',
        '& span': {
          textAlign: 'left',
          fontSize: '2.5rem',
          fontFamily: 'Bahnschrift',
          color: palette.get().secondaryText,
          [theme.breakpoints.down('xs')]: {
            fontSize: '1.5rem',
          },
        },
      },
      text: {
        fontSize: '3rem',
        textAlign: 'left',
        color: palette.get().secondaryText,
        [theme.breakpoints.down('xs')]: {
          fontSize: '2rem',
        },
      },
      textTitle: {
        fontSize: '5rem',
        textAlign: 'center',
        color: palette.get().secondaryText,
        [theme.breakpoints.down('xs')]: {
          fontSize: '2rem',
        },
      },
    }),
  );
  const classesTheme = useStylesTheme()
  return (
    BasePage(
      <div className={classes.div} style={{ backgroundColor: palette.get().background }}>
        <Grid className={classes.gridRoot} style={{ width: '80%' }}
          container
          direction="column"
          justify="space-evenly"
          alignItems="center"
        >
          <Typography className={classesTheme.textTitle}>Intuito da class-coding </Typography>
          <Typography className={classesTheme.text} >Poder auxiliar professores,
            desenvolvedores e empresas no ambiente da educação e programação.
          </Typography>
          <div style={{ padding: '3rem' }}></div>
          <Typography className={classesTheme.textTitle}>Modelos</Typography>

          <Typography className={classesTheme.text} >Multiplayer: Desafie sua equipe/alunos em modo um multiplayer em um modelo competitivo ou casual.
          </Typography>

          <Typography className={classesTheme.text} >Turma: Crie sua turma e dasafie sua equipe/alunos para resolver os desafios no prazo determinado.
          </Typography>
          <div style={{ padding: '3rem' }}></div>
          <Typography className={classesTheme.textTitle}>Cadastre-se</Typography>
          <Typography className={classesTheme.text} >Ao cadastrar você ganha direito a testar por 7 dias com 3 jogadores.
          </Typography>
          <div style={{ padding: '3rem' }}></div>
          <Typography className={classesTheme.textTitle}>Planos</Typography>

          <Typography className={classesTheme.text} >Para consultar os planos disponiveis entre contato com 55 44 997407511
          </Typography>
          <div style={{ padding: '3rem' }}></div>
          <Typography className={classesTheme.textTitle}>Ajude a plataforma evoluir</Typography>

          <Typography className={classesTheme.text} >Envie seu feedback para classcodingcontato@gmail.com
          </Typography>
          <Grid>
          </Grid>
        </Grid>
      </div >
    )
  )
}
