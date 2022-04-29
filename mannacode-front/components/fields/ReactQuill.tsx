import React from 'react';
import PropTypes from 'prop-types';
import 'react-quill/dist/quill.core.css';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import dynamic from 'next/dynamic'
import hljs from 'highlight.js'
import { FormHelperText, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  textError: {
    paddingLeft: '15px',
    fontSize: '1.5rem',
    color: '#DA1E27',
    fontFamily: 'IBM Plex Sans',
    margin: 0,
  },
}));


hljs.configure({
  languages: ['javascript', 'ruby', 'python', 'rust'],
})

const MuiReactQuill = dynamic(() => import('react-quill'), {
  ssr: false
});

const modules = {
  syntax:false,
  
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' }
    ],
    ['link'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false
  }
};

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'clean',
];


const ReactQuill = ({
  input, meta, ...props
}) => {
  const classes = useStyles();

  if (!input || !meta) {
    throw Error('Sorry my friend. Did you forget field from final form?');
  }
  return (
    <>
      <MuiReactQuill
        {...input}
        {...props}
        modules={modules}
        formats={formats}
      />
      {meta.error && meta.touched && <FormHelperText className={classes.textError}>{meta.error}</FormHelperText>}
    </>
  );
};

ReactQuill.defaultProps = {
  input: null,
  meta: null,
};

ReactQuill.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
};

export default ReactQuill;
