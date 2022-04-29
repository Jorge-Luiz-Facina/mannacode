import React, { useState } from 'react';
import {
  Button as MuiButton, Divider, Menu, makeStyles
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Link from './Link';
import MenuItem from './MenuItem';
import PropTypes from 'prop-types';

function ButtonMenu(props) {
  const { palette, items, children } = props;
  const useStyles = makeStyles((theme) => ({
    buttonSignUp: {
      borderRadius: theme.spacing(50),
      fontSize: '1.575rem',
      fontWeight: 'bold',
      backgroundColor: palette.card,
      paddingLeft: '2.5rem',
      paddingRight: '2rem',
    },
    menu: {
      marging: '0px',
      padding: '0px',
      '& div': {
        alignItems: 'center',
        width: 'auto',
        backgroundColor: palette.background,
        minWidth: '180px',
        color: palette.primaryText,
        padding: 0,
        '& .MuiList-padding': {
          padding: 0,
        },
      },
      '& ul li': {
        fontSize: '2.0rem',
        fontWeight: 'bold',
        fontFamily: 'Bahnschrift',
        fontStretch: 'condensed',
        color: palette.secondaryText,
      },
    },
    link: {
      color: palette.secondaryText,
      padding: '2px',
      paddingRight: 0,
      paddingLeft: 0,
    },
  }));

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.currentTarget.style.color = palette.primaryText;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e) => {
    e.preventDefault();
    setAnchorEl(null);
  };
  return (
    <div style={{ textAlignLast: 'end' }}>
      <MuiButton
        className={classes.buttonSignUp}
        style={{ color: anchorEl ? palette.primaryText : palette.secondaryText }}
        aria-owns={anchorEl ? 'simple-menu' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
      >
        {children}
      </MuiButton>
      <Menu
        className={classes.menu}
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        getContentAnchorEl={null}
        onClick={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {items.map((item) => (
          <div key={item.name}>
            <MenuItem click={item.onClick} key={item.name} value={item.name} palette={palette}>
              <Link href={item.link} className={classes.link} >
                {item.name}
              </Link>
            </MenuItem>
            {item.divider ? <Divider style={{ backgroundColor: palette.secondaryText }} /> : <div />}
          </div>
        ))}
      </Menu>
    </div>
  );
}

ButtonMenu.defaultProps = {
  palette: null,
  items: null,
  children: null
};

ButtonMenu.propTypes = {
  palette: PropTypes.object,
  items: PropTypes.any,
  children: PropTypes.any
};

export default ButtonMenu;
