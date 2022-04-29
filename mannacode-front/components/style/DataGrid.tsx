import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid as MuiDatGrid, GridOverlay } from '@material-ui/data-grid';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import palette from 'components/singleton/palette';



function DataGrid(props) {
  const { rows, columns, onRowClick, height, loading, onPageChange, rowCount, sortModel, textNoRowsOverlay, onSortModelChange } = props;
  const useStyles = makeStyles(() => ({
    dataGrid: {
      fontSize: '2rem',
      background: palette.get().secondaryText,
      '& .MuiDataGrid-row:hover': {
        backgroundColor: palette.get().topGradient,
        color: palette.get().secondaryText,
      }
    },
  }));
  const classes = useStyles();

  function CustomNoRowsOverlay() {

    return (
      <GridOverlay>
        <Typography>{textNoRowsOverlay}</Typography>
      </GridOverlay>
    );
  }

  return (
    <div style={{ height: height, width: '100%' }}>
      <MuiDatGrid className={classes.dataGrid}
        components={{
          NoRowsOverlay: CustomNoRowsOverlay,
        }}
        disableSelectionOnClick
        sortModel={sortModel}
        onPageChange={onPageChange} rowCount={rowCount}
        onSortModelChange={onSortModelChange}
        disableColumnMenu onRowClick={onRowClick} rows={rows} columns={columns} autoPageSize
        paginationMode="server" loading={loading}
      />
    </div>
  );
}

DataGrid.defaultProps = {
  textNoRowsOverlay: 'Não há informações',
  loading: false,
  rows: null,
  columns: null,
  pageSize: null,
  onRowClick: null,
  onPageChange: null,
  height: null,
  rowCount: null,
  sortModel: null,
  onSortModelChange: null
};

DataGrid.propTypes = {
  textNoRowsOverlay: PropTypes.string,
  loading: PropTypes.bool,
  rows: PropTypes.array,
  columns: PropTypes.any,
  pageSize: PropTypes.any,
  onRowClick: PropTypes.any,
  onPageChange: PropTypes.any,
  height: PropTypes.any,
  rowCount: PropTypes.number,
  sortModel: PropTypes.any,
  onSortModelChange: PropTypes.any,
};

export default DataGrid;