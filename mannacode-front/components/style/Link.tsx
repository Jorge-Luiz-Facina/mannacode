import React from 'react';
import NextLink from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  link: {
    width: '100%',
    '&:hover': {
      color: 'white',
    },
    color: theme.palette.primary.main,
    fontSize: '1.575rem',
  },
  notTextLink: {
    width: '100%',
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));

function LinkStyle(props) {
  const {
    href, children, innerRef, className,
  } = props;
  const classes = useStyles();
  let classLink = className ? `${className} ${classes.link}` : classes.link;

  if (!(typeof children === 'string' || children instanceof String)) {
    classLink = `${classLink} ${classes.notTextLink}`;
  }

  return (
    <NextLink {...props} ref={innerRef} href={href}>
      <a className={classLink}>{children}</a>
    </NextLink>
  );
}

LinkStyle.defaultProps = {
  href: null,
  children:null,
  innerRef: null,
  className: null,
};

LinkStyle.propTypes = {
  href: PropTypes.string,
  children: PropTypes.any,
  className: PropTypes.any,
  innerRef: PropTypes.any,
};

const Link = React.forwardRef<any, any>((props, ref) => <LinkStyle {...props} innerRef={ref} />);
Link.displayName = 'Link'
export default Link;