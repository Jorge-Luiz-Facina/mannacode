import React, { useEffect, useState } from 'react';
import {
  Button,
  FormHelperText,
  Grid, IconButton, Menu, MenuItem, Typography, withWidth,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { myChallenges } from '@/services/challenges';
// eslint-disable-next-line no-unused-vars
import { GridColDef, GridValueFormatterParams } from '@material-ui/data-grid';
import DataGrid from 'components/style/DataGrid';
import { useAuth } from 'components/context/auth';
import { useRouter } from 'next/router';
import Link from 'components/style/Link';
import { PathName } from 'components/static/Route';
import palette from 'components/singleton/palette';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { remove, updateChallenge } from '@/services/challenges';
import AlertDialogRemove from 'components/style/AlertDialogRemove';
import BasePage from '../general/BasePage';

const useStyles = makeStyles((theme) => ({
  div: {
    minHeight: '93vh',
    width: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divChallenges: {
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

function Challenges(props) {
  const classes = useStyles();
  const router = useRouter();
  const { width, groupChallengeId, mode } = props;
  const { signed, token } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [editPosition, setEditPosition] = useState<boolean>(false);

  const [messageError, setMessageError] = useState<string>(null);

  const pageSize = Math.floor(((window.innerHeight / 100 * 80) - 108) / 52);
  const widthGeneral = window.innerWidth - 73 - 50;
  const field10 = (widthGeneral / 12) * 9 / 3;

  const [page, setPage] = useState({ page: 1, pageSize: pageSize + 1, order: { field: 'index', sort: 1 } });
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(pageSize + 1);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
  const [errorAlertDialog, setErrorAlertDialog] = useState<boolean>(false);
  const [removed, setRemoved] = useState<boolean>(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setOpenAlertDialog(false);
    setErrorAlertDialog(false);
  };

  const handleRemove = async (value) => {
    if (value === row.title) {
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

  const alterIndex = async (action) => {
    let newIndex = activities;
    if ((row.index === activities.length && action === 'down') || (row.index < 2 && action === 'up')) {
      return;
    }
    let idUp;
    let idDown;
    await setLoading(true);
    const id = newIndex.find(a => a.index === row.index).id;
    if (action === 'up') {
      idUp = newIndex.find(a => a.index === (row.index - 1)).id;
    } else {
      idDown = newIndex.find(a => a.index === (row.index + 1)).id;
    }
    let down;
    let up;
    if (action === 'up') {
      down = await updateChallenge(id, { index: row.index - 1 }, token);
      up = await updateChallenge(idUp, { index: row.index }, token);

    } else {
      up = await updateChallenge(id, { index: row.index + 1 }, token);
      down = await updateChallenge(idDown, { index: row.index }, token);
    }
    if (!up.ok) {
      setMessageError(up.data.message)
    }
    if (!down.ok) {
      setMessageError(down.data.message)
    }

    setActivities(newIndex);
    await setLoading(false);
    setEditPosition(true);
    setAnchorEl(null);
  };

  const handlePageChange = (params) => {
    setPage({ ...page, page: params.page + 1, pageSize: params.pageSize });
  };

  const columns: GridColDef [] = [
    { field: 'title', headerAlign: 'center', align: 'center', headerName: 'Nome', width: width !== 'xs' ? field10 : 150, description: 'Nome do desafio', },
    { field: 'language', headerAlign: 'center', align: 'center', headerName: 'Linguagem', width: width !== 'xs' ? field10 : 150, description: 'Nome da linguagem de programção', },
    {
      field: 'index', headerAlign: 'center', align: 'center', headerName: 'Posição', width: width !== 'xs' ? field10 : 150, description: 'Posição de exibição',
      
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
              <MenuItem onClick={() => { router.push(`${PathName.activities}${PathName.challenges}${PathName.challenge}?groupChallengeId=${groupChallengeId}&challengeId=${row.id}&mode=edit`) }}> Visualizar</MenuItem>
              <MenuItem onClick={() => { alterIndex('up') }}> Subir </MenuItem>
              <MenuItem onClick={() => { alterIndex('down') }}> Descer </MenuItem>
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
      order = { field: 'index', sort: 'desc' }
    }
    const sort = order.sort === 'asc' ? 1 : -1;
    setPage({ ...page, order: { field: order.field, sort: sort } })
  }

  useEffect(() => {
    let active = true;
    if (signed && page) {
      setLoading(true);
      myChallenges(page, groupChallengeId, token)
        .then((response) => {
          if (response.ok) {
            setTotal(response.data.total);
            const _challenges = response.data.data.map(data => {
              return {
                id: data.id,
                title: data.title,
                language: data.language,
                index: data.index,
              };
            });
            if (!active) {
              return;
            }
            setActivities(_challenges);
            setEditPosition(false);
            setLoading(false);
            setMessageError('');
          } else {
            setMessageError(response.data.message);
          }
        });
    }
  }, [page, signed, editPosition, removed])
  return (
    BasePage(
      <div lang='pt-br' className={classes.div} style={{ background: palette.get().background }}>

        <Grid
          className={classes.divChallenges}
          container
          direction="row"
          justify="space-evenly"
          alignItems="flex-start"
        >

          <Grid item xs={12} sm={9} style={{ background: palette.get().secondaryText }}>
            <Typography className={classes.textTitleHead}>
              Desafios
            </Typography>
            <FormHelperText className={classes.textErrorButton} {...(messageError && { error: true })}>{messageError || ''}</FormHelperText>
            <div style={{ height: window.innerHeight / 100 * 80, width: '100%' }}>
              <DataGrid onPageChange={handlePageChange} rowCount={total} textNoRowsOverlay={'Não há desafios'} 
                onSortModelChange={onSortModelChange}
                loading={loading} height={window.innerHeight / 100 * 80} rows={activities} columns={columns} pageSize={pageSize} />
            </div>
          </Grid>

          <Grid item xs={12} sm={1}>
            <div style={{ height: '160px' }}>
              <Grid style={{ height: '100%' }}
                container
                direction="column"
                justify="space-between"
                alignItems="center"
              >
                <Link
                  href={`${PathName.activities}${PathName.challenges}${PathName.challenge}?groupChallengeId=${groupChallengeId}&mode=new`}
                >
                  <Button fullWidth
                    variant="outlined"
                    style={{ background: palette.get().bottomGradient, height: 45, color: palette.get().primaryText }}
                  >
                    Novo desafio</Button>
                </Link>

                <Link
                  href={`${PathName.activities}${PathName.settings}?groupChallengeId=${groupChallengeId}&mode=${mode}`}
                >
                  <Button fullWidth
                    variant="outlined"
                    style={{ backgroundColor: palette.get().primaryText, color: palette.get().buttonNext, border: '2px solid', borderColor: palette.get().buttonNext, height: 45, }}
                  >
                    Próximo</Button>
                </Link>

                <Link
                  href={`${PathName.activities}`}
                >
                  <Button fullWidth
                    variant="outlined"
                    style={{ backgroundColor: palette.get().primaryText, color: palette.get().buttonBack, border: '2px solid', borderColor: palette.get().buttonBack, height: 45 }}
                  >
                    Atividades</Button>
                </Link>
              </Grid>
            </div>

          </Grid>
        </Grid>
        <AlertDialogRemove buttonTextAction='Excluir' error={errorAlertDialog} handleRemove={handleRemove} open={openAlertDialog} title='Excluir desafio' text='Para excluir o desafio coloque o nome do desafio e exclua' label={'Nome do desafio'} handleClose={handleClose}></AlertDialogRemove>
      </div>
    )
  );
}
export default withWidth()(Challenges);
