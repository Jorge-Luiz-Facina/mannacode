import React, { useEffect, useState } from 'react';
import {
  createStyles,
  FormHelperText,
  Grid, IconButton, Typography, withWidth,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BasePage from 'components/page/general/BasePage';
// eslint-disable-next-line no-unused-vars
import { GridColDef, GridValueFormatterParams } from '@material-ui/data-grid';
import DataGrid from 'components/style/DataGrid';
import { useAuth } from 'components/context/auth';
import { useRouter } from 'next/router';
import { PathName } from 'components/static/Route';
import palette from 'components/singleton/palette';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { findPlayerFinalizedChallengesByChallengeId } from '@/services/applicatorPlayerFinalizedChallenge';

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

function Players(props) {
  const classes = useStyles();
  const router = useRouter();
  const { width, challengeId } = props;
  const { signed, token, statusRedirect } = useAuth();
  const [players, setPlayers] = useState<any[]>([]);
  const [messageError, setMessageError] = useState<string>(null);

  const pageSize = Math.floor(((window.innerHeight / 100 * 80) - 108) / 52);
  const widthGeneral = window.innerWidth - 73 - 50;
  const field10 = (widthGeneral / 12) * 10 / 3;
  const field20 = field10 * 2;

  const [page, setPage] = useState({ page: 1, pageSize: pageSize + 1, order: { field: 'createdAt', sort: -1 } });

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
    { field: 'name', headerAlign: 'center', align: 'center', headerName: 'Nome', width: width !== 'xs' ? field20 : 150, description: 'Nome do jogador',sortable: false, },
    {
      field: 'punctuation', headerAlign: 'center', align: 'center', headerName: 'Pontuação',
      width: width !== 'xs' ? field10 : 150, description: 'Pontuação do jogador', sortable: false,
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
              onClick={() => { router.push(`${PathName.class}${PathName.applicator}${PathName.activities}${PathName.challenges}${PathName.players}${PathName.challenge}?playerChallengeId=${params.row.id}`) }}
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
      findPlayerFinalizedChallengesByChallengeId({ ...page, challengeId }, token)
        .then((response) => {
          statusRedirect(response.data.code);
          if (response.ok) {
            setTotal(response.data.total);
            const _players = response.data.data.map(data => {
              return {
                id: data.id,
                name: data.name,
                punctuation: data.punctuation ? data.punctuation : 'NP',
              };
            });

            if (!active) {
              return;
            }
            setPlayers(_players);
            setLoading(false);
            setMessageError('');
          } else {
            setMessageError(response.data.message);
          }
        });
    }
  }, [page, signed])
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
              <DataGrid onPageChange={handlePageChange} rowCount={total} textNoRowsOverlay={'Não há jogadores'} onSortModelChange={null}
                loading={loading} height={window.innerHeight / 100 * 80} rows={players} columns={columns} pageSize={pageSize} />
            </div>
          </Grid>
        </Grid>
      </div>
    )
  );
}

export async function getServerSideProps({ query }) {
  const challengeId = query.challengeId ? query.challengeId : false;

  return { props: { challengeId} };
}
export default withWidth()(Players);
