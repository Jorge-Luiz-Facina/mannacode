import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  FormControl, Select, createStyles
} from '@material-ui/core'
import {
  ExpandMore as ExpandMoreIcon
} from '@material-ui/icons';
import PropTypes from 'prop-types';
import paletteCode from 'components/singleton/paletteCode';
import { palettesCode } from 'components/base/Theme';
import MenuItemBasic from './MenuItemBasic';

function ButtonMode(props) {
  const { onChangePaletteCode, paletteTheme } = props;
  const MenuItem = MenuItemBasic({ paletteTheme: paletteTheme });
  const useStylesTheme = makeStyles(() =>
    createStyles({
      menuSelect: {

        border: '1px solid black',
        borderRadius: '5%',
        backgroundColor: paletteCode.get().background,
        color: paletteCode.get().color
      },
      select: {
        fontSize: '1.6rem',
        fontFamily: 'Bahnschrift',
        fontWeight: 'bold',
        height: '4rem',
        '& div': {
          paddingTop: '1.1rem',
          paddingBottom: '0.9rem',
          height: '2rem',
          paddingRight: '0.6rem !important',
        },
        '& ul': {
          backgroundColor: paletteCode.get().color,
        },
        '&:before': {
          borderColor: paletteCode.get().color,
        },
        '&:after': {
          borderColor: paletteCode.get().color,
        }
      },
    }),
  );
  const classesTheme = useStylesTheme()
  return (
    <div>
      <FormControl fullWidth>
        <Select className={classesTheme.select}
          style={{ color: paletteCode.get().color, backgroundColor: paletteCode.get().background }}
          MenuProps={{ classes: { paper: classesTheme.menuSelect } }}
          defaultValue={''}
          value={paletteTheme}
          onChange={onChangePaletteCode}
          IconComponent={() => (
            <ExpandMoreIcon />
          )}
        >
          {palettesCode.map((item, index) => (
            <MenuItem key={index}
              // @ts-ignore [1]
              value={item} click={null}
              palette={paletteCode.get()}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

ButtonMode.defaultProps = {
  onChangePaletteCode: null,
  paletteTheme: null,
};

ButtonMode.propTypes = {
  onChangePaletteCode: PropTypes.any,
  paletteTheme: PropTypes.any,
};

export default ButtonMode
