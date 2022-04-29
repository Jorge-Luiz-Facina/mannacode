import React from 'react';
import BasePage from '../../components/page/general/BasePage';
import { makeStyles } from '@material-ui/core/styles';
import { defaultProperties } from '../../components/base/Theme';
import TextField from '../../components/fields/TextField';
import Checkbox from '../../components/fields/Checkbox';
import { Grid, MenuItem, Paper } from '@material-ui/core';
import MuiButton from '@material-ui/core/Button';
import { Form, Field } from 'react-final-form'
import { password, confirmPassword, validateRequiredField, email, license as validateLicense, name }
  from '../../components/form/rules/registerUser';
import Typography from '@material-ui/core/Typography';
import Link from '../../components/style/Link'
import FormHelperText from '@material-ui/core/FormHelperText';
import { register as serviceRegister } from '@/services/users'
import { useRouter } from 'next/router'
import { useState } from 'react';
import Select from 'components/fields/Select';
import palette from 'components/singleton/palette';

const useStyles = makeStyles(theme => ({
  div: {
    minHeight: '93vh',
    width: '100%',
    padding: theme.spacing(2),
    scrollMarginTop: `${defaultProperties.globalHeaderHeigth}`,
    scrollMarginRight: `${defaultProperties.globalHeaderWidth}`,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    fontFamily: 'Bahnschrift',
  },
  textTitleHead: {
    color: theme.palette.text.primary,
    fontFamily: 'IBM Plex Sans',
    fontSize: '4.0rem',
    fontWeight: 'bold',
    fontStretch: 'condensed',
    textAlign: 'center'
  },
  divRootRegister: {
    borderRadius: 5,
    padding: 0,
    backgroundColor: 'white',
    zIndex: 10,
    width: '30%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.only('md')]: {
      width: '40%',
    },
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
  divContainerBody: {
    zIndex: 10,
    width: '100%',
    maxWidth: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      paddingTop: '1rem',
    },
  },
  containerFields: {
    padding: theme.spacing(3)
  },
  head: {
    padding: theme.spacing(1),
    borderBottomColor: 'rgba(112, 112, 112, 0.3)',
    borderBottom: '1px solid',
    [theme.breakpoints.down('xs')]: {
      paddingTop: '0.5rem',
      paddingBottom: '0.5rem',
    },
  },
  divField: {
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
    width: '100%',
  },
  textLicense: {
    fontSize: '1.45rem',
    fontFamily: 'IBM Plex Sans',
    color: '#0000FF'
  },
  button: {
    width: '100%',
  },
  textErrorButton: {
    fontSize: '1.5rem',
    color: '#DA1E27',
    fontFamily: 'IBM Plex Sans',
    margin: 0,
    textAlign: 'center'
  },
  textFields: {
    fontSize: '1.6rem',
    fontFamily: 'Bahnschrift',
  },
  option: {
    fontSize: '1.5rem'
  }
}));

const types = [{ tag: 'TEACHER', name: 'Professor(a)' }, { tag: 'COMPANY', name: 'Empresa' }, { tag: 'STUDENT', name: 'Estudante' }, { tag: 'OTHER', name: 'Outro' }]

export default function register() {
  const classes = useStyles()
  const router = useRouter()

  const [messageError, setMessageError] = useState<any>(null)

  const onSubmit = async values => {
    const response = await serviceRegister(values);
    if (response.ok) {
      await router.push({
        pathname: '/register/validate',
        query: { email: values.email },
      })
    }
    else
      setMessageError(response.data.message)

  }

  const validate = data => {
    return ({
      type: validateRequiredField(data, 'type'),
      license: validateLicense(data, 'license'),
      name: name(data, 'name'),
      password: password(data, 'password'),
      confirmPassword: confirmPassword(data, 'password', 'confirmPassword'),
      email: email(data, 'email'),
    })
  }

  return (
    BasePage(
      <div className={classes.div} style={{background: palette.get().background}}>
        <Grid className={classes.divRootRegister}
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid className={classes.head}
            container
            direction="column"
            justify="center"
            alignItems="center"
          >

            <Grid className={classes.divContainer} item >
              <Typography className={classes.textTitleHead}>
                CRIAR CONTA
              </Typography>
            </Grid>
            <Grid className={classes.divContainer} item >
              <div className={classes.divField}>
                <FormHelperText className={classes.textErrorButton} {...(messageError && { error: true })}>{messageError ? messageError : ''}</FormHelperText>
              </div>
            </Grid>
          </Grid>

          <Paper className={classes.divContainerBody}>
            <Form
              onSubmit={onSubmit}
              validate={validate}
              render={({ handleSubmit, form, submitting }) => (
                <form onSubmit={handleSubmit}>
                  <Grid container
                    className={classes.containerFields}
                    spacing={2}
                  >
                    <Grid item xs={12}>
                      <Field
                        autoFocus={true}
                        name="email"
                        label={<Typography className={classes.textFields}>E-mail</Typography>}
                        size="small"
                        fullWidth
                        component={TextField}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12} >
                      <Field
                        name="name"
                        label={<Typography className={classes.textFields}>Nome</Typography>}
                        size="small"
                        fullWidth
                        component={TextField}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12} >
                      <Field
                        id='type-two'
                        name="type"
                        label='Você é'
                        size="small"
                        fullWidth
                        component={Select}
                        variant="standard"
                      >
                        {types.map((item) => (
                          <MenuItem key={item.tag} value={item.tag} className={classes.option} style={{ width: '100%' }}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Field>
                    </Grid>

                    <Grid item xs={12}  >
                      <Field
                        name="password"
                        label={<Typography className={classes.textFields}>Senha</Typography>}
                        size="small"
                        fullWidth
                        type="password"
                        component={TextField}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12}  >
                      <Field
                        name="confirmPassword"
                        label={<Typography className={classes.textFields}>Confirmar senha</Typography>}
                        size="small"
                        fullWidth
                        type="password"
                        component={TextField}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12} >
                      <Field
                        name="license"
                        component={Checkbox}
                      >
                        <Typography className={classes.text}>
                          {'Li e concordo com os '}
                          <a className={classes.textLicense} href={process.env.termos}>Termos de Uso</a>
                          {', '}
                          <a className={classes.textLicense} href={process.env.termos}>Privacidade</a>
                        </Typography>
                      </Field>
                      <Field
                        name="newsInfo"
                        component={Checkbox}
                      >
                        <Typography className={classes.text}>Desejo saber das novidades da plataforma</Typography>
                      </Field>
                    </Grid>

                    <Grid item xs={12} >
                      <MuiButton
                        type="submit"
                        disabled={submitting}
                        style={{ height: 45, fontSize: '1.6rem', background:palette.get().topGradient, color:palette.get().primaryText }}
                        fullWidth
                        variant='contained'
                        color="primary"
                      >{submitting ? 'Salvando...' : 'Criar conta'}</MuiButton>
                    </Grid>

                    <Grid item xs={12} >
                      <Link href="/login" >
                        <MuiButton
                          type="button"
                          disabled={submitting}
                          style={{ height: 45, fontSize: '1.6rem', color: '#0F61FD'  }}
                          fullWidth
                          variant='outlined'
                          color="primary"
                        >Já tenho conta. Fazer login</MuiButton>
                      </Link>
                    </Grid>
                  </Grid>
                </form>
              )}
            />

          </Paper>
        </Grid>
      </div >
    )
  )
}