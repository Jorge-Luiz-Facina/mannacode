import React, { useEffect, useState } from 'react';
import {
  createStyles,
  FormHelperText,
  Grid, IconButton, Typography, withWidth,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BasePage from '../../../../components/page/general/BasePage';
// eslint-disable-next-line no-unused-vars
import { GridColDef, GridValueFormatterParams } from '@material-ui/data-grid';
import DataGrid from 'components/style/DataGrid';
import { useAuth } from 'components/context/auth';
import { useRouter } from 'next/router';
import { PathName } from 'components/static/Route';
import palette from 'components/singleton/palette';
import { getPlayerChallengeByPlayerStartId } from '@/services/playerChallenges';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

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
  const { width, playerStartId, groupChallengeId } = props;
  const { signed, token, statusRedirect } = useAuth();
  const [players, setPlayers] = useState<any[]>([]);
  const [messageError, setMessageError] = useState<string>(null);

  const pageSize = Math.floor(((window.innerHeight / 100 * 80) - 108) / 52);
  const widthGeneral = window.innerWidth - 73 - 50;
  const field10 = (widthGeneral / 12) * 10 / 4;

  const [page, setPage] = useState({ page: 1, pageSize: pageSize + 1, order: { field: 'createdAt', sort: 1 } });
  const [removed, setRemoved] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(pageSize + 1);

  const useStylesTheme = makeStyles(() =>
    createStyles({
      iconItem: {
        color: '#325ab3',
        '& svg': {
          fontSize: '2.5rem'
        },
        '&.active, &:hover, &.active:hover': {
          color: palette.get().primaryText,
        }
      },
    }),
  );
  const classesTheme = useStylesTheme();

  const columns: GridColDef[] = [
    { field: 'title', headerAlign: 'center', align: 'center', headerName: 'Nome', width: width !== 'xs' ? field10 : 150, description: 'Nome do desafio', },
    { field: 'language', headerAlign: 'center', align: 'center', headerName: 'Linguagem', width: width !== 'xs' ? field10 : 150, description: 'Linguagem do desafio', },
    { field: 'punctuationTotal', headerAlign: 'center', align: 'center', headerName: 'Pontuação', width: width !== 'xs' ? field10 : 150, description: 'Pontuação total', },
    {
      field: 'index', headerAlign: 'center', align: 'center', headerName: 'Índice', width: width !== 'xs' ? field10 : 150, description: 'Posição do desafio',
      /* eslint-disable-next-line react/display-name */
      renderCell: (params: GridValueFormatterParams) => (
        <Grid
          container
          direction="row"
          justify="flex-end"
          alignItems="center"
        >
          <Grid item xs={7} style={{ textAlign: 'end' }}>
            {(params.value as string)}
          </Grid>

          <Grid item xs={5} style={{ textAlign: 'end' }}>
            <IconButton className={classesTheme.iconItem}
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={() => {  router.push(`${PathName.results}${PathName.players}${PathName.challenges}${PathName.challenge}?playerChallengeId=${params.row.id}&groupChallengeId=${groupChallengeId}&playerStartId=${playerStartId}`) }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Grid>
        </Grid>
      ),
    },
  ];

  const handlePageChange = (params) => {
    setPage({ ...page, page: params.page + 1, pageSize: params.pageSize });
  };

  useEffect(() => {
    let active = true;
    if (signed && page) {
      setLoading(true);
      getPlayerChallengeByPlayerStartId({ ...page, playerStartId: playerStartId, groupChallengeId: groupChallengeId }, token)
        .then((response) => {
          if(response.ok) {
            statusRedirect(response.data.code);
            setTotal(response.data.total);
            const _players = response.data.data.map(data => {
              return {
                id: data.id,
                title: data.challenge.title,
                language: data.challenge.language,
                punctuationTotal: data.punctuationTotal,
                index: data.challenge.index,
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
              Desafios
            </Typography>
            <FormHelperText className={classes.textErrorButton} {...(messageError && { error: true })}>{messageError || ''}</FormHelperText>
            <div style={{ height: window.innerHeight / 100 * 80, width: '100%' }}>
              <DataGrid onPageChange={handlePageChange} rowCount={total} textNoRowsOverlay={'Não há desafios'} onSortModelChange={null}
                loading={loading} height={window.innerHeight / 100 * 80} rows={players} columns={columns} pageSize={pageSize} />
            </div>
          </Grid>
        </Grid>
      </div>
    )
  );
}

export async function getServerSideProps({ query }) {
  const groupChallengeId = query.groupChallengeId ? query.groupChallengeId : false;
  const playerStartId = query.playerStartId ? query.playerStartId : false;

  return { props: { groupChallengeId, playerStartId } };
}
export default withWidth()(MyActivities);