import React, { useEffect, useState } from 'react';
import {
  FormHelperText,
  Grid, IconButton, Menu, MenuItem, Typography, withWidth,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BasePage from 'components/page/general/BasePage';
// eslint-disable-next-line no-unused-vars
import { GridColDef, GridValueFormatterParams } from '@material-ui/data-grid';
import DataGrid from 'components/style/DataGrid';
import { useAuth } from 'components/context/auth';
import { PathName } from 'components/static/Route';
import palette from 'components/singleton/palette';
import { getPlayer, getPlayers, remove } from '@/services/playerStartSolo';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AlertDialogRemove from 'components/style/AlertDialogRemove';
import { reSendEmail } from '@/services/authenticationPlayer';

const useStyles = makeStyles((theme) => ({
  div: {
    minHeight: '93vh',
    width: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divActivities: {
    borderRadius: 5,
    padding: 0,
    zIndex: 10,
    width: '100%',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      width: '65%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '98%',
    },
  },
  textErrorButton: {
    fontSize: '1.5rem',
    color: '#DA1E27',
    fontFamily: 'IBM Plex Sans',
    margin: 0,
    textAlign: 'center',
  },
  textTitleHead: {
    color: '#4c4c4c',
    fontFamily: 'Bahnschrift',
    fontSize: '5.0rem',
    fontWeight: 'bold',
    fontStretch: 'condensed',
    textAlign: 'center'
  },
}));

function MyPlayers(props) {
  const classes = useStyles();
  const { width, applicatorStartId } = props;
  const { signed, token, statusRedirect } = useAuth();
  const [players, setPlayers] = useState<any[]>([]);
  const [messageError, setMessageError] = useState<string>(null);

  const pageSize = Math.floor(((window.innerHeight / 100 * 80) - 108) / 52);
  const widthGeneral = window.innerWidth - 73 - 50;
  const field10 = (widthGeneral / 12) * 10 / 5;
  const field20 = field10 * 2;

  const [page, setPage] = useState({ page: 1, pageSize: pageSize + 1, order: { field: 'createdAt', sort: -1 } });
  const [removed, setRemoved] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(pageSize + 1);
  const [row, setRow] = useState(null);
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
  const [errorAlertDialog, setErrorAlertDialog] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);


  const handleClose = () => {
    setOpenAlertDialog(false);
    setErrorAlertDialog(false);
  };

  const handleRemove = async (value) => {
    if (value === row.name) {
      if (signed) {
        const response = await remove(row.id, token);
        if (response.ok) {
          setRemoved(true);
        }
      }
      setOpenAlertDialog(false);
    } else {
      setErrorAlertDialog(true);
    }
  };

  const acessPlayer = async () => {
    if (signed) {
      const response = await getPlayer(row.id, token);
      if (response.ok) {
        const acess = `Link: ${window.location.hostname}${PathName.class}${PathName.player}${PathName.login}?keyClass=${response.data.keyClass}
Nome: ${response.data.name}
Chave: ${response.data.key}`;
        navigator.clipboard.writeText(acess);
        setAnchorEl(null);
      } else {
        setMessageError(response.data.message)
      }
    }
  };
  const reGenerateKeyPlayer = async () => {
    if (signed) {
      const response = await reSendEmail(row.id, token);
      if (!response.ok) {
        setMessageError(response.data.message)
      } 
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerAlign: 'center', align: 'center', headerName: 'Nome', width: width !== 'xs' ? field20 : 150, description: 'Nome do jogador', },
    { field: 'email', headerAlign: 'center', align: 'center', headerName: 'Email ', width: width !== 'xs' ? field10 : 150, description: 'E-mail do jogador', },
    { field: 'status', headerAlign: 'center', align: 'center', headerName: 'Já acessou ', width: width !== 'xs' ? field10 : 150, description: 'O jogador já acessou a plataforma com acesso recente que foi enviado', },

    {
      field: 'punctuationTotal', headerAlign: 'center', align: 'center', type: 'date', headerName: 'Pontuação total', width: width !== 'xs' ? field10 : 150, description: 'Pontuação total',
      /* eslint-disable-next-line react/display-name */
      renderCell: (params: GridValueFormatterParams) => (
        <Grid
          container
          direction="row"
          justify="flex-end"
          alignItems="center"
        >
          <Grid item xs={6} style={{ textAlign: 'end' }}>
            {(params.value as number)}
          </Grid>

          <Grid item xs={6} style={{ textAlign: 'end' }}>
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={(e) => { setRow(params.row); handleClick(e) }}
            >
              <MoreVertIcon />
            </IconButton>

            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={() => { setAnchorEl(null); }}
            >
              <MenuItem onClick={() => { acessPlayer(); }}> Copiar acesso</MenuItem>
              <MenuItem onClick={() => { reGenerateKeyPlayer(); }}> Enviar email com novo acesso</MenuItem>
              <MenuItem onClick={() => { setOpenAlertDialog(true); setAnchorEl(null); }}> Remover </MenuItem>
            </Menu>
          </Grid>
        </Grid>
      ),
    },
  ];

  const handlePageChange = (params) => {
    setPage({ ...page, page: params.page + 1, pageSize: params.pageSize });
  };

  const onSortModelChange = async (value) => {
    let order = value.sortModel[0];
    if (!order?.field) {
      order = { field: 'punctuationTotal', sort: 'desc' }
    }
    const sort = order.sort === 'asc' ? 1 : -1;
    setPage({ ...page, order: { field: order.field, sort: sort } })
  }

  useEffect(() => {
    let active = true;
    if (signed && page) {
      setLoading(true);
      getPlayers({ ...page, applicatorStartId }, token)
        .then((response) => {
          statusRedirect(response.data.code);
          if (response.ok) {
            setTotal(response.data.total);
            const _players = response.data.data.map(data => {
              return {
                id: data.id,
                name: data.name,
                email: data.email,
                status: data.status === 'INITIALIZED'? 'Sim' : 'Não',
                punctuationTotal: data.punctuationTotal
              };
            });

            if (!active) {
              return;
            }
            setPlayers(_players);
            setLoading(false);
            setMessageError('');
            setRemoved(false);
          } else {
            setMessageError(response.data.message);
          }
        });
    }
  }, [page, signed, removed])
  return (
    BasePage(
      <div lang='pt-br' className={classes.div} style={{ background: palette.get().background }}>
        <Grid
          className={classes.divActivities}
          container
          direction="row"
          justify="space-evenly"
          alignItems="flex-start"
        >
          <Grid item xs={12} sm={10} style={{ background: palette.get().secondaryText }}>
            <Typography className={classes.textTitleHead}>
              Jogadores
            </Typography>
            <FormHelperText className={classes.textErrorButton} {...(messageError && { error: true })}>{messageError || ''}</FormHelperText>
            <div style={{ height: window.innerHeight / 100 * 80, width: '100%' }}>
              <DataGrid onPageChange={handlePageChange} rowCount={total} textNoRowsOverlay={'Não há atividades'} onSortModelChange={onSortModelChange}
                loading={loading} height={window.innerHeight / 100 * 80} rows={players} columns={columns} pageSize={pageSize} />
            </div>
          </Grid>
        </Grid>
        <AlertDialogRemove buttonTextAction='Excluir' error={errorAlertDialog}
          handleRemove={handleRemove} open={openAlertDialog} title='Excluir jogador'
          text='Para excluir a jogador coloque o nome do jogador e exclua' label='Nome da turma'
          handleClose={handleClose}></AlertDialogRemove>
      </div>
    )
  );
}
export default withWidth()(MyPlayers);

export async function getServerSideProps({ query }) {
  const applicatorStartId = query.applicatorStartId ? query.applicatorStartId : false
  return { props: { applicatorStartId, } };
}
