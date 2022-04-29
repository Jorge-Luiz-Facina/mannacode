import React, { useState } from 'react';
import dynamic from 'next/dynamic'
import {
  AppBar, Box, FormControl, Grid, IconButton, makeStyles, MenuItem,
  Select, Tab, Tabs, Tooltip, Typography, Fab, createStyles
} from '@material-ui/core';
import {
  Fullscreen as FullscreenIcon, FullscreenExit as FullscreenExitIcon,
} from '@material-ui/icons';
/* eslint-disable-next-line no-unused-vars */
import ButtonMode from '../style/ButtonMode';
import TabPanel from 'components/style/TabPanel';
import LinearProgressWithLabel from 'components/style/LinearProgressWithLabel';
import languages from 'components/static/Languages';
import ReactQuill from 'components/style/ReactQuill';
import palette from 'components/singleton/palette';
import { sendPunctuation as applicatorSendPunctuation } from '@/services/applicatorChallengePunctuations';
import { sendPunctuation as playerSendPunctuation } from '@/services/playerChallengePunctuations';
import { getLocalStorage, LocalStorageItem } from 'components/static/LocalStorage';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { nextPlayerChallenge } from '@/services/nextPlayerChallenges';
import paletteCode from 'components/singleton/paletteCode';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const AceEditor = dynamic(
  async () => {
    const reactAce = await import('react-ace');
    await import('ace-builds/src-min-noconflict/ext-language_tools');

    await import('ace-builds/src-min-noconflict/mode-python');
    await import('ace-builds/src-min-noconflict/mode-java');
    await import('ace-builds/src-min-noconflict/mode-javascript');
    await import('ace-builds/src-min-noconflict/mode-csharp');

    await import('ace-builds/src-min-noconflict/theme-tomorrow_night');
    await import('ace-builds/src-min-noconflict/theme-textmate');

    let ace = require('ace-builds/src-min-noconflict/ace');
    ace.config.set(
      'basePath',
      'https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/'
    );
    ace.config.setModuleUrl(
      'ace/mode/javascript_worker',
      'https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/worker-javascript.js'
    );
    return reactAce;
  },
  {
    ssr: false
  }
);

const useStyles = makeStyles(theme => ({
  div: {
    width: '100%',
    position: 'relative',
    display: 'flex',
  },
  divCodeFullScreen: {
    width: '100%',
    display: 'block'
  },
  divCodeAndTests: {
    padding: '2rem',
    display: 'block',
    paddingTop: '0px',
  },
  test: {
    width: '100%',
  },
  textSolution: {
    width: 'auto',
    padding: '1rem',
    fontSize: '2rem',
    fontFamily: 'system-ui',
  },
  texHead: {
    fontSize: '2rem',
    fontFamily: 'system-ui',
  },
  title: {
    fontSize: '2.4rem',
    fontFamily: 'system-ui',
  },
  select: {
    fontSize: '1.4rem',
    fontFamily: 'IBM Plex Sans',
    height: '4rem',
    '& div': {
      paddingTop: '1.1rem',
      paddingBottom: '0.9rem',
      height: '2rem',
    },
  },
  option: {
    fontSize: '1.4rem',
    fontFamily: 'IBM Plex Sans',
    '& ul': {
      fontSize: '2.0rem',
      fontWeight: 'bold',
      fontFamily: 'Bahnschrift',
      fontStretch: 'condensed',
      color: '#191919',
      backgroundColor: '#191919',
    },
  },
  tabs: {
    '.MuiPaper-elevation4': {
      boxShadow: ''
    },
    justify: 'space-between',
  },
  tab: {
    fontFamily: 'Bahnschrift',
    fontWeight: 'bold',
    fontStretch: 'condensed',
    fontSize: '1.8rem',
    '&.selected': {
      backgroundColor: 'yellow',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.5rem',
    },
  },
  button: {
    fontSize: '1.4rem',
    fontFamily: 'Bahnschrift',
    fontWeight: 'bold',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    paddingLeft: '0px',
    paddingRight: '0px',
    width: '100%',
  },
}));

