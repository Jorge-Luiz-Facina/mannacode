import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic'
const MuiAceEditor = dynamic(
  async () => {
    const reactAce = await import('react-ace');
    await import('ace-builds/webpack-resolver');
    await import('ace-builds/src-min-noconflict/ext-language_tools');

    await import('ace-builds/src-min-noconflict/mode-python');
    await import('ace-builds/src-min-noconflict/mode-java');
    await import('ace-builds/src-min-noconflict/mode-javascript');
    await import('ace-builds/src-min-noconflict/mode-csharp');

    await import('ace-builds/src-min-noconflict/theme-tomorrow_night');
    await import('ace-builds/src-min-noconflict/theme-textmate');

    let ace = require('ace-builds/src-min-noconflict/ace');
    ace.config.set(
      'basePath',
      'https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/'
    );
    ace.config.setModuleUrl(
      'ace/mode/javascript_worker',
      'https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/worker-javascript.js'
    );
    return reactAce;
  },
  {
    ssr: false
  }
);

const AceEditor = ({
  input, height, font, meta, ...props
}) => {

  if (!input || !meta) {
    throw Error('Sorry my friend. Did you forget field from final form?');
  }

  return (
    <MuiAceEditor
      {...input}
      {...props}
      style={{ width: '100%', height: height, }}
      tabSize={2}
      showPrintMargin={false}
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        fontSize: `${font}px`,
      }}
    />
  );
};

AceEditor.defaultProps = {
  height: null,
  font: null,
  input: null,
  meta: null,
  error: null,
  helperText: null
};

AceEditor.propTypes = {
  height : PropTypes.string,
  font : PropTypes.string,
  input: PropTypes.object,
  meta: PropTypes.object,
  error: PropTypes.any,
  helperText: PropTypes.string
};

export default AceEditor;
