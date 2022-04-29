import React from 'react';
import PropTypes from 'prop-types';
import {
  createStyles, ListItem as MuiListItem, makeStyles
} from '@material-ui/core';
import Link from './Link';

function ListItem(props) {
  const {
    onClick, selected, children, palette, link, height,
  } = props;
  const useStyle = makeStyles(() => createStyles({
    listItem: {
      '&$selected': {
        backgroundColor: palette.background,
        color: palette.primaryText,
      },
      '&$selected:hover': {
        backgroundColor: palette.bottomGradient,
        color: palette.primaryText,
      },
      '&:hover': {
        backgroundColor: palette.topGradient,
        color: palette.primaryText,
      },
    },
    selected: {},
  }));
  const classes = useStyle();

  if (link === null) {
    return (

      <MuiListItem
        classes={{ root: classes.listItem, selected: classes.selected }}
        selected={selected}
        onClick={onClick}
        style={{ height }}
      >
        {children}
      </MuiListItem>

    );
  } else {
    return (
      <Link href={link}>
        <MuiListItem
          classes={{ root: classes.listItem, selected: classes.selected }}
          selected={selected}
          onClick={onClick}
          style={{ height }}
        >
          {children}
        </MuiListItem>
      </Link>
    );
  }
}

ListItem.defaultProps = {
  onClick: null,
  selected: false,
  children: null,
  palette: null,
  link: null,
  height: null,
};

ListItem.propTypes = {
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  children: PropTypes.element,
  palette: PropTypes.any,
  link: PropTypes.any,
  height: PropTypes.string,
};
export default ListItem;
