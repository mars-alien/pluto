import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useResizablePanels from "../hooks/useResizablePanels";
import DashboardService from "../services/DashboardService";
import PageLayout from "../components/PageLayout";

import VideoPlayerPanel from "../components/dashboard/VideoPlayerPanel";
import EditorSidebar from "../components/editor/EditorSidebar";
import DrawingCanvas from "../components/editor/DrawingCanvas";
import ResizableDivider from "../components/dashboard/ResizableDivider";

import { FileProvider } from "../context/FileContext";
import { EditorSettingsProvider } from "../context/EditorSettingsContext";

import EditorPanel from "../components/dashboard/EditorPanel";
import FileTabs from "../components/editor/fileTabs";
import FileTree from "../components/editor/fileTree";

import MonacoEditor from "../components/editor/MonacoEditor";
import CodeEditor from "../components/editor/CodeEditor";
import CodeExecutionService from "../services/CodeExecutionService";
import CopilotService from "../services/CopilotService";

export default function Editor() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { videoId } = useParams();
  
  // Core State
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Load video from navigation state or videoId param
  useEffect(() => {
    const loadVideo = async () => {
      if (location.state?.video) {
        // Video passed from Dashboard
        setCurrentVideo(location.state.video);
      } else if (videoId) {
        // Load video by ID
        setIsLoading(true);
        try {
          const url = `https://www.youtube.com/watch?v=${videoId}`;
          const result = await DashboardService.loadVideo(url);
          setCurrentVideo(result.video);
        } catch (err) {
          setError(err.message || "Failed to load video");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadVideo();
  }, [location.state, videoId]);
  const [editorMode, setEditorMode] = useState('code'); // 'code' or 'drawing'
  const [currentVideoProgress, setCurrentVideoProgress] = useState(0);
  const lastProgressSyncRef = useRef({ ts: 0, pct: 0 });
  const [showEditorSettings, setShowEditorSettings] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320); // Resizable sidebar width
  
  // Editor state
  const [currentFile, setCurrentFile] = useState(null);
  const [fileContent, setFileContent] = useState('// Welcome to Pluto Editor!\n// Click on a file to start editing\n');
  const [editorSettings, setEditorSettings] = useState({
    fontFamily: 'Space Mono',
    theme: 'vs-dark',
    language: 'javascript',
    fontSize: 14
  });
  
  // File structure state
  const [files, setFiles] = useState({
    'src': {
      type: 'folder',
      children: {
        'index.js': { 
          type: 'file', 
          language: 'javascript',
          content: `// index.js\nconsole.log("Hello from Pluto!");\n\nfunction greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet("World"));`
        },
        'App.js': { 
          type: 'file', 
          language: 'javascript',
          content: '// App.js\nimport React from "react";\n\nfunction App() {\n  return <div>Hello React!</div>;\n}\n\nexport default App;'
        }
      }
    },
    'package.json': { 
      type: 'file', 
      language: 'json',
      content: '{\n  "name": "my-project",\n  "version": "1.0.0",\n  "main": "index.js"\n}'
    }
  });
  
  // Resizable panels (60% video, 40% editor by default)
  const {
    leftWidth,
    isResizing,
    containerRef,
    startResizing,
    resetWidth,
    getLeftPanelStyle,
    getRightPanelStyle
  } = useResizablePanels(60, 30, 70);

  // Load video on mount
  useEffect(() => {
    const loadVideo = async () => {
      // Check if video data is passed via location state
      const st = location.state;
      let videoUrl = null;
      
      if (st && (st.youtubeUrl || st.videoId)) {
        videoUrl = st.youtubeUrl || `https://www.youtube.com/watch?v=${st.videoId}`;
      } else if (videoId) {
        videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      }
      
      if (videoUrl) {
        setIsLoading(true);
        try {
          const result = await DashboardService.loadVideo(videoUrl);
          setCurrentVideo(result.video);
        } catch (e) {
          setError(e.message || 'Failed to load video');
        } finally {
          setIsLoading(false);
        }
      } else {
        setError('No video specified');
      }
    };

    loadVideo();
  }, [videoId, location.state]);

  // Event Handlers
  const handleLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  // YouTube Player event handlers
  const handleTimeUpdate = useCallback(async (currentTime, duration) => {
    if (currentVideo?.videoId) {
      // Update live progress for stats
      const progress = duration > 0 ? Math.round((currentTime / duration) * 100) : 0;
      setCurrentVideoProgress(progress);
      
      // Throttle server sync: send every 5s or when progress jumps by >= 5%
      const now = Date.now();
      const lastSync = lastProgressSyncRef.current;
      const timeDiff = now - lastSync.ts;
      const progressDiff = Math.abs(progress - lastSync.pct);
      
      if (timeDiff >= 5000 || progressDiff >= 5) {
        try {
          await DashboardService.updateWatchProgress(currentVideo.videoId, Math.floor(currentTime), Math.floor(duration));
          lastProgressSyncRef.current = { ts: now, pct: progress };
        } catch (error) {
          console.error('Error updating watch progress:', error);
        }
      }
    }
  }, [currentVideo]);

  const handleVideoEnd = useCallback(async () => {
    if (currentVideo?.videoId) {
      try {
        await DashboardService.updateWatchProgress(
          currentVideo.videoId, 
          currentVideo.totalSeconds || 0, 
          currentVideo.totalSeconds || 0
        );
      } catch (error) {
        console.error('Error updating video completion:', error);
      }
    }
  }, [currentVideo]);

  // Editor Handlers
  const handleFileClick = useCallback((filePath, fileData) => {
    console.log('File clicked:', filePath, fileData);
    setCurrentFile(filePath);
    setFileContent(fileData.content || `// ${filePath}\n// Start coding here...`);
    setEditorSettings(prev => ({ ...prev, language: fileData.language || 'javascript' }));
  }, []);

  const handleCreateFile = useCallback((fileName, parentFolder = null) => {
    console.log('Creating file:', fileName, 'in folder:', parentFolder);
    const newFile = {
      type: 'file',
      language: fileName.endsWith('.js') || fileName.endsWith('.jsx') ? 'javascript' : 
                fileName.endsWith('.py') ? 'python' :
                fileName.endsWith('.css') ? 'css' :
                fileName.endsWith('.html') ? 'html' :
                fileName.endsWith('.json') ? 'json' :
                fileName.endsWith('.md') ? 'markdown' : 'javascript',
      content: `// ${fileName}\n// New file created in Pluto Editor\n\n`
    };
    
    if (!parentFolder) {
      // Create at root
      setFiles(prev => ({ ...prev, [fileName]: newFile }));
    } else {
      // Create inside folder
      setFiles(prev => {
        const newFiles = JSON.parse(JSON.stringify(prev)); // Deep clone
        const pathParts = parentFolder.split('/');
        let current = newFiles;
        
        for (const part of pathParts) {
          if (current[part] && current[part].type === 'folder') {
            if (!current[part].children) current[part].children = {};
            current = current[part].children;
          }
        }
        
        current[fileName] = newFile;
        return newFiles;
      });
    }
  }, []);

  const handleCreateFolder = useCallback((folderName, parentFolder = null) => {
    console.log('Creating folder:', folderName, 'in folder:', parentFolder);
    const newFolder = { type: 'folder', children: {} };
    
    if (!parentFolder) {
      // Create at root
      setFiles(prev => ({ ...prev, [folderName]: newFolder }));
    } else {
      // Create inside folder
      setFiles(prev => {
        const newFiles = JSON.parse(JSON.stringify(prev)); // Deep clone
        const pathParts = parentFolder.split('/');
        let current = newFiles;
        
        for (const part of pathParts) {
          if (current[part] && current[part].type === 'folder') {
            if (!current[part].children) current[part].children = {};
            current = current[part].children;
          }
        }
        
        current[folderName] = newFolder;
        return newFiles;
      });
    }
  }, []);

  const handleOpenFiles = useCallback((fileList) => {
    console.log('Opening files:', fileList);
    fileList.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const fileName = file.name;
        const newFile = {
          type: 'file',
          language: fileName.endsWith('.js') || fileName.endsWith('.jsx') ? 'javascript' : 
                    fileName.endsWith('.py') ? 'python' :
                    fileName.endsWith('.css') ? 'css' :
                    fileName.endsWith('.html') ? 'html' :
                    fileName.endsWith('.json') ? 'json' : 'javascript',
          content: content
        };
        setFiles(prev => ({ ...prev, [fileName]: newFile }));
        
        // Open the first file
        if (fileList[0] === file) {
          setCurrentFile(fileName);
          setFileContent(content);
        }
      };
      reader.readAsText(file);
    });
  }, []);

  const handleDownloadCode = useCallback(() => {
    console.log('Downloading code as ZIP...');
    // Create a simple text representation for now
    let allCode = '';
    
    const traverseFiles = (structure, path = '') => {
      Object.entries(structure).forEach(([name, item]) => {
        const fullPath = path ? `${path}/${name}` : name;
        if (item.type === 'file') {
          allCode += `\n\n// ===== ${fullPath} =====\n\n`;
          allCode += item.content || '';
        } else if (item.type === 'folder' && item.children) {
          traverseFiles(item.children, fullPath);
        }
      });
    };
    
    traverseFiles(files);
    
    // Create and download
    const blob = new Blob([allCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pluto-code-export.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('Code downloaded! For ZIP export, install JSZip library.');
  }, [files]);

  const handleRunCode = useCallback(async () => {
    console.log('Running code in', editorSettings.language);
    try {
      const result = await CodeExecutionService.execute(fileContent, editorSettings.language);
      
      if (result.success) {
        return result.output + (result.executionTime ? `\n\n⏱️ Execution time: ${result.executionTime}s` : '');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }, [fileContent, editorSettings.language]);

  const handleSettingsChange = useCallback(async (newSettings) => {
    console.log('Settings changed:', newSettings);
    
    // Check if language changed
    if (newSettings.language !== editorSettings.language && fileContent && fileContent.trim().length > 10) {
      const shouldConvert = window.confirm(
        `Convert code from ${editorSettings.language} to ${newSettings.language}?`
      );
      
      if (shouldConvert) {
        try {
          const converted = await CodeExecutionService.convertCode(
            fileContent,
            editorSettings.language,
            newSettings.language
          );
          setFileContent(converted);
        } catch (error) {
          console.error('Conversion error:', error);
        }
      }
    }
    
    setEditorSettings(newSettings);
  }, [editorSettings.language, fileContent]);

  const handleDeleteFile = useCallback((filePath) => {
    if (!window.confirm(`Delete ${filePath}?`)) return;
    
    console.log('Deleting file:', filePath);
    setFiles(prev => {
      const newFiles = JSON.parse(JSON.stringify(prev));
      const pathParts = filePath.split('/');
      const fileName = pathParts.pop();
      
      if (pathParts.length === 0) {
        delete newFiles[fileName];
      } else {
        let current = newFiles;
        for (const part of pathParts) {
          if (current[part] && current[part].children) {
            current = current[part].children;
          }
        }
        delete current[fileName];
      }
      
      return newFiles;
    });
    
    if (currentFile === filePath) {
      setCurrentFile(null);
      setFileContent('// File deleted\n');
    }
  }, [currentFile]);

  const handleRenameFile = useCallback((oldPath, newName) => {
    if (!newName || !newName.trim()) return;
    
    console.log('Renaming:', oldPath, 'to', newName);
    
    setFiles(prev => {
      const newFiles = JSON.parse(JSON.stringify(prev));
      const pathParts = oldPath.split('/');
      const oldName = pathParts.pop();
      
      // Navigate to parent
      let current = newFiles;
      if (pathParts.length > 0) {
        for (const part of pathParts) {
          if (current[part] && current[part].children) {
            current = current[part].children;
          }
        }
      }
      
      // Rename
      if (current[oldName]) {
        current[newName] = current[oldName];
        delete current[oldName];
      }
      
      return newFiles;
    });
    
    // Update current file if renamed
    if (currentFile === oldPath) {
      const newPath = pathParts.length > 0 
        ? `${pathParts.join('/')}/${newName}` 
        : newName;
      setCurrentFile(newPath);
    }
  }, [currentFile]);

  const handleCopilotRequest = useCallback(async (type, data) => {
    console.log('Copilot request:', type, data);
    
    switch (type) {
      case 'suggestions':
        return await CopilotService.getSuggestions(fileContent, editorSettings.language);
      case 'analyze':
        return await CopilotService.analyzeCode(fileContent, editorSettings.language);
      case 'explain':
        return await CopilotService.explainCode(fileContent, editorSettings.language);
      case 'fix':
        return await CopilotService.fixBugs(fileContent, editorSettings.language, data?.error);
      case 'generate':
        return await CopilotService.generateCode(data?.description, editorSettings.language);
      default:
        return { success: false, error: 'Unknown request type' };
    }
  }, [fileContent, editorSettings.language]);

  if (isLoading) {
    return (
      <PageLayout 
        onLogout={handleLogout}
        className="min-h-screen relative overflow-hidden"
        style={{background: 'linear-gradient(135deg, #E8F4FB 0%, #FFF0F1 40%, #E8FBF7 100%)'}}
        onLogoClick={() => navigate('/dashboard')}
        showNavigation={true}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading video...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout 
        onLogout={handleLogout}
        className="min-h-screen relative overflow-hidden"
        style={{background: 'linear-gradient(135deg, #E8F4FB 0%, #FFF0F1 40%, #E8FBF7 100%)'}}
        onLogoClick={() => navigate('/dashboard')}
        showNavigation={true}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!currentVideo) {
    return (
      <PageLayout 
        onLogout={handleLogout}
        className="min-h-screen relative overflow-hidden"
        style={{background: 'linear-gradient(135deg, #E8F4FB 0%, #FFF0F1 40%, #E8FBF7 100%)'}}
        onLogoClick={() => navigate('/dashboard')}
        showNavigation={true}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No video loaded</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Split view with video and editor
  return (
    <PageLayout
      onLogout={handleLogout}
      className="min-h-screen relative overflow-hidden"
      style={{background: 'linear-gradient(135deg, #E8F4FB 0%, #FFF0F1 40%, #E8FBF7 100%)'}}
      onLogoClick={() => navigate('/dashboard')}
      showNavigation={true}
      leftPanel={
        <VideoPlayerPanel
          video={currentVideo}
          onClose={() => navigate('/dashboard')}
          onTimeUpdate={handleTimeUpdate}
          onVideoEnd={handleVideoEnd}
          className="h-full"
        />
      }
      rightPanel={
        <div className="h-full bg-gray-800 flex overflow-hidden">
          {/* VS Code-like Sidebar */}
          <div style={{ 
            width: `${sidebarWidth}px`, 
            minWidth: `${sidebarWidth}px`,
            maxWidth: `${sidebarWidth}px`,
            flexShrink: 0,
            height: '100%',
            overflow: 'hidden'
          }}>
            <EditorSidebar 
              onModeChange={setEditorMode} 
              currentMode={editorMode}
              onFileClick={handleFileClick}
              onRunCode={handleRunCode}
              onSettingsChange={handleSettingsChange}
              files={files}
              onCreateFile={handleCreateFile}
              onCreateFolder={handleCreateFolder}
              onOpenFiles={handleOpenFiles}
              onDownloadCode={handleDownloadCode}
              onDeleteFile={handleDeleteFile}
              onRenameFile={handleRenameFile}
              onCopilotRequest={handleCopilotRequest}
              currentSettings={editorSettings}
            />
          </div>
          
          {/* Resizable Divider */}
          <ResizableDivider
            onResize={setSidebarWidth}
            minWidth={200}
            maxWidth={600}
            defaultWidth={320}
            orientation="vertical"
          />
          
          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col bg-gray-900" style={{ minWidth: 0 }}>
            {editorMode === 'code' ? (
              <div className="flex flex-col h-full">
                {/* Editor Header */}
                <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center px-4">
                  <span className="text-sm text-gray-300">
                    {currentFile || 'Untitled'}
                  </span>
                </div>
                
                {/* Code Editor */}
                <div className="flex-1">
                  <CodeEditor
                    value={fileContent}
                    onChange={setFileContent}
                    language={editorSettings.language}
                    theme={editorSettings.theme}
                    fontSize={editorSettings.fontSize}
                    fontFamily={editorSettings.fontFamily}
                  />
                </div>
              </div>
            ) : (
              <DrawingCanvas />
            )}
          </div>
        </div>
      }
      containerRef={containerRef}
      isResizing={isResizing}
      onStartResizing={startResizing}
      onReset={resetWidth}
      leftPanelStyle={getLeftPanelStyle()}
      rightPanelStyle={getRightPanelStyle()}
    />
  );
}
