import { MenuItem as MuiMenuItemDefault, withStyles } from '@material-ui/core';

function MenuItemBasic(props) {
  const { paletteTheme } = props
  return   withStyles({
    root: {
      paddingLeft: 12,
      paddingRight: 12,
      backgroundColor: paletteTheme.card,
      color: paletteTheme.secondaryText,
      '&$selected': {
        backgroundColor: paletteTheme.background,
        color: paletteTheme.primaryText,
      },
      '&$selected:hover': {
        backgroundColor: paletteTheme.bottomGradient,
        color: paletteTheme.primaryText,
      },
      '&:hover': {
        backgroundColor: paletteTheme.bottomGradient,
        color: paletteTheme.primaryText,
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
}

export default MenuItemBasic;