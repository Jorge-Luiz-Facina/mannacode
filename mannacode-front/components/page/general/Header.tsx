import React, { useState } from 'react'
/* eslint-disable-next-line no-unused-vars */
import { Fab, IconButton, Menu, Theme, Tooltip } from '@material-ui/core/';
import {
  createStyles, Divider, Drawer, FormControl, Select, List,
  ListItemIcon, ListItemText, makeStyles
} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import Link from '../../style/Link';
import { defaultProperties, palettes } from '../../base/Theme'
import clsx from 'clsx';
import MuiButton from '@material-ui/core/Button';
import { useRouter } from 'next/router'
import CssBaseline from '@material-ui/core/CssBaseline';
import HomeIcon from '@material-ui/icons/Home';
import ButtonLoginLogged from '../../style/ButtonMenu';
import palette from 'components/singleton/palette';
import ListItem from 'components/style/ListItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import headerItems from 'components/static/HeadLeft';
import { PathName } from 'components/static/Route';
import PropTypes from 'prop-types';
import { useAuth } from 'components/context/auth';
import MenuItemBasic from 'components/style/MenuItemBasic'
import Fade from '@material-ui/core/Fade';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';

const drawerWidth = 200;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
      flexGrow: 1,
      width: '100%',
      minHeight: defaultProperties.globalHeaderHeigth,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    toolBar: {
      paddingLeft: '0',
      minHeight: defaultProperties.globalHeaderHeigth
    },
    container: {
      alignItems: 'center',
      [theme.breakpoints.down('sm')]: {
        marginBottom: theme.spacing(1),
      },
    },
    title: {
      flexGrow: 1,
    },
    rootMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none'
      },
      flexGrow: 1,
      width: '100%',
      minHeight: defaultProperties.globalHeaderHeigth,

    },
    toolbarMobile: {
      minHeight: defaultProperties.globalHeaderHeigth,
      alignItems: 'center',
      paddingLeft: '10px',
      paddingRight: '0px',

    },
    buttonMobile: {
      borderRadius: theme.spacing(0.5),
      fontSize: '1.3rem',
      fontWeight: 'bold',
      paddingLeft: '0px',
      paddingRight: '0px',
    },
    menu: {
      marging: '0px',
      padding: '0px',
      '& div': {
        width: '100%',
        marging: '0px',
        padding: '0px',
        top: '80px',
        left: '0px',
        rigth: '0px',
        backgroundColor: '#051923',
        color: 'white',
      },
      '& ul li': {
        fontSize: '2.0rem',
        fontWeight: 'bold',
        fontFamily: 'Bahnschrift',
        fontStretch: 'condensed',
        color: '#F1011E',
      },

    },
    menuItem: {
      textAlign: 'center',
      width: '100%',
      justifyContent: 'center'
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    listItemText: {
      paddingLeft: '1rem',
      fontSize: '1.6rem',
      fontFamily: 'Bahnschrift',
      fontWeight: 'bold',
    },
    link: {
      color: defaultProperties.link.color,
    },
    iconItem: {
      padding: '2px',
      '& svg': {
        fontSize: '4rem'
      },
    },
  }),
);

interface MenuPerfil {
  name: string;
  link: string;
  divider: boolean;
  onClick(): void;
}

