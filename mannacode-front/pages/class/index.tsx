import React, { useEffect, useState } from 'react';
import {
  Button,
  FormHelperText,
  Grid, IconButton, Menu, MenuItem, Typography, withWidth,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { remove } from '@/services/applicatorStartSolo';
import BasePage from '../../components/page/general/BasePage';
// eslint-disable-next-line no-unused-vars
import { GridColDef, GridValueFormatterParams } from '@material-ui/data-grid';
import DataGrid from 'components/style/DataGrid';
import { useAuth } from 'components/context/auth';
import { useRouter } from 'next/router';
import Link from 'components/style/Link';
import { PathName } from 'components/static/Route';
import palette from 'components/singleton/palette';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AlertDialogRemove from 'components/style/AlertDialogRemove';
import { getApplicatorclass } from '@/services/applicatorStart';

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

function MyActivities(props) {
  const classes = useStyles();
  const router = useRouter();
  const { width } = props;
  const { signed, token, statusRedirect } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [messageError, setMessageError] = useState<string>(null);

  const pageSize = Math.floor(((window.innerHeight / 100 * 80) - 108) / 52);
  const widthGeneral = window.innerWidth - 73 - 50;
  const field10 = (widthGeneral / 12) * 9 / 4;
  const field20 = field10 * 2;


  const [page, setPage] = useState({ page: 1, pageSize: pageSize + 1, order: { field: 'updatedAt', sort: -1 } });
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
  const linkLoginPlayer = () => {
    if (signed) {
      navigator.clipboard.writeText(`${window.location.hostname}${PathName.class}${PathName.player}${PathName.login}?keyClass=${row.key}`)
      setAnchorEl(null);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const columns: GridColDef[] = [
    { field: 'name', headerAlign: 'center', align: 'center', headerName: 'Nome', width: width !== 'xs' ? field20 : 150, description: 'Nome da turma', },
    { field: 'key', headerAlign: 'center', align: 'center', headerName: 'Chave', width: width !== 'xs' ? field10 : 150, description: 'Chave da turma', },
    {
      field: 'updatedAt', headerAlign: 'center', align: 'center', headerName: 'Atualização', width: width !== 'xs' ? field10 : 150, description: 'Ultima atualização',
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
              <MenuItem onClick={() => { router.push(`${PathName.class}${PathName.applicator}${PathName.activities}?applicatorStartId=${row.id}`) }}> Atividades</MenuItem>
              <MenuItem onClick={() => { router.push(`${PathName.class}${PathName.applicator}${PathName.players}?applicatorStartId=${row.id}`) }}> Jogadores</MenuItem>
              <MenuItem onClick={() => { linkLoginPlayer() }}> Copiar Login Player</MenuItem>
              <MenuItem onClick={() => { router.push(`${PathName.class}${PathName.newClass}?applicatorStartId=${row.id}&mode=edit`) }}> Editar</MenuItem>
              <MenuItem onClick={() => { setOpenAlertDialog(true); setAnchorEl(null); }}> Excluir </MenuItem>
            </Menu>
          </Grid>
        </Grid>
      ),
    },
  ];

  const onSortModelChange = async (value) => {
    let order = value.sortModel[0];
    if (!order?.field) {
      order = { field: 'updatedAt', sort: 'desc' }
    }
    const sort = order.sort === 'asc' ? 1 : -1;
    setPage({ ...page, order: { field: order.field, sort: sort } })
  }

  const handlePageChange = (params) => {
    setPage({ ...page, page: params.page + 1, pageSize: params.pageSize });
  };

  useEffect(() => {
    let active = true;
    if (signed && page) {
      setLoading(true);
      getApplicatorclass({ ...page, type: 'ROOM_SOLO' }, token)
        .then((response) => {
          statusRedirect(response.data.code);
          if (response.ok) {
            setTotal(response.data.total);
            const _activities = response.data.data.map(data => {
              return {
                id: data.id,
                name: data.name,
                key: data.key,
                updatedAt: new Date(data.updatedAt).toLocaleString('pt-BR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                }),
              };
            });

            if (!active) {
              return;
            }
            setActivities(_activities);
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
          <Grid item xs={12} sm={9} style={{ background: palette.get().secondaryText }}>
            <Typography className={classes.textTitleHead}>
              Turmas
            </Typography>
            <FormHelperText className={classes.textErrorButton} {...(messageError && { error: true })}>{messageError || ''}</FormHelperText>
            <div style={{ height: window.innerHeight / 100 * 80, width: '100%' }}>
              <DataGrid onPageChange={handlePageChange} rowCount={total} textNoRowsOverlay={'Não há turmas'} onSortModelChange={onSortModelChange}
                loading={loading} height={window.innerHeight / 100 * 80} rows={activities} columns={columns} pageSize={pageSize} />
            </div>
          </Grid>
          <Grid item xs={12} sm={1}>
            <Link
              href={`${PathName.class}${PathName.newClass}`}>
              <Button fullWidth
                variant="outlined"
                style={{ background: palette.get().bottomGradient, height: 45, color: palette.get().primaryText }}>
                Nova turma</Button>
            </Link>
          </Grid>
        </Grid>
        <AlertDialogRemove buttonTextAction='Excluir' error={errorAlertDialog} handleRemove={handleRemove} open={openAlertDialog} title='Excluir turma' text='Para excluir a turma coloque o nome da turma e exclua' label='Nome da turma' handleClose={handleClose}></AlertDialogRemove>
      </div>
    )
  );
}
export default withWidth()(MyActivities);
