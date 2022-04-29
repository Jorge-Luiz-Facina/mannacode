import React, { useState } from 'react';
import dynamic from 'next/dynamic'
import {
  AppBar, Button, createStyles, FormControl, Grid, IconButton, makeStyles, MenuItem,
  Select, Tab, Tabs, Tooltip, Typography
} from '@material-ui/core';
import {
  Fullscreen as FullscreenIcon, FullscreenExit as FullscreenExitIcon,
} from '@material-ui/icons';
import ButtonMode from '../style/ButtonMode';
import { playerTest, playerTestSolo } from '@/services/playerTest'
import { sendChallenge } from '@/services/playerChallenges'
import StopWatch from '../style/StopWatch';
import { LocalStorageItem, getLocalStorage } from 'components/static/LocalStorage';
import TabPanel from 'components/style/TabPanel';
import ReactQuill from 'components/style/ReactQuill';
import { Form } from 'react-final-form';
import languages from 'components/static/Languages';
import paletteCode from 'components/singleton/paletteCode';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { test as serviceTest } from '@/services/applicatorTest';
import { useAuth } from 'components/context/auth';
import { get } from '@/services/challenges';
import { sendChallengeSolo } from '@/services/classPlayer';

const MuiAceEditor = dynamic(
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
    paddingTop: '0rem',
    paddingBottom: '0rem',
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

interface Challenge {
  index: number;
  title: string;
  test: string;
  description: string;
  language: string;
  time: number;
}

export default function ChallengePLayer(props) {
  const { endTime, user, setIsTimeFinished, challenge,
    onChangePaletteCode, paletteTheme, groupChallengeId } = props;

  const classes = useStyles()
  const [font, setFont] = useState<any>('14');
  const [tab, setTab] = useState(0);
  const [screen, setScreen] = useState('Normal');
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const { signed, token, statusRedirect } = useAuth();

  function onChangeCode(newValue) {
    setCode(newValue);
  }
  const handleTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };
  const handleFont = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFont(event.target.value as string);
  };

  if (user === 'APPLICATOR' && code === '') {
    get(challenge.id, token).then((response) => {
      if (response.ok) {
        setCode(response.data.code);
      }
    });
  }

  const onSubmitTest = async () => {
    if (user === 'APPLICATOR' && signed) {
      const response = await serviceTest({
        groupChallengeId: groupChallengeId, code: code,
        language: languages.find(language => language.name === challenge.language).executor, test: challenge.test
      }, token);
      statusRedirect(response.data.code);
      if (response.ok) {
        setOutput(response.data);
      } else {
        setOutput(`${response.data.message}`)
      }
    }
    else if (user === 'PLAYER_SOLO') {
      const response = await playerTestSolo(challenge.id, {
        code: code, language: languages.find(language => language.name === challenge.language).executor, token: getLocalStorage(LocalStorageItem.tokenPlayer)
      })
      if (response.ok) {
        setOutput(response.data);
        setFinishedChallengeSolo(response.data);
      } else {
        setOutput(`${response.data.message}`)
        setFinishedChallengeSolo(response.data.message)
      }
    }
    else {
      const response = await playerTest({
        id: getLocalStorage(LocalStorageItem.player), applicatorStartId: getLocalStorage(LocalStorageItem.room),
        code: code, language: languages.find(language => language.name === challenge.language).executor
      })
      if (response.ok) {
        setOutput(response.data);
      } else {
        setOutput(`${response.data.message}`)
        setFinishedChallenge(response.data.message)
      }
    }
    setTab(1);
  }

  const onSubmitSendChallenge = async () => {
    if (user === 'PLAYER_SOLO') {
      const response = await sendChallengeSolo(challenge.id, {
        code: code, language: languages.find(language => language.name === challenge.language).executor, token: getLocalStorage(LocalStorageItem.tokenPlayer)
      })
      if (response.ok) {
        setOutput(response.data);
        setFinishedChallengeSolo(response.data);
      } else {
        setOutput(`${response.data.message}`)
        setFinishedChallengeSolo(response.data.message)
      }
    }else{
      const response = await sendChallenge({
        playerStartId: getLocalStorage(LocalStorageItem.player), applicatorStartId: getLocalStorage(LocalStorageItem.room),
        code: code, language: languages.find(language => language.name === challenge.language).executor
      })
      if (response.ok) {
        setOutput(response.data);
      } else {
        setOutput(`${response.data.message}`)
        setFinishedChallenge(response.data.message)
      }
    }
    
    setTab(1);
  }
  const setFinishedChallenge = (message) => {
    if (message === 'O tempo acabou') {
      setTimeout(function () {
        setIsTimeFinished(true);
      }, 2000);
    }
  }

  const setFinishedChallengeSolo = (message) => {
    if (message === 'O tempo acabou' || message === '[Enviado] Testes Passou com sucesso!' || message === 'Você já finalizou esse desafio') {
      setTimeout(function () {
        setIsTimeFinished(true);
      }, 2000);
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
          stroke: paletteCode.get().color
        },

        '& .ql-toolbar .ql-fill': {
          fill: paletteCode.get().color,
          stroke: 'none',
        },

        '& .ql-toolbar .ql-picker': {
          color: paletteCode.get().color
        },
        '& .ql-container.ql-snow': {
          borderColor: paletteCode.get().color
        },
        '& .ql-picker-options': {
          background: paletteCode.get().button
        },
        '& .ql-editor.ql-blank::before': {
          color: paletteCode.get().color
        }
      },
      textFieldRoot: {
        '& label.Mui-focused': {
          color: paletteCode.get().color,
        },
        '& .MuiInputBase-input': {
          color: paletteCode.get().color,
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: paletteCode.get().color,
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: paletteCode.get().color,
          },
          '&:hover fieldset': {
            borderColor: paletteCode.get().color,
          },
          '&.Mui-focused fieldset': {
            borderColor: paletteCode.get().color,
          },
        },
      },
      input: {
        color: paletteCode.get().color,
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

  if (challenge === null || challenge === undefined || challenge === 'undefined') {
    return (
      <Typography>Loading</Typography>
    )
  }
  else if (screen === 'Normal') {
    return (
      <div style={{ backgroundColor: paletteCode.get().background, minHeight: user === 'APPLICATOR' ? '93vh' : '100vh' }} className={classes.div}>
        <Grid style={{ height: '100%', width: '100%', display: 'contents' }}
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Form
            onSubmit={onSubmitTest}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit} style={{ width: '100%', height: '100%', display: 'contents' }}>

                <Grid item xs={5} style={{ padding: '2rem', paddingRight: '0px', paddingTop: '0px' }}>
                  <Grid item xs={12} style={{ height: '10%' }}>
                    <Grid
                      style={{ backgroundColor: paletteCode.get().background, height: '100%', width: '100%' }}
                      container
                      direction="row"
                      alignItems="center"
                    >
                      <Typography className={classes.title} style={{ color: paletteCode.get().color, fontWeight: 'bold' }}>{challenge?.title}</Typography>
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
                        <Tab className={classes.tab} style={{ color: paletteCode.get().color }} label="Saida" />
                      </Tabs>
                    </AppBar>
                    <TabPanel scroolbar={classesTheme.textScroll} value={tab} index={0}>
                      <ReactQuill
                        readOnly={true}
                        toolbar={false}
                        defaultValue={challenge?.description}
                        className={classesTheme.reactQuill}
                        style={{ background: paletteCode.get().background, color: paletteCode.get().color, minHeight: '400px', borderColor: paletteCode.get().background }}>
                      </ReactQuill>
                    </TabPanel>
                    <TabPanel scroolbar={classesTheme.textScroll} text={`<div style="width: 100%; padding: 10px; font-size:1.6rem; color: ${paletteCode.get().color}; font-family:Bahnschrift;">${output}</div>`} value={tab} index={1} />                  </Grid>
                </Grid>
                <Grid item xs={7} className={classes.divCodeAndTests}>
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
                          <Typography style={{ color: paletteCode.get().color }} className={classes.texHead}>{challenge?.language}</Typography>
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
                        <Typography style={{ color: paletteCode.get().color }} className={classes.texHead}>{getLocalStorage(LocalStorageItem.playerName)}</Typography>
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
                  <MuiAceEditor
                    className={classesTheme.scrollBarEditor}
                    style={{ width: '100%', height: '43.5%' }}
                    mode={languages.find(l => l.name === challenge?.language).editor}
                    theme={paletteCode.get().terminal}
                    highlightActiveLine={false}
                    tabSize={2}
                    value={code}
                    onChange={onChangeCode}
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

                  <div style={{ width: '100%', height: '1%' }}></div>
                  <Grid
                    style={{ backgroundColor: paletteCode.get().head, height: '5%' }}
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                  >
                    <Grid
                      item xs={11}>
                      <Typography className={classes.textSolution} style={{ backgroundColor: paletteCode.get().head, color: paletteCode.get().color }}>Testes:</Typography>
                    </Grid>
                  </Grid>
                  <MuiAceEditor
                    className={classesTheme.scrollBarEditor}
                    style={{ width: '100%', height: '30%' }}
                    mode={languages.find(l => l.name === challenge?.language).editor}
                    theme={paletteCode.get().terminal}
                    readOnly={true}
                    value={challenge?.test}
                    highlightActiveLine={false}
                    tabSize={2}
                    name="test"
                    showPrintMargin={false}
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{
                      fontSize: `${font}px`,
                    }}
                  />
                  <Grid
                    style={{ backgroundColor: paletteCode.get().background, height: '8%', width: '100%' }} spacing={1}
                    container
                    direction="row"
                    justify="flex-end"
                    alignItems="center"
                  >
                    <Grid item style={{ width: user === 'APPLICATOR' ? '82%' : '68%' }}>
                      <StopWatch colors={paletteCode.get()} endTime={endTime} setIsTimeFinished={setIsTimeFinished}></StopWatch>
                    </Grid>
                    <Grid item style={{ width: '16%' }}>
                      <Button
                        onClick={onSubmitTest}
                        className={classes.button}
                        style={{ color: paletteCode.get().color, backgroundColor: paletteCode.get().button }}
                        fullWidth
                        variant='contained'>
                        Testar
                      </Button>
                    </Grid>
                    {user === 'APPLICATOR' ? <></> : <Grid item style={{ width: '16%' }}>

                      <Button
                        onClick={onSubmitSendChallenge}
                        className={classes.button}
                        style={{ color: paletteCode.get().color, backgroundColor: paletteCode.get().head }}
                        fullWidth
                        variant='contained'>
                        Enviar
                      </Button>
                    </Grid>}
                  </Grid>
                </Grid>
              </form>
            )}
          />
        </Grid>
      </div>)
  } else if (screen !== 'Normal') {
    return (
      <div style={{ backgroundColor: paletteCode.get().background, height: '100vh' }} className={classes.div}>
        <Grid item xs={12} className={classes.divCodeFullScreen}>
          <Grid
            style={{ backgroundColor: paletteCode.get().head, height: '5%' }}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid
              item xs={5}>
              <Typography className={classes.textSolution} style={{ backgroundColor: paletteCode.get().head, color: paletteCode.get().color }}>Solução:</Typography>
            </Grid>
            <Grid item xs={6} style={{ width: '68%' }}>
              <StopWatch colors={paletteCode.get()} endTime={endTime} setIsTimeFinished={setIsTimeFinished}></StopWatch>
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
          <MuiAceEditor
            className={classesTheme.scrollBarEditor}
            style={{ width: '100%', height: '95%' }}
            mode={languages.find(l => l.name === challenge?.language).editor}
            theme={paletteCode.get().terminal}
            tabSize={2}
            value={code}
            onChange={setCode}
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