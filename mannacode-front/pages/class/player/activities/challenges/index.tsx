import React, { useEffect, useState } from 'react';
import {
  FormHelperText,
  Grid, IconButton, Menu, MenuItem, Typography, withWidth,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// eslint-disable-next-line no-unused-vars
import { GridColDef, GridValueFormatterParams } from '@material-ui/data-grid';
import DataGrid from 'components/style/DataGrid';
import { PathName } from 'components/static/Route';
import palette from 'components/singleton/palette';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import BasePage from 'components/page/general/BasePage';
import { getChallenges } from '@/services/classPlayer';
import { getLocalStorage, LocalStorageItem } from 'components/static/LocalStorage';
import { defaultProperties } from 'components/base/Theme';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  div: {
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
    scrollMarginTop: `${defaultProperties.globalHeaderHeigth}`,
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
  const { width, groupChallengeId } = props;
  const [activities, setActivities] = useState<any[]>([]);

  const [messageError, setMessageError] = useState<string>(null);

  const pageSize = Math.floor(((window.innerHeight / 100 * 80) - 108) / 52);
  const widthGeneral = window.innerWidth - 73 - 50;
  const field10 = (widthGeneral / 12) * 10 / 6;
  const field20 = field10 * 2;
  const [page, setPage] = useState({ page: 1, pageSize: pageSize + 1, order: { field: 'index', sort: 1 } });
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(pageSize + 1);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);


  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePageChange = (params) => {
    setPage({ ...page, page: params.page + 1, pageSize: params.pageSize });
  };

  const openNewLink = (value) => {
    window.open(value, '_ blank')
  }

  const columns: GridColDef[] = [
    { field: 'title', headerAlign: 'center', align: 'center', headerName: 'Nome', width: width !== 'xs' ? field20 : 150, description: 'Nome do desafio', },
    { field: 'language', headerAlign: 'center', align: 'center', headerName: 'Linguagem', width: width !== 'xs' ? field20 : 150, description: 'Nome da linguagem de programção', },
    { field: 'finished', headerAlign: 'center', align: 'center', headerName: 'Finalizado', width: width !== 'xs' ? field10 : 150, description: 'Foi finalizado o desafio', },
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
              <MenuItem onClick={() => { openNewLink(`${PathName.class}${PathName.player}${PathName.activities}${PathName.challenges}${PathName.challenge}?challengeId=${row.id}&groupChallengeId=${groupChallengeId}`) }}> Entrar</MenuItem>
              <MenuItem style={{display: row?.finished === 'Sim' ? 'flex' : 'none'}}onClick={() => { router.push(`${PathName.class}${PathName.player}${PathName.activities}${PathName.challenges}${PathName.playersFinishedChallenge}?challengeId=${row.id}&groupChallengeId=${groupChallengeId}`) }}> Visualizar jogadores</MenuItem>
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
    if (page) {
      setLoading(true);
      getChallenges({ ...page, groupChallengeId, token: getLocalStorage(LocalStorageItem.tokenPlayer) })
        .then((response) => {
          if (response.ok) {
            setTotal(response.data.total);
            const _challenges = response.data.data.map(data => {
              return {
                id: data.id,
                title: data.title,
                language: data.language,
                finished: data.finished ? 'Sim' : 'Não',
                index: data.index,
              };
            });
            if (!active) {
              return;
            }
            setActivities(_challenges);
            setLoading(false);
            setMessageError('');
          } else {
            setMessageError(response.data.message);
          }
        });
    }
  }, [page])
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
          <Grid item xs={12} sm={10} style={{ background: palette.get().secondaryText }}>
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
        </Grid>
      </div>
    )
  );
}
export default withWidth()(Challenges);

export async function getServerSideProps({ query }) {
  const groupChallengeId = query.groupChallengeId ? query.groupChallengeId : false;

  return { props: { groupChallengeId } };
}