import React from 'react';
/* eslint-disable-next-line no-unused-vars */
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: '90%',
      width: '100%',
      padding: theme.spacing(2),
      position: 'relative',
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardHeader: {
      padding: theme.spacing(1, 2),
    },
    list: {
      width: '100%',
      height: '70vh',
      backgroundColor: theme.palette.background.paper,
      overflow: 'auto',
    },
    button: {
      margin: theme.spacing(0.5, 0),
    },
  }),
);

function not(a: number[], b: number[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: number[], b: number[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: number[], b: number[]) {
  return [...a, ...not(b, a)];
}

export default function ListCheckBox(props) {
  const { onSelected, targets, firstView, title } = props;

  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    onSelected(newChecked);
  };

  const handleToggleAll = (items: number[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
      onSelected(not(checked, items));
    } else {
      setChecked(union(checked, items));
      onSelected(union(checked, items));
    }
  };

  const numberOfChecked = (items: number[]) => intersection(checked, items).length;

  return (
    <Card >
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(targets)}
            checked={numberOfChecked(targets) === targets.length && targets.length !== 0}
            indeterminate={numberOfChecked(targets) !== targets.length && numberOfChecked(targets) !== 0}
            disabled={targets.length === 0}
            inputProps={{ 'aria-label': 'all items selected' }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(targets)}/${targets.length} selecionado`}
      />
      <Divider />

      <List className={classes.list} dense component="div" role="list" >
        {targets.map((value) => {
          const labelId = `checkbox-list-label-${value.id}`;
          return (
            <ListItem key={value.id} role='listitem' dense button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': value }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={
                <Grid container alignItems="center">
                  <Grid item xs>
                    <Typography variant="body2" style={{ color: 'color', fontWeight: 'bold' }}>
                      {value[firstView]}
                    </Typography>
                  </Grid>
                </Grid>
              } />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );
}

ListCheckBox.defaultProps = {
  title: null,
  onSelected: null,
  targets: null,
  firstView: null,
  titleLeft: '',
  titleRight: '',
};

ListCheckBox.propTypes = {
  title: PropTypes.string,
  onSelected: PropTypes.any,
  targets: PropTypes.any,
  firstView: PropTypes.string,
  titleLeft: PropTypes.string,
  titleRight: PropTypes.string,
};