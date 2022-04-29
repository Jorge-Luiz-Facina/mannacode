import React from 'react';
import 'react-quill/dist/quill.core.css';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import dynamic from 'next/dynamic'
import hljs from 'highlight.js'
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

hljs.configure({
  languages: ['javascript', 'ruby', 'python', 'rust'],
})

const MuiReactQuill = dynamic(() => import('react-quill'), {
  ssr: false
});

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
  'code-block',
  'clean',
];

const ReactQuill = ({...props}) => {
  
  const modules = {
    syntax: {
      highlight: text => hljs.highlightAuto(text).value,
    },
    toolbar: props.toolbar ? [
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
      ['code-block'],
      ['clean']
    ] : false,
    clipboard: {
      matchVisual: false
    }
  };
  return (

    <MuiReactQuill
      key={uuidv4()}
      {...props}
      modules={modules}
      formats={formats}
    />

  );
};

ReactQuill.defaultProps = {
  toolbar: true
};

ReactQuill.propTypes = {
  toolbar: PropTypes.any
};

export default ReactQuill;
