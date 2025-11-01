import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ 
  value = '// Start coding here...\n', 
  onChange, 
  language = 'javascript',
  theme = 'vs-dark',
  fontSize = 14,
  fontFamily = 'Space Mono',
  readOnly = false
}) => {
  const editorRef = useRef(null);

  useEffect(() => {
    // Update editor options when settings change
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize,
        fontFamily,
      });
    }
  }, [fontSize, fontFamily, theme]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      theme={theme}
      onChange={onChange}
      onMount={handleEditorDidMount}
      options={{
        fontSize,
        fontFamily,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
        lineNumbers: 'on',
        glyphMargin: true,
        folding: true,
        readOnly,
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        formatOnPaste: true,
        formatOnType: true,
      }}
    />
  );
};

export default CodeEditor;
