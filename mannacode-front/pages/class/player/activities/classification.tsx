import React, { useEffect, useState } from 'react';
import {
  FormHelperText,
  Grid, Typography, withWidth,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BasePage from 'components/page/general/BasePage';
// eslint-disable-next-line no-unused-vars
import { GridColDef } from '@material-ui/data-grid';
import DataGrid from 'components/style/DataGrid';
import palette from 'components/singleton/palette';
import { getPunctuationPlayersFinalizedActivitie } from '@/services/challengePlayersFinalized';
import { getLocalStorage, LocalStorageItem } from 'components/static/LocalStorage';

const useStyles = makeStyles((theme) => ({
  div: {
    minHeight: '100vh',
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

function Classification(props) {
  const classes = useStyles();
  const { width, groupChallengeId } = props;
  const [players, setPlayers] = useState<any[]>([]);
  const [messageError, setMessageError] = useState<string>(null);

  const pageSize = Math.floor(((window.innerHeight / 100 * 80) - 108) / 52);
  const widthGeneral = window.innerWidth - 73 - 50;
  const field10 = (widthGeneral / 12) * 10 / 2;

  const [page, setPage] = useState({ page: 1, pageSize: pageSize + 1, order: { field: 'createdAt', sort: -1 } });
  const [removed, setRemoved] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(pageSize + 1);


  const columns: GridColDef[] = [
    { field: 'name', headerAlign: 'center', align: 'center', headerName: 'Nome', width: width !== 'xs' ? field10 : 150, description: 'Nome do desafio', },
    {
      field: 'punctuation', headerAlign: 'center', align: 'center', type: 'date', headerName: 'Pontuação', width: width !== 'xs' ? field10 : 150, description: 'Pontuação do jogador sobre a atividade',
    },
  ];

  const handlePageChange = (params) => {
    setPage({ ...page, page: params.page + 1, pageSize: params.pageSize });
  };

  useEffect(() => {
    let active = true;
    if (page) {
      setLoading(true);
      getPunctuationPlayersFinalizedActivitie({ ...page, groupChallengeId, token: getLocalStorage(LocalStorageItem.tokenPlayer) })
        .then((response) => {
          if (response.ok) {
            setTotal(response.data.total);
            const _players = response.data.data.map(data => {
              return {
                id: data.id,
                name: data.name,
                punctuation: data.punctuation,
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
  }, [page, removed])
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
              Classificação da atividade
            </Typography>
            <FormHelperText className={classes.textErrorButton} {...(messageError && { error: true })}>{messageError || ''}</FormHelperText>
            <div style={{ height: window.innerHeight / 100 * 80, width: '100%' }}>
              <DataGrid onPageChange={handlePageChange} rowCount={total} textNoRowsOverlay={'Não há atividades'} onSortModelChange={null}
                loading={loading} height={window.innerHeight / 100 * 80} rows={players} columns={columns} pageSize={pageSize} />
            </div>
          </Grid>
        </Grid>
      </div>
    )
  );
}
export default withWidth()(Classification);

export async function getServerSideProps({ query }) {
  const groupChallengeId = query.groupChallengeId ? query.groupChallengeId : false;

  return { props: { groupChallengeId} };
}
