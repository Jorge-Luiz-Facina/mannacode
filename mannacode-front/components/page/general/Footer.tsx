import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  footer: {
    width: '100%',
    height: '100%'
  },
  globalDiv: {
    backgroundColor: '#201316',
    minWidth: '100%',
    minHeight: '100%',
    paddingTop: theme.spacing(1)
  },
  block: {
    [theme.breakpoints.down('sm')]: {
      padding: '25px',
    },
  },
  logoFooter: {
    [theme.breakpoints.down('sm')]: {
      padding: '25px',
      height: '180px',
    },
    padding: '25px',
    height: '200px',
  },
  textItemTitle: {
    zIndex: 10,
    color: '#575656',
    fontSize: '2.2rem',
    fontFamily: 'Poppins',
    fontStretch: 'semiBold',
    lineHeight: '1rem',
    '&.active, &:hover, &.active:hover': {
      color: '#F1011E',
    }
  },
  textItem: {
    zIndex: 10,
    color: ' #8A8A8A',
    fontSize: '1.8rem',
    fontFamily: 'Poppins',
    fontStretch: 'medium',
    lineHeight: '0.2rem',
  },
  textItemLink: {
    zIndex: 10,
    color: ' #8A8A8A',
    fontSize: '1.8rem',
    fontFamily: 'Poppins',
    fontStretch: 'medium',
    lineHeight: '0.2rem',
    '&.active, &:hover, &.active:hover': {
      color: '#F1011E',
    }
  },
  iconItem: {
    color: '#707070',
    '& svg': {
      fontSize: '4rem'
    },
    '&.active, &:hover, &.active:hover': {
      color: '#F1011E',
    }
  },
  imageIcon: {
    height: '100%',
    width: '100%',
    alignItems: 'center'
  },
  iconRoot: {
    fontSize: '3.5rem',
    textAlign: 'center',
    color: '#F1011E',
  }
}));

export default function Footer() {
  const classes = useStyles()

  return (
    <footer className={classes.footer}>
      <div className={classes.globalDiv}>
        <Grid item xs={12}>
          <Grid container justify="space-around" alignItems="center">


                        
          </Grid>
        </Grid>
      </div>
    </footer>
  )
}