function View(props) {
  const { player, isPlayer, applicatorStartId, token, setMessageError,
    percentage, onChangePaletteCode, paletteTheme, permissionPunctuation,
    isViewResult } = props;
  const classes = useStyles();
  const [font, setFont] = useState<any>('14');
  const [tab, setTab] = useState(0);
  const [screen, setScreen] = useState('Normal');
  const handleTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };
  const handleFont = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFont(event.target.value as string);
  };

  const sendPunctuationPlayer = async value => {
    if (isPlayer) {
      const response = await playerSendPunctuation({ playerStartId: getLocalStorage(LocalStorageItem.player), applicatorStartId: applicatorStartId, punctuation: value });
      if (!response.ok) {
        setMessageError(response.data.message)
      }
    }
    else {
      const response = await applicatorSendPunctuation({ applicatorStartId: applicatorStartId, punctuation: value }, token);
      if (!response.ok) {
        setMessageError(response.data.message)
      }
    }
  }

  const nextPlayer = async () => {
    const response = await nextPlayerChallenge({ applicatorStartId }, token);
    if (!response.ok) {
      setMessageError(response.data.message);
    }
  }

  const useStylesTheme = makeStyles(() =>
    createStyles({
      menuSelect: {
        top: '52px !important',
        border: '1px solid black',
        borderRadius: '5%',
        backgroundColor: paletteCode.get().background
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
          backgroundColor: paletteCode.get().color,
        },
        '&:before': {
          borderColor: paletteCode.get().color,
        },
        '&:after': {
          borderColor: paletteCode.get().color,
        }
      },
      reactQuill: {
        '& .ql-toolbar .ql-stroke': {
          fill: 'none',
          stroke: palette.get().primaryText
        },

        '& .ql-toolbar .ql-fill': {
          fill: palette.get().primaryText,
          stroke: 'none',
        },

        '& .ql-toolbar .ql-picker': {
          color: palette.get().primaryText
        },
        '& .ql-container.ql-snow': {
          borderColor: palette.get().primaryText
        },
        '& .ql-picker-options': {
          background: palette.get().buttonCode
        },
        '& .ql-editor.ql-blank::before': {
          color: palette.get().primaryText
        }
      },
      textScroll: {
        '&::-webkit-scrollbar': {
          width: '1.2em'
        },
        '&::-webkit-scrollbar-track': {
          boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
          webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: paletteCode.get().button,
          outline: '1px solid slategrey'
        }
      },
      scrollBarEditor: {
        '& .ace_scrollbar': {
          '&::-webkit-scrollbar': {
            width: '0.8em'
          },
          '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: paletteCode.get().button,
            outline: '1px solid slategrey'
          }
        }
      },
      iconItem: {
        padding: '2px',
        '& svg': {
          fontSize: '3rem',
          color: paletteCode.get().color
        },
      },
    }),
  );
  const classesTheme = useStylesTheme();
  if (screen === 'Normal') {
    return (
      <div style={{ backgroundColor: paletteCode.get().background, width: '100%' }}>
        {percentage ? <div style={{ width: '99%', height: '2vh' }}>
          <LinearProgressWithLabel value={percentage} />
        </div> : <></>}
        <div style={{ backgroundColor: paletteCode.get().background, minHeight: isPlayer ? '98vh' : '91vh' }} className={classes.div}>

          <Grid style={{ height: '100%', width: '100%', display: 'contents' }}
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid item xs={isViewResult || (isPlayer && permissionPunctuation.player === 0) ? 6 : 5} style={{ padding: '2rem', paddingRight: '0px', paddingTop: '0px' }}>
              <Grid item xs={12} style={{ height: '10%' }}>
                <Grid
                  style={{ backgroundColor: paletteCode.get().background, height: '100%', width: '100%' }}
                  container
                  direction="row"
                  alignItems="center"
                >
                  <Typography className={classes.title} style={{ color: paletteCode.get().color, fontWeight: 'bold' }}>{player?.challenge.title}</Typography>
                </Grid>

              </Grid>
              <Grid item xs={12} style={{ height: '90%' }}>
                <AppBar position="static" style={{ boxShadow: '0 2px 1px -2px gray' }}>
                  <Tabs variant="fullWidth" TabIndicatorProps={{
                    style: {
                      padding: '0px',
                      margin: '0px',
                      height: '1px',
                      backgroundColor: paletteCode.get().color,
                    }
                  }} className={classes.tabs} style={{ backgroundColor: paletteCode.get().head }} value={tab} onChange={handleTab} aria-label="simple tab">
                    <Tab className={classes.tab} style={{ color: paletteCode.get().color }} label="Instrução" />
                    <Tab className={classes.tab} style={{ color: paletteCode.get().color }} label="Saída" />
                    <Tab className={classes.tab} style={{ color: paletteCode.get().color }} label="Testes" />
                  </Tabs>
                </AppBar>
                <TabPanel scroolbar={classesTheme.textScroll} value={tab} index={0} >
                  <ReactQuill
                    readOnly={true}
                    toolbar={false}
                    defaultValue={player?.challenge.description}
                    className={classesTheme.reactQuill}
                    style={{ background: paletteCode.get().background, color: paletteCode.get().color, minHeight: '400px', borderColor: paletteCode.get().color }}>
                  </ReactQuill>
                </TabPanel>
                <TabPanel scroolbar={classesTheme.textScroll} text={`<div style="width: 100%; padding: 10px; font-size:1.6rem; color: ${paletteCode.get().color}; font-family:Bahnschrift;">${player?.errorLog}</div>`} value={tab} index={1} />
                {tab === 2 ? <AceEditor
                  className={classesTheme.scrollBarEditor}
                  style={{ width: '100%', height: '92%', }}
                  mode={languages.find(language => language.name === player?.challenge.language).editor}
                  theme={paletteCode.get().terminal}
                  tabSize={2}
                  value={player?.challenge.test}
                  readOnly={true}
                  highlightActiveLine={false}
                  name="code"
                  showPrintMargin={false}
                  editorProps={{ $blockScrolling: true }}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    fontSize: `${font}px`,
                  }}
                /> : <div></div>}
              </Grid>
            </Grid>
            <Grid item xs={6} className={classes.divCodeAndTests}>
              <div style={{ height: '10%', backgroundColor: paletteCode.get().background }}>
                <Grid
                  style={{ backgroundColor: paletteCode.get().background, height: '100%', width: '100%' }}
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid
                    item xs={1}>
                    <Tooltip
                      title={<Typography>Linguagem</Typography>} style={{ backgroundColor: paletteCode.get().head }}>
                      <Typography style={{ color: paletteCode.get().color }} className={classes.texHead}>{player?.challenge.language}</Typography>
                    </Tooltip>
                  </Grid>

                  <Grid style={{ textAlign: 'center' }}
                    item xs={3}>
                    <Tooltip placement='left'
                      title={<Typography>Fonte</Typography>} style={{ backgroundColor: paletteCode.get().head }}>
                      <FormControl variant="outlined" >
                        <Select className={classesTheme.select}
                          style={{ color: paletteCode.get().color, backgroundColor: paletteCode.get().button }}
                          MenuProps={{ classes: { paper: classesTheme.menuSelect } }}
                          defaultValue={''}
                          value={font}
                          onChange={handleFont}
                          id="select-font"
                          IconComponent={() => (
                            <ExpandMoreIcon />
                          )}
                        >
                          {['8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30'].map((item) => (
                            <MenuItem
                              key={item} value={item} className={classes.option}
                              style={{ color: paletteCode.get().color }}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Tooltip>
                  </Grid>
                  <Grid style={{ textAlign: 'center' }}
                    item xs={1}>
                    <ButtonMode onChangePaletteCode={onChangePaletteCode} paletteTheme={paletteTheme}></ButtonMode>
                  </Grid>
                  <Grid style={{ textAlign: 'right' }}
                    item xs={3}>
                    <Tooltip placement='right'
                      title={<Typography>Jogador</Typography>} style={{ backgroundColor: paletteCode.get().head }}>
                      <Typography style={{ color: paletteCode.get().color }} className={classes.texHead}>{player?.name}</Typography>
                    </Tooltip>
                  </Grid>

                </Grid>
              </div>
              <Grid
                style={{ backgroundColor: paletteCode.get().head, height: '5%' }}
                container
                direction="row"
                justify="space-between"
                alignItems="center"
              >
                <Grid
                  item xs={11}>
                  <Typography className={classes.textSolution} style={{ backgroundColor: paletteCode.get().head, color: paletteCode.get().color }}>Solução:</Typography>
                </Grid>
                <Grid style={{ textAlignLast: 'right' }}
                  item xs={1}>
                  <IconButton onClick={() => setScreen('Code')} component="span" className={classesTheme.iconItem}>
                    <Tooltip placement="left"
                      title={<Typography>Tela Cheia</Typography>} style={{ backgroundColor: paletteCode.get().head }}>
                      <FullscreenIcon />
                    </Tooltip>
                  </IconButton>
                </Grid>
              </Grid>
              <AceEditor
                className={classesTheme.scrollBarEditor}
                style={{ width: '100%', height: '85%', }}
                mode={languages.find(language => language.name === player?.challenge.language).editor}
                theme={paletteCode.get().terminal}
                tabSize={2}
                value={player?.code}
                readOnly={true}
                highlightActiveLine={false}
                name="code"
                showPrintMargin={false}
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  fontSize: `${font}px`,
                }}
              />
            </Grid>
            {!isViewResult && ((isPlayer && permissionPunctuation?.player !== 0) || (!isPlayer && permissionPunctuation?.applicator !== 0)) ?
              <Grid item xs={1} style={{ paddingBottom: '2rem', paddingRight: '2rem' }}>
                <Grid
                  style={{ backgroundColor: paletteCode.get().head, height: '100%', width: '100%', borderRadius: '25PX' }}
                  container
                  direction="column"
                  justify="space-between"
                  alignItems="center"
                >

                  <Grid container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    style={{ backgroundColor: paletteCode.get().head, height: '10%', width: '100%', textAlign: 'center' }}>
                    <Box style={{ backgroundColor: paletteCode.get().head, borderRadius: '25PX', width: '60%', height: '40%', textAlign: 'center' }}>
                      <Tooltip placement="bottom"
                        title={<Typography>Atribua a nota</Typography>} style={{ backgroundColor: paletteCode.get().head }}>
                        <Typography style={{ height: '100%', fontSize: '2rem', color: paletteCode.get().color }}>Nota</Typography>
                      </Tooltip>
                    </Box>
                  </Grid>
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((item) => (
                    <div key={item} style={{ height: '8%' }}>
                      <Fab variant="extended"
                        onClick={() => { sendPunctuationPlayer(item) }}
                        style={{ backgroundColor: paletteCode.get().button, color: paletteCode.get().color, fontSize: '2rem' }}
                      >
                        {item}
                      </Fab>
                    </div>
                  ))}
                  {isPlayer ? <></> : <div style={{ height: '8%' }}>
                    <Tooltip placement="bottom"
                      title={<Typography>Próximo</Typography>} style={{ backgroundColor: paletteCode.get().head }}>
                      <Fab variant="extended"
                        onClick={nextPlayer}
                        style={{ backgroundColor: paletteCode.get().button, color: paletteCode.get().color, fontSize: '2rem' }}
                      >
                        <ArrowForwardIcon></ArrowForwardIcon>
                      </Fab>
                    </Tooltip>
                  </div>}
                </Grid>
              </Grid>
              : <></>}
            {isViewResult || isPlayer || permissionPunctuation?.applicator !== 0 ? <></> :
              <Grid item xs={1} style={{ paddingBottom: '2rem', paddingRight: '2rem' }}>
                <Grid
                  style={{ backgroundColor: paletteCode.get().head, height: '100%', width: '100%', borderRadius: '25px' }}
                  container
                  direction="column"
                  justify="center"
                  alignItems="center"
                >
                  <div style={{ height: '8%' }}>
                    <Tooltip placement="bottom"
                      title={<Typography>Próximo</Typography>} style={{ backgroundColor: paletteCode.get().head }}>
                      <Fab variant="extended"
                        onClick={nextPlayer}
                        style={{ backgroundColor: paletteCode.get().button, color: paletteCode.get().color, fontSize: '2rem' }}
                      >
                        <ArrowForwardIcon></ArrowForwardIcon>
                      </Fab>
                    </Tooltip>
                  </div>
                </Grid>
              </Grid>}
          </Grid>
        </div >
      </div >
    )
  } else if (screen !== 'Normal') {
    return (
      <div style={{ backgroundColor: paletteCode.get().background, minHeight: isPlayer ? '98vh' : '91vh' }} className={classes.div}>
        <Grid item xs={12} className={classes.divCodeFullScreen}>
          <Grid
            style={{ backgroundColor: paletteCode.get().head, height: '5vh' }}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid
              item xs={5}>
              <Typography className={classes.textSolution} style={{ backgroundColor: paletteCode.get().head, color: paletteCode.get().color }}>Solução:</Typography>
            </Grid>
            <Grid style={{ textAlignLast: 'right' }}
              item xs={1}>
              <IconButton onClick={() => setScreen('Normal')} component="span" className={classesTheme.iconItem}>
                <Tooltip placement="left"
                  title={<Typography>Sair da tela cheia</Typography>} style={{ backgroundColor: paletteCode.get().head }}>
                  <FullscreenExitIcon />
                </Tooltip>
              </IconButton>
            </Grid>
          </Grid>
          <AceEditor
            className={classesTheme.scrollBarEditor}
            style={{ width: '100%', height: '95vh' }}
            mode={languages.find(language => language.name === player?.challenge.language).editor}
            theme={paletteCode.get().terminal}
            tabSize={2}
            value={player?.code}
            readOnly={true}
            highlightActiveLine={false}
            name="codeFullScreen"
            showPrintMargin={false}
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              fontSize: `${font}px`,
            }}
          />
        </Grid>
      </div>
    )
  }
}

export default View