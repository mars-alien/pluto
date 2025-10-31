import React, { useState, useRef, useEffect } from 'react';
import { useFileSystem } from '../../context/FileContext';

const FileIcon = ({ fileName }) => {
  const ext = fileName.split('.').pop().toLowerCase();

  const iconMap = {
    js: '📜',
    jsx: '⚛️',
    ts: '📘',
    tsx: '⚛️',
    json: '📋',
    html: '🌐',
    css: '🎨',
    scss: '🎨',
    md: '📝',
    py: '🐍',
    java: '☕',
    cpp: '⚙️',
    go: '🔵',
    rs: '🦀',
    txt: '📄',
    yml: '⚙️',
    yaml: '⚙️',
    xml: '📄',
    sql: '🗄️'
  };

  return <span className="mr-2">{iconMap[ext] || '📄'}</span>;
};

const FileTreeItem = ({ item, level = 0 }) => {
  const {
    openFile,
    toggleDirectory,
    deleteItem,
    renameItem,
    createNewFile,
    createNewDirectory,
    activeFileId
  } = useFileSystem();

  const [contextMenu, setContextMenu] = useState(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(item.name);
  const [showNewItemInput, setShowNewItemInput] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const inputRef = useRef(null);
  const newItemInputRef = useRef(null);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  useEffect(() => {
    if (showNewItemInput && newItemInputRef.current) {
      newItemInputRef.current.focus();
    }
  }, [showNewItemInput]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    if (contextMenu) {
      document.addEventListener('click', closeContextMenu);
      return () => document.removeEventListener('click', closeContextMenu);
    }
  }, [contextMenu]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (item.type === 'file') {
      openFile(item.id);
    } else {
      toggleDirectory(item.id);
    }
  };

  const handleRename = () => {
    if (newName.trim() && newName !== item.name) {
      renameItem(item.id, newName.trim());
    }
    setIsRenaming(false);
    setContextMenu(null);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      deleteItem(item.id);
    }
    setContextMenu(null);
  };

  const handleNewItem = (type) => {
    setShowNewItemInput(type);
    setContextMenu(null);
  };

  const handleCreateNewItem = () => {
    if (newItemName.trim()) {
      if (showNewItemInput === 'file') {
        createNewFile(newItemName.trim(), item.type === 'directory' ? item.id : null);
      } else {
        createNewDirectory(newItemName.trim(), item.type === 'directory' ? item.id : null);
      }
    }
    setShowNewItemInput(null);
    setNewItemName('');
  };

  const isActive = item.type === 'file' && activeFileId === item.id;

  return (
    <div>
      <div
        className={`
          flex items-center px-2 py-1 cursor-pointer hover:bg-gray-700 rounded
          ${isActive ? 'bg-blue-600 text-white' : 'text-gray-200'}
        `}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        {item.type === 'directory' && (
          <span className="mr-1 text-xs">
            {item.isOpen ? '📂' : '📁'}
          </span>
        )}
        {item.type === 'file' && <FileIcon fileName={item.name} />}

        {isRenaming ? (
          <input
            ref={inputRef}
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') {
                setIsRenaming(false);
                setNewName(item.name);
              }
            }}
            className="flex-1 bg-gray-800 text-white px-1 py-0 text-sm border border-blue-500 rounded outline-none"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="flex-1 text-sm truncate">{item.name}</span>
        )}
      </div>

      {contextMenu && (
        <div
          className="fixed bg-gray-800 border border-gray-700 rounded shadow-lg py-1 z-50 min-w-[160px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          {item.type === 'directory' && (
            <>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                onClick={() => handleNewItem('file')}
              >
                New File
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                onClick={() => handleNewItem('directory')}
              >
                New Folder
              </button>
              <div className="border-t border-gray-700 my-1"></div>
            </>
          )}
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
            onClick={() => {
              setIsRenaming(true);
              setContextMenu(null);
            }}
          >
            Rename
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}

      {showNewItemInput && item.type === 'directory' && (
        <div style={{ paddingLeft: `${(level + 1) * 16 + 8}px` }} className="px-2 py-1">
          <input
            ref={newItemInputRef}
            type="text"
            value={newItemName}
            placeholder={showNewItemInput === 'file' ? 'filename.ext' : 'foldername'}
            onChange={(e) => setNewItemName(e.target.value)}
            onBlur={handleCreateNewItem}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateNewItem();
              if (e.key === 'Escape') {
                setShowNewItemInput(null);
                setNewItemName('');
              }
            }}
            className="w-full bg-gray-800 text-white px-2 py-1 text-sm border border-blue-500 rounded outline-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {item.type === 'directory' && item.isOpen && item.children && (
        <div>
          {item.children.map(child => (
            <FileTreeItem key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function FileTree() {
  const { fileStructure, createNewFile, createNewDirectory, downloadAsZip } = useFileSystem();
  const [showNewItemInput, setShowNewItemInput] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const newItemInputRef = useRef(null);

  useEffect(() => {
    if (showNewItemInput && newItemInputRef.current) {
      newItemInputRef.current.focus();
    }
  }, [showNewItemInput]);

  const handleCreateRootItem = () => {
    if (newItemName.trim()) {
      if (showNewItemInput === 'file') {
        createNewFile(newItemName.trim(), null);
      } else {
        createNewDirectory(newItemName.trim(), null);
      }
    }
    setShowNewItemInput(null);
    setNewItemName('');
  };

  return (
    <div className="h-full flex flex-col bg-gray-800 text-white">
      <div className="px-3 py-2 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Explorer</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setShowNewItemInput('file')}
            className="p-1 hover:bg-gray-700 rounded"
            title="New File"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          <button
            onClick={() => setShowNewItemInput('directory')}
            className="p-1 hover:bg-gray-700 rounded"
            title="New Folder"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={downloadAsZip}
            className="p-1 hover:bg-gray-700 rounded"
            title="Download as ZIP"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto py-2">
        {showNewItemInput && (
          <div className="px-2 py-1">
            <input
              ref={newItemInputRef}
              type="text"
              value={newItemName}
              placeholder={showNewItemInput === 'file' ? 'filename.ext' : 'foldername'}
              onChange={(e) => setNewItemName(e.target.value)}
              onBlur={handleCreateRootItem}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateRootItem();
                if (e.key === 'Escape') {
                  setShowNewItemInput(null);
                  setNewItemName('');
                }
              }}
              className="w-full bg-gray-900 text-white px-2 py-1 text-sm border border-blue-500 rounded outline-none"
            />
          </div>
        )}

        {fileStructure.map(item => (
          <FileTreeItem key={item.id} item={item} level={0} />
        ))}
      </div>
    </div>
  );
}
