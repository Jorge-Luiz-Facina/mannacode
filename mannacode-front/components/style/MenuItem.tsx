import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem as MuiMenuItemDefault, withStyles } from '@material-ui/core';

function MenuItemStyle(props) {

  const { palette, click, children, innerRef, value } = props;
  const MenuItem = withStyles({
    root: {
      paddingLeft: 12,
      paddingRight: 12,
      backgroundColor: palette.card,
      color: palette.secondaryText,
      '&$selected': {
        backgroundColor: palette.background,
        color: palette.primaryText,
      },
      '&$selected:hover': {
        backgroundColor: palette.bottomGradient,
        color: palette.primaryText,
      },
      '&:hover': {
        backgroundColor: palette.bottomGradient,
        color: palette.primaryText,
      },

      fontSize: '1.5rem',
      fontWeight: 'bold',
      fontFamily: 'Bahnschrift',
      '& ul': {
        fontSize: '2.0rem',
        fontWeight: 'bold',
        fontFamily: 'Bahnschrift',
        fontStretch: 'condensed',
      },

    },
    selected: {}
  })(MuiMenuItemDefault);

  return (

    <MenuItem button value={value} ref={innerRef}  onClick={click}>
      {children}
    </MenuItem>
  )
}

MenuItemStyle.defaultProps = {
  palette: null,
  click: null,
  children: null,
  innerRef: null,
  value: null
};

MenuItemStyle.propTypes = {
  palette: PropTypes.object,
  click: PropTypes.func,
  children: PropTypes.any,
  innerRef: PropTypes.any,
  value: PropTypes.any
};

const MenuItem =  React.forwardRef<any, any>((props, ref) => <MenuItemStyle {...props} innerRef={ref} />);
MenuItem.displayName = 'MenuItem'
export default MenuItem;