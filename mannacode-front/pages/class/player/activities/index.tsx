import React, { useEffect, useState } from 'react';
import {
  Button,
  FormHelperText,
  Grid, IconButton, Menu, MenuItem, Typography, withWidth,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BasePage from 'components/page/general/BasePage';
// eslint-disable-next-line no-unused-vars
import { GridColDef, GridValueFormatterParams } from '@material-ui/data-grid';
import DataGrid from 'components/style/DataGrid';
import { useRouter } from 'next/router';
import { PathName } from 'components/static/Route';
import palette from 'components/singleton/palette';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { getLocalStorage, LocalStorageItem } from 'components/static/LocalStorage';
import { get } from '@/services/classPlayer';
import { defaultProperties } from 'components/base/Theme';
import Link from 'components/style/Link';

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
  const [activities, setActivities] = useState<any[]>([]);
  const [isClassification, setIsClassification] = useState<boolean>(false);

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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const columns: GridColDef[] = [
    { field: 'title', headerAlign: 'center', align: 'center', headerName: 'Nome', width: width !== 'xs' ? field20 : 150, description: 'Nome da atividade', },
    { field: 'classification', headerAlign: 'center', align: 'center', headerName: 'Classificação', width: width !== 'xs' ? field10 : 150, description: 'Classificaçaõ', },
    {
      field: 'validity', headerAlign: 'center', align: 'center', headerName: 'Encerra em', width: width !== 'xs' ? field10 : 150, description: 'Ultima atualização',
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
              <MenuItem onClick={() => { router.push(`${PathName.class}${PathName.player}${PathName.activities}${PathName.challenges}?groupChallengeId=${row.id}`) }}> Visualizar desafios</MenuItem>
              <MenuItem style={{display: row?.classification === 'Sim' ? 'flex' : 'none'}} onClick={() => { router.push(`${PathName.class}${PathName.player}${PathName.activities}${PathName.classification}?groupChallengeId=${row.id}`) }}> Classificação</MenuItem>
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
    if (page) {
      setLoading(true);
      get({ ...page, token: getLocalStorage(LocalStorageItem.tokenPlayer) },)
        .then((response) => {
          if (response.ok) {
            setTotal(response.data.total);
            setIsClassification(response.data.classificationLength === null || response.data.classificationLength > 0);
            const _activities = response.data.data.map(data => {
              return {
                id: data.id,
                title: data.title,
                classification: (data.classificationLength !== 0 || data.classificationLength === null) ? 'Sim' : 'Não',
                validity: new Date(data.validity.replace(/.\d+Z$/g, '')).toLocaleString('pt-BR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
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
          <Grid item xs={12} sm={9} style={{ background: palette.get().secondaryText }}>
            <Typography className={classes.textTitleHead}>
              Atividades
            </Typography>
            <FormHelperText className={classes.textErrorButton} {...(messageError && { error: true })}>{messageError || ''}</FormHelperText>
            <div style={{ height: window.innerHeight / 100 * 80, width: '100%' }}>
              <DataGrid onPageChange={handlePageChange} rowCount={total} textNoRowsOverlay={'Não há atividades'} onSortModelChange={onSortModelChange}
                loading={loading} height={window.innerHeight / 100 * 80} rows={activities} columns={columns} pageSize={pageSize} />
            </div>
          </Grid>
          {isClassification ? <Grid item xs={12} sm={1}>
            <Link
              href={`${PathName.class}${PathName.player}${PathName.classification}`}>
              <Button fullWidth
                variant="outlined"
                style={{ background: palette.get().bottomGradient, height: 45, color: palette.get().primaryText }}>
                Classificação</Button>
            </Link>
          </Grid>: <></>}
        </Grid> 
        
      </div>
    )
  );
}
export default withWidth()(MyActivities);
