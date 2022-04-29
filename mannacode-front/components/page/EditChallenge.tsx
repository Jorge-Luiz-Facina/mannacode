import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'
import {
  AppBar, Button, createStyles, FormControl, FormHelperText, Grid, IconButton, makeStyles,
  Select as MuiSelect, Tab, Tabs, Tooltip, Typography
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuItemBasic from 'components/style/MenuItemBasic';
import palette from 'components/singleton/palette';
import { Field, Form } from 'react-final-form';
import ReactQuill from 'components/fields/ReactQuill';
import TextField from 'components/fields/TextField';
import BasePage from './general/BasePage';
import TabPanel from 'components/style/TabPanel';
import { create, get, updateChallenge } from '@/services/challenges';
import { useAuth } from 'components/context/auth';
import { useRouter } from 'next/router';
import { PathName } from 'components/static/Route';
import { PageMode } from 'components/Enums/pageMode';
import Link from 'components/style/Link';
import { test as serviceTest } from '@/services/applicatorTest';
/* eslint-disable-next-line no-unused-vars */
import languages, { Language } from 'components/static/Languages';
import { validateRequiredField } from 'components/form/rules/registerUser';
import AlertDialog from 'components/style/AlertDialog';
import MuiReactQuill from 'components/style/ReactQuill'
import {
  Fullscreen as FullscreenIcon, FullscreenExit as FullscreenExitIcon,
} from '@material-ui/icons';
import { getExamplesTests } from 'components/static/Text';

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
    minHeight: '93vh',
    width: '100%',
    position: 'relative',
    display: 'flex',
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
  buttonExample: {
    fontSize: '1.4rem',
    fontFamily: 'Bahnschrift',
    fontWeight: 'bold',
    paddingLeft: '0px',
    paddingRight: '0px',
    width: '100%',
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
  time: {
    width: '30%',
    [theme.breakpoints.down('lg')]: {
      width: '70%',
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  textErrorButton: {
    fontSize: '1.5rem',
    color: '#DA1E27',
    fontFamily: 'IBM Plex Sans',
    margin: 0,
    textAlign: 'center'
  },
  divCodeFullScreen: {
    width: '100%',
    display: 'block'
  },
}));

export default function EditChallenge(props) {
  const { groupChallengeId, challengeId, mode } = props;
  const router = useRouter();
  const MenuItem = MenuItemBasic({ paletteTheme: palette.get() })
  const classes = useStyles()
  const [font, setFont] = useState<any>('14');
  const [language, setLanguage] = useState<Language>(languages[0]);
  const [challenge, setChallenge] = useState<any>({});
  const [tab, setTab] = useState(0);
  const [edited, setEdited] = useState(mode !== PageMode.edit);
  const [output, setOutput] = useState<string>('');
  const [typeButton, setTypeButton] = useState<string>('');
  const [messageError, setMessageError] = useState<string>(null);
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
  const [screen, setScreen] = useState('Normal');

  function onChangeTest(newValue) {
    challenge.test = newValue;
  }

  function onChangeCode(newValue) {
    challenge.code = newValue;
  }

  const handleClose = () => {
    setOpenAlertDialog(false);
  };

  const handleChangeFont = (event: React.ChangeEvent<{ value: string }>) => {
    setFont(event.target.value as string);
  };

  const { token, signed, setRequiredSigned, statusRedirect } = useAuth();

  const handleChangeLanguagem = (event: React.ChangeEvent<{ value: Language }>) => {
    setLanguage(event.target.value as Language);
  };

  const handleTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

  const onSubmit = async (values, form) => {
    values.code = challenge.code;
    values.test = challenge.test;
    setMessageError('');
    if (typeButton === 'TEST') {
      values.language = language.executor;
      values.groupChallengeId = groupChallengeId;
      const response = await serviceTest(values, token);
      statusRedirect(response.data.code);
      if (response.ok) {
        setTab(1);
        setOutput(response.data);
      } else {
        setMessageError(response.data.message)
      }
    } else {
      values.language = language.name;
      if (mode === PageMode.new) {
        values.groupChallengeId = groupChallengeId;
        const response = await create(values, token);
        statusRedirect(response.data.code);
        if (response.ok) {
          if (typeButton === 'ADD') {
            router.push(`${PathName.activities}${PathName.challenges}?groupChallengeId=${groupChallengeId}&mode=edit`)
          } else if (typeButton === 'ADD_PLUS') {
            Object.keys(values).forEach(key => {
              form.change(key, undefined);
              form.resetFieldState(key);
            });
          }
        }
        else {
          setMessageError(response.data.message)
        }
      } else {
        values.groupChallengeId = undefined;
        const response = await updateChallenge(challengeId, values, token);
        statusRedirect(response.data.code);
        if (response.ok) {
          setEdited(false);
        }
        else {
          setMessageError(response.data.message)
        }
      }
    }
  }


  useEffect(() => {
    setRequiredSigned(true);
  }, []);

  const validate = (data) => ({
    title: validateRequiredField(data, 'title'),
    time: validateRequiredField(data, 'time'),
  });

  useEffect(() => {
    if (mode === PageMode.edit && signed) {
      get(challengeId, token)
        .then((response) => {
          statusRedirect(response.data.code);
          if (response.ok) {
            setChallenge(response.data);
            setLanguage(languages.find(l => l.name === response.data.language))
          } else {
            setMessageError(response.data.message);
          }
        });
    }

  }, [signed, mode])

  const useStylesTheme = makeStyles(() =>
    createStyles({
      menuSelect: {
        top: '52px !important',
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
      textFieldRoot: {
        '& label.Mui-focused': {
          color: palette.get().primaryText,
        },
        '& .MuiInputBase-input': {
          color: palette.get().primaryText,
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: palette.get().primaryText,
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: palette.get().secondaryText,
          },
          '&:hover fieldset': {
            borderColor: palette.get().secondaryText,
          },
          '&.Mui-focused fieldset': {
            borderColor: palette.get().primaryText,
          },
        },
      },
      input: {
        color: palette.get().primaryText,
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
          backgroundColor: palette.get().buttonCode,
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
            backgroundColor: palette.get().buttonCode,
            outline: '1px solid slategrey'
          }
        }
      },
      iconItem: {
        padding: '2px',
        '& svg': {
          fontSize: '3rem',
          color: palette.get().secondaryText
        },
      },
    }),
  );
  const classesTheme = useStylesTheme();

  return (
    BasePage(
      <div style={{ backgroundColor: palette.get().backgroundCode }} className={classes.div}>
        <Form
          onSubmit={onSubmit}
          validate={validate}
          render={({ handleSubmit, form, submitting }) => (
            <form onSubmit={handleSubmit} style={{ width: '100%', height: '100%', display: 'contents' }}>
              {screen === 'Normal' ?
                <Grid style={{ height: '100%', width: '100%', display: 'contents' }}
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >

                  <Grid item xs={5} style={{ padding: '2rem', paddingRight: '0px', paddingTop: '0px' }}>
                    <Grid item xs={12} style={{ height: '10%' }}>
                      <Grid
                        style={{ backgroundColor: palette.get().backgroundCode, height: '100%', width: '100%' }}
                        container
                        direction="row"
                        alignItems="center"
                      >
                        <Field
                          name="title"
                          InputProps={{
                            className: classesTheme.input
                          }}
                          defaultValue={challenge?.title}
                          classes={{ root: classesTheme.textFieldRoot }}
                          label={<Typography style={{ color: 'white' }}>Título</Typography>}
                          size="small"
                          fullWidth
                          component={TextField}
                          disabled={!edited}
                          variant={edited ? 'outlined' : 'filled'}
                        />
                      </Grid>

                    </Grid>
                    <Grid item xs={12} style={{ height: '90%' }}>
                      <AppBar position="static" style={{ boxShadow: '0 2px 1px -2px gray' }}>
                        <Tabs variant="fullWidth" TabIndicatorProps={{
                          style: {
                            padding: '0px',
                            margin: '0px',
                            height: '1px',
                            backgroundColor: palette.get().colorCode,
                          }
                        }} className={classes.tabs} style={{ backgroundColor: palette.get().headCode }} value={tab} onChange={handleTab} aria-label="simple tab">
                          <Tab className={classes.tab} style={{ color: palette.get().colorCode }} label="Instrução" />
                          <Tab className={classes.tab} style={{ color: palette.get().colorCode }} label="Saída" />

                        </Tabs>
                      </AppBar>
                      <TabPanel scroolbar={classesTheme.textScroll} value={tab} index={0}>
                        <Field
                          name='description'
                          readOnly={!edited}
                          defaultValue={challenge?.description}
                          className={classesTheme.reactQuill}
                          placeholder='Descrição do desafio...'
                          style={{ background: palette.get().backgroundCode, color: '#F0F0F0', minHeight: '400px', borderColor: palette.get().backgroundCode }}
                          component={ReactQuill}
                        />
                      </TabPanel>

                      <TabPanel scroolbar={classesTheme.textScroll} text={`<div style="width: 100%; padding: 10px; font-size:1.6rem; color: ${palette.get().primaryText}; font-family:Bahnschrift;">${output}</div>`} value={tab} index={1} />
                    </Grid>
                  </Grid>
                  <Grid item xs={7} className={classes.divCodeAndTests}>
                    <div style={{ height: '10%', backgroundColor: palette.get().backgroundCode }}>
                      <Grid
                        style={{ backgroundColor: palette.get().backgroundCode, height: '100%', width: '100%' }}
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                      >
                        <Grid
                          item xs={2}>
                          <Tooltip placement='left'
                            title={<Typography>Linguagem</Typography>} style={{ backgroundColor: palette.get().headCode }}>
                            <FormControl variant="outlined" >
                              <MuiSelect className={classesTheme.select}
                                style={{ color: palette.get().colorCode, backgroundColor: palette.get().buttonCode }}
                                MenuProps={{ classes: { paper: classesTheme.menuSelect } }}
                                defaultValue={''}
                                value={language}
                                onChange={handleChangeLanguagem}
                                disabled={!edited}
                                variant={edited ? 'outlined' : 'filled'}
                                id="select-languagem"
                                IconComponent={() => (
                                  <ExpandMoreIcon />
                                )}
                              >

                                {languages.map((item) => (
                                  <MenuItem
                                    key={item.name}
                                    // @ts-ignore [1]
                                    value={item}
                                    className={classes.option}>
                                    {item.name}
                                  </MenuItem>
                                ))}
                              </MuiSelect>
                            </FormControl>
                          </Tooltip>
                        </Grid>

                        <Grid style={{ textAlign: 'center' }}
                          item xs={3}>
                          <Tooltip placement='left'
                            title={<Typography>Fonte</Typography>} style={{ backgroundColor: palette.get().headCode }}>
                            <FormControl variant="outlined" >
                              <MuiSelect className={classesTheme.select}
                                style={{ color: palette.get().colorCode, backgroundColor: palette.get().buttonCode }}
                                MenuProps={{ classes: { paper: classesTheme.menuSelect } }}
                                defaultValue={''}
                                value={font}
                                onChange={handleChangeFont}
                                id="select-challenge"
                                IconComponent={() => (
                                  <ExpandMoreIcon />
                                )}
                              >
                                {['8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30'].map((item) => (
                                  <MenuItem
                                    key={item} value={item} className={classes.option}>
                                    {item}
                                  </MenuItem>
                                ))}
                              </MuiSelect>
                            </FormControl>
                          </Tooltip>

                        </Grid>
                        <Grid style={{ textAlign: 'right' }}
                          item xs={3}>
                        </Grid>
                      </Grid>
                    </div>
                    <Grid
                      style={{ backgroundColor: palette.get().headCode, height: '5%' }}
                      container
                      direction="row"
                      justify="space-between"
                      alignItems="center"
                    >
                      <Grid
                        item xs={11}>
                        <Typography className={classes.textSolution} style={{ backgroundColor: palette.get().headCode, color: palette.get().colorCode }}>Solução:</Typography>
                      </Grid>
                      <Grid style={{ textAlignLast: 'right' }}
                        item xs={1}>
                        <IconButton onClick={() => setScreen('Code')} component="span" className={classesTheme.iconItem}>
                          <Tooltip placement="left"
                            title={<Typography>Tela Cheia</Typography>} style={{ backgroundColor: palette.get().headCode }}>
                            <FullscreenIcon />
                          </Tooltip>
                        </IconButton>
                      </Grid>

                    </Grid>

                    <MuiAceEditor
                      readOnly={!edited}
                      defaultValue={challenge?.code}
                      className={classesTheme.scrollBarEditor}
                      mode={language.editor}
                      style={{ width: '100%', height: '30%' }}
                      theme={palette.get().terminalCode}
                      value={challenge?.code}
                      highlightActiveLine={false}
                      tabSize={2}
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
                      style={{ backgroundColor: palette.get().headCode, height: '5%' }}
                      container
                      direction="row"
                      justify="space-between"
                      alignItems="center"
                    >
                      <Grid
                        item xs={3}>
                        <Typography className={classes.textSolution} style={{ backgroundColor: palette.get().headCode, color: palette.get().colorCode }}>Testes:</Typography>
                      </Grid>
                      <Grid style={{ textAlign: 'center' }}
                        item xs={3} sm={3} md={2}>
                        <Button
                          onClick={() => { setOpenAlertDialog(true); }}
                          className={classes.buttonExample}
                          style={{ color: palette.get().colorCode, backgroundColor: palette.get().buttonCode }}
                          fullWidth
                          variant='contained'>
                          Exemplos</Button>
                      </Grid>
                      <Grid style={{ textAlignLast: 'right' }}
                        item xs={4}>
                        <IconButton onClick={() => setScreen('Test')} component="span" className={classesTheme.iconItem}>
                          <Tooltip placement="left"
                            title={<Typography>Tela Cheia</Typography>} style={{ backgroundColor: palette.get().headCode }}>
                            <FullscreenIcon />
                          </Tooltip>
                        </IconButton>
                      </Grid>
                    </Grid>
                    <MuiAceEditor
                      readOnly={!edited}
                      defaultValue={challenge?.test}
                      className={classesTheme.scrollBarEditor}
                      mode={language.editor}
                      style={{ width: '100%', height: '41.5%' }}
                      theme={palette.get().terminalCode}
                      value={challenge?.test}
                      highlightActiveLine={false}
                      tabSize={2}
                      onChange={onChangeTest}
                      name="test"
                      showPrintMargin={false}
                      editorProps={{ $blockScrolling: true }}
                      setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true,
                        fontSize: `${font}px`,
                      }}
                    />
                    <Grid
                      style={{ backgroundColor: palette.get().backgroundCode, height: '8%', width: '100%' }} spacing={1}
                      container
                      direction="row"
                      justify="flex-end"
                      alignItems="center"
                    >
                      <Grid item style={{ width: '52%' }}>
                        <Field
                          disabled={!edited}
                          variant={edited ? 'outlined' : 'filled'}
                          className={classes.time}
                          defaultValue={challenge?.time}
                          name="time"
                          InputProps={{
                            className: classesTheme.input
                          }}
                          classes={{ root: classesTheme.textFieldRoot }}
                          onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, '') }}
                          label={<Typography style={{ color: 'white' }}>Tempo (Minutos)</Typography>}
                          size="small"
                          component={TextField}
                        />
                      </Grid>
                      <Grid item style={{ width: '16%' }}>
                        <Link href={`${PathName.activities}${PathName.challenges}?groupChallengeId=${groupChallengeId}&mode=${mode}`}>
                          <Button
                            className={classes.button}
                            style={{ backgroundColor: palette.get().primaryText, color: palette.get().buttonBack, border: '2px solid', borderColor: palette.get().buttonBack, }}
                            fullWidth
                            variant='contained'>
                            Desafios
                          </Button>
                        </Link>
                      </Grid>
                      <Grid item style={{ width: '16%' }}
                      >
                        <Button
                          type='submit'
                          disabled={submitting}
                          onClick={() => { setTypeButton('TEST') }}
                          className={classes.button}
                          style={{ color: palette.get().colorCode, backgroundColor: palette.get().buttonCode }}
                          fullWidth
                          variant='contained'>
                          {submitting && typeButton === 'TEST' ? 'Testando...' : 'Testar'}
                        </Button>
                      </Grid>
                      {mode === PageMode.new ? <>
                        <Grid item style={{ width: '16%' }}>
                          <Button
                            type='submit'
                            onClick={() => { setTypeButton('ADD') }}
                            disabled={submitting}
                            className={classes.button}
                            style={{ color: palette.get().colorCode, backgroundColor: palette.get().headCode }}
                            fullWidth
                            variant='contained'>
                            {submitting && typeButton === 'ADD' ? 'Salvando...' : 'Adicionar'}
                          </Button>
                        </Grid>
                        {/* <Grid item style={{ width: '16%' }}>
                        <Button
                          disabled={submitting}
                          type='submit'
                          onClick={() => { setTypeButton('ADD_PLUS') }}
                          className={classes.button}
                          style={{ color: palette.get().colorCode, backgroundColor: palette.get().headCode }}
                          fullWidth
                          variant='contained'>
                          {submitting && typeButton === 'ADD_PLUS' ? 'Salvando...' : 'Adicionar mais'}
                        </Button>
                      </Grid> */}
                      </> :
                        <>
                          {edited ? <></> :
                            <Grid item style={{ width: '16%' }}>
                              <Button
                                disabled={submitting}
                                type='submit'
                                onClick={() => { setEdited(true) }}
                                className={classes.button}
                                style={{ color: palette.get().colorCode, backgroundColor: palette.get().headCode }}
                                fullWidth
                                variant='contained'>
                                Editar
                              </Button>
                            </Grid>
                          }
                          {edited ? <Grid item style={{ width: '16%' }}>
                            <Button
                              disabled={submitting}
                              type='submit'
                              onClick={() => { setTypeButton('UPDATE'); }}
                              className={classes.button}
                              style={{ color: palette.get().colorCode, backgroundColor: palette.get().headCode }}
                              fullWidth
                              variant='contained'>
                              {submitting && typeButton === 'UPDATE' ? 'Salvando...' : 'Salvar'}
                            </Button>
                          </Grid> : <></>}
                        </>}
                    </Grid>
                    <FormHelperText className={classes.textErrorButton} {...(messageError && { error: true })}>{messageError ? messageError : ''}</FormHelperText>
                  </Grid>

                </Grid> :
                <Grid item xs={12} className={classes.divCodeFullScreen}>
                  <Grid
                    style={{ backgroundColor: palette.get().headCode, height: '5%' }}
                    container
                    justify="space-between"
                    alignItems="center"
                  >
                    <Grid
                      item xs={5}>
                      <Typography className={classes.textSolution} style={{ backgroundColor: palette.get().headCode, color: palette.get().colorCode }}>{screen === 'Code' ? 'Solução:' : 'Testes:'}</Typography>
                    </Grid>

                    <Grid style={{ textAlignLast: 'right' }}
                      item xs={1}>
                      <IconButton onClick={() => setScreen('Normal')} component="span" className={classesTheme.iconItem}>
                        <Tooltip placement="left"
                          title={<Typography>Sair da tela cheia</Typography>} style={{ backgroundColor: palette.get().headCode }}>
                          <FullscreenExitIcon />
                        </Tooltip>
                      </IconButton>
                    </Grid>
                  </Grid>
                  <MuiAceEditor
                    readOnly={!edited}
                    defaultValue={screen === 'Code' ? challenge?.code : challenge?.test}
                    className={classesTheme.scrollBarEditor}
                    mode={language.editor}
                    style={{ width: '100%', height: '95%' }}
                    theme={palette.get().terminalCode}
                    value={screen === 'Code' ? challenge?.code : challenge?.test}
                    highlightActiveLine={false}
                    tabSize={2}
                    onChange={screen === 'Code' ? onChangeCode : onChangeTest}
                    name={screen === 'Code' ? 'code' : 'test'}
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
              }
            </form>
          )}
        />
        <AlertDialog open={openAlertDialog} title='Criação de testes' handleClose={handleClose}>
          <>
            <MuiReactQuill
              toolbar={false}
              name='description'
              readOnly={!edited}
              defaultValue={getExamplesTests(language.solution, language.test)}
              className={classesTheme.reactQuill}
              style={{ background: palette.get().backgroundCode, color: '#F0F0F0', minHeight: '400px', borderColor: palette.get().backgroundCode }}
            />
          </>
        </AlertDialog>
      </div >)
  )

}