export default function HeaderAppBar(props) {
  const { onChange, paletteTheme } = props;
  const { signOut, signed, user } = useAuth();
  const classes = useStyles(props);
  const router = useRouter();
  const name = signed ? user?.name : ''
  const MenuItem = MenuItemBasic({ paletteTheme: paletteTheme });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  const open = Boolean(anchorEl);

  const headerLeft = headerItems[router.pathname] ? headerItems[router.pathname] : headerItems[PathName.home]

  const interfacePlayer = router.pathname.toString().includes(`${PathName.class}${PathName.player}`)
  const interfaceClear = (router.pathname === `${PathName.class}${PathName.player}${PathName.activities}${PathName.challenges}${PathName.challenge}` ||
    router.pathname === `${PathName.class}${PathName.player}${PathName.login}` ||
    router.pathname === `${PathName.class}${PathName.player}${PathName.activities}${PathName.challenges}${PathName.playerFinishedChallenge}`)
  if (router.pathname === PathName.room) {
    return (<></>);
  }

  const querys = (querys) => {
    let buildQuery = ''
    for (let query of querys) {
      buildQuery += `${query}=${router.query[query]}&`;
    }
    return buildQuery;
  }

  const checkQuerys = (querys) => {
    for (let query of querys) {
      if (!router.query[query]) {
        return false;
      }
    }
    return true;
  }

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };
  const logout = () => {
    signOut();
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const useStylesTheme = makeStyles((theme: Theme) =>
    createStyles({
      drawer: {
        backgroundColor: palette.get().card,
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
      },
      drawerOpen: {
        backgroundColor: palette.get().card,
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
      drawerClose: {
        backgroundColor: palette.get().card,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9) + 1,
        },
      },
      buttonSignUp: {
        borderRadius: theme.spacing(50),
        paddingLeft: '2rem',
        paddingRight: '1.2rem',
        fontSize: '1.4rem',
        fontWeight: 'bold',
        color: palette.get().primaryText,
        backgroundColor: palette.get().topGradient,
        '&:hover': {
          backgroundColor: palette.get().bottomGradient,
          color: palette.get().secondaryText,
        },
      },
      buttonSignUpMobile: {
        borderRadius: theme.spacing(50),
        paddingLeft: '0.8rem',
        paddingRight: '0.8rem',
        fontSize: '1rem',
        fontWeight: 'bold',
        color: palette.get().primaryText,
        backgroundColor: palette.get().topGradient,
        '&:hover': {
          backgroundColor: palette.get().bottomGradient,
          color: palette.get().secondaryText,
        },
      },
      iconItem: {
        '& svg': {
          fontSize: '3.5rem',
          color: palette.get().secondaryText,
        }
      },
      menuSelect: {
        top: '52px !important',
        border: '1px solid black',
        borderRadius: '5%',
        backgroundColor: palette.get().card
      },
      menuSelectPlayer: {
        border: '1px solid black',
        borderRadius: '5%',
        backgroundColor: palette.get().card
      },
      select: {
        fontSize: '1.6rem',
        fontFamily: 'Bahnschrift',
        fontWeight: 'bold',
        height: '4rem',
        '& div': {
          paddingTop: '1.1rem',
          paddingBottom: '0.9rem',
          height: '2rem',
          paddingRight: '0.6rem !important',
        },
        '& ul': {
          backgroundColor: palette.get().secondaryText,
        },
        '&:before': {
          borderColor: palette.get().secondaryText,
        },
        '&:after': {
          borderColor: palette.get().primaryText,
        },
        [theme.breakpoints.down('xs')]: {
          fontSize: '1.3rem',

        },
      },
    }),
  );
  const classesTheme = useStylesTheme()

  const itemsUser: MenuPerfil[] = [
    { name: 'Plano', link: '/plan', divider: false, onClick() { } },
    { name: 'Perfil', link: '/profile', divider: true, onClick() { } },
    { name: 'Sair', link: '/login', divider: false, onClick() { logout(); } }];

  const HeaderLeft = () => {
    return (<Drawer
      onMouseOver={handleDrawerOpen}
      onClick={handleDrawerOpen}
      onClose={handleDrawerClose}
      onMouseLeave={handleDrawerClose}
      variant="permanent"
      className={clsx(classesTheme.drawer, {
        [classesTheme.drawerOpen]: openDrawer,
        [classesTheme.drawerClose]: !openDrawer,
      })}
      classes={{
        paper: clsx({
          [classesTheme.drawerOpen]: openDrawer,
          [classesTheme.drawerClose]: !openDrawer,
        }),
      }}
      style={{ display: !interfaceClear && (interfacePlayer || signed) ? 'flex' : 'none' }}
    >

      <div>
        {!interfacePlayer ? <ListItem palette={palette.get()} height='58px'
          link={'/'}
          selected={'/' === router.pathname}
        >
          <>
            <ListItemIcon className={classesTheme.iconItem}> <HomeIcon /></ListItemIcon>
            <ListItemText classes={{ primary: classes.listItemText }}
              style={{ color: palette.get().primaryText }} primary={'Home'} />
          </>
        </ListItem> :
          <ListItem palette={palette.get()}
            link={`${PathName.class}${PathName.player}${PathName.profile}`}
            selected={`${PathName.class}${PathName.player}${PathName.profile}` === router.pathname}
          >
            <>
              <ListItemIcon className={classesTheme.iconItem}> <PersonIcon /></ListItemIcon>
              <ListItemText classes={{ primary: classes.listItemText }}
                style={{ color: palette.get().primaryText }} primary={'Perfil'} />
            </>
          </ListItem>}
      </div>
      <Divider />
      <List>
        {headerLeft.map((item, index) => (
          <ListItem key={index + 1}
            link={item.linkParams ? checkQuerys(item.linkParams) ? (`${item.link}?${querys(item.linkParams)}`) : null : item.link}
            palette={palette.get()}
            selected={item.link === router.pathname}
          >
            <>
              <ListItemIcon className={classesTheme.iconItem}>{item.icon}</ListItemIcon>
              <ListItemText classes={{ primary: classes.listItemText }}
                style={{ color: palette.get().primaryText }} primary={item.name} />
            </>
          </ListItem>
        ))}
      </List>
      {interfacePlayer ? <div >
        <ListItem palette={palette.get()}

        >
          <FormControl fullWidth>
            <Select className={classesTheme.select}
              style={{ color: palette.get().secondaryText, backgroundColor: palette.get().card }}
              MenuProps={{ classes: { paper: classesTheme.menuSelectPlayer } }}
              defaultValue={''}
              value={paletteTheme}
              onChange={onChange}
              IconComponent={() => (
                <ExpandMoreIcon />
              )}
            >
              {palettes.map((item, index) => (
                <MenuItem key={index}
                  // @ts-ignore [1]
                  value={item} click={null}
                  palette={palette.get()}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </ListItem>

      </div> : <></>}

    </Drawer>
    )
  }

  if (interfacePlayer) {
    return (<div>
      {HeaderLeft()}
    </div>)
  }
  return (
    <div>
      <div className={classes.root}>
        <AppBar position="fixed" className={clsx(classes.appBar, {
          [classes.appBarShift]: openDrawer,
        })}
        style={{
          backgroundColor: palette.get().card,
        }}>
          <CssBaseline />
          <Toolbar className={classes.toolBar}>
            <Grid container justify='space-between' className={classes.container}>
              <Grid item sm={1} >
                <div className={clsx(classes.menuButton, {
                  [classes.hide]: openDrawer,
                })} > <IconButton
                    className={classesTheme.iconItem}
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={() => { router.push('/') }}
                    style={{ paddingLeft: '16px' }}
                  >
                    <HomeIcon />
                  </IconButton></div>
              </Grid>
              <Grid item sm={10}>
                <Grid container justify='flex-end' alignItems="center" className={classes.container} spacing={7}>
                  <Grid item>
                    <Typography variant="h6" className={classes.title}>
                      <Link href="/about">Sobre</Link>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <div>
                      <FormControl fullWidth>
                        <Select className={classesTheme.select}
                          style={{ color: palette.get().secondaryText, backgroundColor: palette.get().card }}
                          MenuProps={{ classes: { paper: classesTheme.menuSelect } }}
                          defaultValue={''}
                          value={paletteTheme}
                          onChange={onChange}
                          IconComponent={() => (
                            <ExpandMoreIcon />
                          )}
                        >
                          {palettes.map((item, index) => (
                            <MenuItem key={index}
                              // @ts-ignore [1]
                              value={item} click={null}
                              palette={palette.get()}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item >
                    <Link href={signed ? '' : '/login'} >{signed ?
                      <ButtonLoginLogged palette={palette.get()} items={itemsUser}>{name}</ButtonLoginLogged>
                      :
                      <MuiButton
                        className={classesTheme.buttonSignUp}
                        fullWidth
                      > {'Login / Cadastro'}</MuiButton>}
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

      </div>

      <div className={classes.rootMobile}>
        <AppBar position="fixed" className={clsx(classes.appBar, {
          [classes.appBarShift]: openDrawer,
        })}
        style={{
          backgroundColor: palette.get().card,
        }}>
          <Toolbar className={classes.toolbarMobile}>
            <Grid container justify='space-between' className={classes.container}>

              <Grid item xs={2} sm={3}
                container
                direction="column"
                justify="flex-start"
                alignItems="flex-start">
                <Link className={classes.link} href='/?counter=10'>
                  <div className={clsx(classes.menuButton, {
                    [classes.hide]: openDrawer,
                  })} > <IconButton
                      className={classesTheme.iconItem}
                      aria-label="more"
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      onClick={() => { router.push('/') }}
                      style={{ paddingLeft: '16px' }}
                    >
                      <HomeIcon />
                    </IconButton></div>
                </Link>
              </Grid>

              <Grid item xs={2} sm={2}>
                <div>
                  <FormControl fullWidth>
                    <Select className={classesTheme.select}
                      style={{ color: palette.get().secondaryText, backgroundColor: palette.get().card }}
                      MenuProps={{ classes: { paper: classesTheme.menuSelect } }}
                      defaultValue={''}
                      value={paletteTheme}
                      onChange={onChange}
                      IconComponent={() => (
                        <ExpandMoreIcon />
                      )}
                    >
                      {palettes.map((item, index) => (
                        <MenuItem key={index}
                          // @ts-ignore [1]
                          value={item} click={null}
                          palette={palette.get()}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={5} sm={5} style={{ textAlignLast: 'right' }}>
                <Link className={classes.link} href={signed ? '' : PathName.login}>
                  {signed ?
                    <ButtonLoginLogged palette={palette.get()}
                      items={itemsUser}>Menu
                    </ButtonLoginLogged>
                    : <MuiButton
                      className={classesTheme.buttonSignUpMobile}

                      variant="contained"
                    >{'Login/Cadastro'}
                    </MuiButton>
                  }
                </Link>
              </Grid>
              <div>
                <MuiButton
                  className={classes.buttonMobile}
                  style={{ backgroundColor: palette.get().card, color: palette.get().primaryText }}
                  fullWidth
                  aria-controls="fade-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                  startIcon={<MenuIcon />}
                />
                <Menu style={{ top: '50px' }}
                  id="fade-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                  className={classes.menu}
                >
                  <MenuItem className={classes.menuItem} onClick={handleClose}>
                    <Link className={classes.link} href="\about">Sobre</Link>
                  </MenuItem>
                </Menu>
              </div>
            </Grid>
          </Toolbar>
        </AppBar>
      </div>
      {HeaderLeft()}
      {!signed ? <Fab onClick={() => { window.open('https://wa.me/5544997407511', '_ blank') }} className={classes.iconItem} style={{
        position: 'fixed', color: 'white', bottom: 25,
        right: 25, zIndex: 9999, backgroundColor: '#25D366'
      }} >
        <Tooltip placement="left"
          title={<Typography>Contato</Typography>} style={{ backgroundColor: '#25D366' }}>
          <WhatsAppIcon />
        </Tooltip>
      </Fab > : <></>}
    </div >
  );
}

HeaderAppBar.defaultProps = {
  onChange: null,
  paletteTheme: null,
};

HeaderAppBar.propTypes = {
  onChange: PropTypes.any,
  paletteTheme: PropTypes.any,
};