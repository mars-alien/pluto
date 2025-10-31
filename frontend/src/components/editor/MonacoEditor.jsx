import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useFileSystem } from '../../context/FileContext';
import { useEditorSettings } from '../../context/EditorSettingsContext';

const getLanguageFromFileName = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  const languageMap = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    json: 'json',
    html: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    less: 'less',
    md: 'markdown',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    php: 'php',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    sql: 'sql',
    xml: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
    sh: 'shell',
    bash: 'shell',
    txt: 'plaintext'
  };
  return languageMap[ext] || 'plaintext';
};

export default function EnhancedMonacoEditor() {
  const { getActiveFile, updateFileContent } = useFileSystem();
  const { settings, getMonacoOptions } = useEditorSettings();
  const editorRef = useRef(null);
  const timeoutRef = useRef(null);

  const activeFile = getActiveFile();

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (activeFile) {
        const content = editor.getValue();
        updateFileContent(activeFile.id, content);
      }
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      editor.trigger('', 'actions.find');
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      editor.trigger('', 'editor.action.formatDocument');
    });

    editor.focus();
  };

  const handleEditorChange = (value) => {
    if (!activeFile || !settings.autoSave) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      updateFileContent(activeFile.id, value || '');
    }, settings.autoSaveDelay);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (editorRef.current && activeFile) {
      editorRef.current.focus();
    }
  }, [activeFile?.id]);

  if (!activeFile) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 text-gray-400">
        <div className="text-center">
          <svg
            className="w-20 h-20 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg font-medium mb-2">No file open</p>
          <p className="text-sm">Select a file from the explorer to start editing</p>
        </div>
      </div>
    );
  }

  const language = getLanguageFromFileName(activeFile.name);

  return (
    <div className="h-full relative">
      <div className="absolute top-2 right-4 z-10 text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
        {language}
      </div>
      <Editor
        height="100%"
        language={language}
        value={activeFile.content}
        theme={settings.theme}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={getMonacoOptions()}
        loading={
          <div className="h-full flex items-center justify-center bg-gray-900 text-gray-400">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p>Loading editor...</p>
            </div>
          </div>
        }
      />
    </div>
  );
}
