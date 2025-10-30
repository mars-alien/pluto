import React from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const FileContext = createContext(null);

export const useFileSystem = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFileSystem must be used within FileProvider');
  }
  return context;
};

const generateId = () => Math.random().toString(36).substring(2, 15);

const createFile = (name, content = '', parentId = null) => ({
  id: generateId(),
  name,
  content,
  type: 'file',
  parentId,
  createdAt: Date.now(),
  updatedAt: Date.now()
});

const createDirectory = (name, parentId = null) => ({
  id: generateId(),
  name,
  type: 'directory',
  parentId,
  children: [],
  isOpen: false,
  createdAt: Date.now()
});

const initialFileStructure = [
  {
    id: 'root-1',
    name: 'src',
    type: 'directory',
    parentId: null,
    isOpen: true,
    children: [
      createFile('index.js', '// Welcome to the enhanced code editor!\nconsole.log("Hello World!");', 'root-1'),
      createFile('App.jsx', 'import React from "react";\n\nfunction App() {\n  return <div>Hello React!</div>;\n}\n\nexport default App;', 'root-1'),
      createFile('styles.css', 'body {\n  margin: 0;\n  font-family: sans-serif;\n}', 'root-1')
    ]
  }
];

export const FileProvider = ({ children }) => {
  const [fileStructure, setFileStructure] = useState(initialFileStructure);
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFileId, setActiveFileId] = useState(null);

  useEffect(() => {
    const savedStructure = localStorage.getItem('fileStructure');
    const savedOpenFiles = localStorage.getItem('openFiles');
    const savedActiveFile = localStorage.getItem('activeFileId');

    if (savedStructure) {
      try {
        setFileStructure(JSON.parse(savedStructure));
      } catch (e) {
        console.error('Failed to load saved file structure');
      }
    }
    if (savedOpenFiles) {
      try {
        setOpenFiles(JSON.parse(savedOpenFiles));
      } catch (e) {
        console.error('Failed to load open files');
      }
    }
    if (savedActiveFile) {
      setActiveFileId(savedActiveFile);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fileStructure', JSON.stringify(fileStructure));
  }, [fileStructure]);

  useEffect(() => {
    localStorage.setItem('openFiles', JSON.stringify(openFiles));
  }, [openFiles]);

  useEffect(() => {
    if (activeFileId) {
      localStorage.setItem('activeFileId', activeFileId);
    }
  }, [activeFileId]);

  const findItemById = useCallback((structure, id) => {
    for (const item of structure) {
      if (item.id === id) return item;
      if (item.type === 'directory' && item.children) {
        const found = findItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const findParentOfItem = useCallback((structure, id, parent = null) => {
    for (const item of structure) {
      if (item.id === id) return parent;
      if (item.type === 'directory' && item.children) {
        const found = findParentOfItem(item.children, id, item);
        if (found !== null) return found;
      }
    }
    return null;
  }, []);

  const updateFileContent = useCallback((fileId, content) => {
    const updateInStructure = (items) => {
      return items.map(item => {
        if (item.id === fileId) {
          return { ...item, content, updatedAt: Date.now() };
        }
        if (item.type === 'directory' && item.children) {
          return { ...item, children: updateInStructure(item.children) };
        }
        return item;
      });
    };

    setFileStructure(prev => updateInStructure(prev));
    setOpenFiles(prev => prev.map(f => f.id === fileId ? { ...f, content, updatedAt: Date.now() } : f));
  }, []);

  const createNewFile = useCallback((name, parentId = null) => {
    const newFile = createFile(name, '', parentId);

    if (parentId) {
      const updateStructure = (items) => {
        return items.map(item => {
          if (item.id === parentId && item.type === 'directory') {
            return { ...item, children: [...item.children, newFile], isOpen: true };
          }
          if (item.type === 'directory' && item.children) {
            return { ...item, children: updateStructure(item.children) };
          }
          return item;
        });
      };
      setFileStructure(prev => updateStructure(prev));
    } else {
      setFileStructure(prev => [...prev, newFile]);
    }
    return newFile;
  }, []);

  const createNewDirectory = useCallback((name, parentId = null) => {
    const newDir = createDirectory(name, parentId);

    if (parentId) {
      const updateStructure = (items) => {
        return items.map(item => {
          if (item.id === parentId && item.type === 'directory') {
            return { ...item, children: [...item.children, newDir], isOpen: true };
          }
          if (item.type === 'directory' && item.children) {
            return { ...item, children: updateStructure(item.children) };
          }
          return item;
        });
      };
      setFileStructure(prev => updateStructure(prev));
    } else {
      setFileStructure(prev => [...prev, newDir]);
    }
    return newDir;
  }, []);

  const deleteItem = useCallback((id) => {
    const deleteFromStructure = (items) => {
      return items.filter(item => {
        if (item.id === id) return false;
        if (item.type === 'directory' && item.children) {
          item.children = deleteFromStructure(item.children);
        }
        return true;
      });
    };

    setFileStructure(prev => deleteFromStructure(prev));
    setOpenFiles(prev => prev.filter(f => f.id !== id));
    if (activeFileId === id) {
      setActiveFileId(openFiles.length > 1 ? openFiles[0].id : null);
    }
  }, [activeFileId, openFiles]);

  const renameItem = useCallback((id, newName) => {
    const renameInStructure = (items) => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, name: newName, updatedAt: Date.now() };
        }
        if (item.type === 'directory' && item.children) {
          return { ...item, children: renameInStructure(item.children) };
        }
        return item;
      });
    };

    setFileStructure(prev => renameInStructure(prev));
    setOpenFiles(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
  }, []);

  const toggleDirectory = useCallback((id) => {
    const toggleInStructure = (items) => {
      return items.map(item => {
        if (item.id === id && item.type === 'directory') {
          return { ...item, isOpen: !item.isOpen };
        }
        if (item.type === 'directory' && item.children) {
          return { ...item, children: toggleInStructure(item.children) };
        }
        return item;
      });
    };

    setFileStructure(prev => toggleInStructure(prev));
  }, []);

  const openFile = useCallback((fileId) => {
    const file = findItemById(fileStructure, fileId);
    if (file && file.type === 'file') {
      const isAlreadyOpen = openFiles.some(f => f.id === fileId);
      if (!isAlreadyOpen) {
        setOpenFiles(prev => [...prev, file]);
      }
      setActiveFileId(fileId);
    }
  }, [fileStructure, openFiles, findItemById]);

  const closeFile = useCallback((fileId) => {
    setOpenFiles(prev => {
      const newOpenFiles = prev.filter(f => f.id !== fileId);
      if (activeFileId === fileId && newOpenFiles.length > 0) {
        const currentIndex = prev.findIndex(f => f.id === fileId);
        const nextFile = newOpenFiles[currentIndex] || newOpenFiles[currentIndex - 1] || newOpenFiles[0];
        setActiveFileId(nextFile.id);
      } else if (newOpenFiles.length === 0) {
        setActiveFileId(null);
      }
      return newOpenFiles;
    });
  }, [activeFileId]);

  const getActiveFile = useCallback(() => {
    return openFiles.find(f => f.id === activeFileId) || null;
  }, [openFiles, activeFileId]);

  const downloadAsZip = useCallback(async () => {
    const zip = new JSZip();

    const addToZip = (items, folder) => {
      items.forEach(item => {
        if (item.type === 'file') {
          folder.file(item.name, item.content || '');
        } else if (item.type === 'directory' && item.children) {
          const subFolder = folder.folder(item.name);
          addToZip(item.children, subFolder);
        }
      });
    };

    addToZip(fileStructure, zip);
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'project.zip');
  }, [fileStructure]);

  const value = {
    fileStructure,
    openFiles,
    activeFileId,
    setActiveFileId,
    updateFileContent,
    createNewFile,
    createNewDirectory,
    deleteItem,
    renameItem,
    toggleDirectory,
    openFile,
    closeFile,
    getActiveFile,
    downloadAsZip,
    findItemById
  };

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};
