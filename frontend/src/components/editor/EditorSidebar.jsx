import React, { useState } from 'react';
import { 
  FileText, 
  Bot, 
  Play, 
  Settings, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown,
  File,
  Folder,
  Download,
  Palette,
  Code2,
  Plus,
  FolderPlus,
  X,
  Trash2,
  Sparkles,
  Lightbulb,
  Bug,
  Wand2,
  Edit2,
  Brain,
  Zap,
  Send
} from 'lucide-react';

const EditorSidebar = ({ 
  onModeChange, 
  currentMode = 'code',
  onFileClick,
  onRunCode,
  onSettingsChange,
  files = {},
  onCreateFile,
  onCreateFolder,
  onOpenFiles,
  onDownloadCode,
  onDeleteFile,
  onRenameFile,
  onCopilotRequest,
  currentSettings = {
    fontFamily: "'Space Mono', monospace",
    theme: 'vs-dark',
    language: 'javascript',
    fontSize: 14
  }
}) => {
  const [activePanel, setActivePanel] = useState('files');
  const [expandedFolders, setExpandedFolders] = useState(new Set(['src']));
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [renamingFile, setRenamingFile] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  
  const [runOutput, setRunOutput] = useState([
    { type: 'info', text: '$ Pluto Multi-Language Code Executor' },
    { type: 'info', text: '$ Supports: JavaScript, Python, C++, Java, C' },
    { type: 'success', text: '$ Ready to run your code...' }
  ]);
  const [localSettings, setLocalSettings] = useState(currentSettings);
  
  // Copilot state
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState([
    { type: 'assistant', content: 'Hi! I\'m your AI coding assistant. Ask me anything about your code!' }
  ]);
  const [copilotInput, setCopilotInput] = useState('');

  const sidebarItems = [
    { id: 'files', icon: FileText, label: 'Files', shortcut: 'Ctrl+Shift+E' },
    { id: 'copilot', icon: Zap, label: 'AI Copilot', shortcut: 'Ctrl+Shift+A' },
    { id: 'run', icon: Play, label: 'Run & Debug', shortcut: 'Ctrl+Shift+D' },
    { id: 'settings', icon: Settings, label: 'Settings', shortcut: 'Ctrl+,' },
    { id: 'drawing', icon: Palette, label: 'Drawing Mode', shortcut: 'Ctrl+Shift+P' }
  ];

  const toggleFolder = (folderPath) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const handleCreateFile = () => {
    if (newFileName.trim() && onCreateFile) {
      onCreateFile(newFileName.trim(), selectedFolder);
      setNewFileName('');
      setShowNewFileInput(false);
      setSelectedFolder(null);
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim() && onCreateFolder) {
      onCreateFolder(newFolderName.trim(), selectedFolder);
      setNewFolderName('');
      setShowNewFolderInput(false);
      setSelectedFolder(null);
    }
  };

  const handleRename = (filePath) => {
    if (renameValue.trim() && onRenameFile) {
      onRenameFile(filePath, renameValue.trim());
      setRenamingFile(null);
      setRenameValue('');
    }
  };

  const handleRunCode = async () => {
    const timestamp = new Date().toLocaleTimeString();
    setRunOutput([
      { type: 'info', text: `[${timestamp}] Running ${localSettings.language}...` }
    ]);
    
    if (onRunCode) {
      try {
        const result = await onRunCode();
        setRunOutput(prev => [
          ...prev,
          { type: 'success', text: `[${timestamp}] ✓ Execution completed!` },
          { type: 'output', text: result || '(no output)' }
        ]);
      } catch (error) {
        setRunOutput(prev => [
          ...prev,
          { type: 'error', text: `[${timestamp}] ✗ Error: ${error.message}` }
        ]);
      }
    }
  };

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  const handleOpenFiles = (e) => {
    const fileList = Array.from(e.target.files);
    if (onOpenFiles) {
      onOpenFiles(fileList);
    }
  };

  const handleCopilotSend = async () => {
    if (!copilotInput.trim() || !onCopilotRequest) return;
    
    const userMessage = copilotInput.trim();
    setCopilotInput('');
    
    // Add user message to chat
    setCopilotMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    
    setCopilotLoading(true);
    try {
      // Check if it's a general question (not code-related)
      const generalQuestions = [
        'tell me about yourself', 'who are you', 'what are you', 'introduce yourself',
        'what can you do', 'how can you help', 'what is your purpose'
      ];
      
      // Check for simple greetings only (not code-related questions)
      const isSimpleGreeting = userMessage.toLowerCase().trim() === 'hello' || 
                              userMessage.toLowerCase().trim() === 'hi';
      
      const isGeneralQuestion = generalQuestions.some(q => 
        userMessage.toLowerCase().includes(q)
      ) || isSimpleGreeting;
      
      if (isGeneralQuestion) {
        // Handle general questions directly
        let responseContent = '';
        
        if (userMessage.toLowerCase().includes('tell me about yourself') || 
            userMessage.toLowerCase().includes('who are you') ||
            userMessage.toLowerCase().includes('introduce yourself')) {
          responseContent = `Hi! I'm your AI coding assistant powered by Groq's Llama 3.1 8B model. 

**What I can do:**
• **Code Analysis** - Review your code for quality, bugs, and improvements
• **Code Suggestions** - Provide recommendations to make your code better
• **Code Explanation** - Explain what your code does in simple terms
• **Bug Fixing** - Help identify and fix issues in your code
• **Code Generation** - Create new code based on your requirements
• **Best Practices** - Share coding best practices and patterns

**How to use me:**
• Type your questions naturally - I understand context
• Use the quick action buttons for common tasks
• I can see your current code in the editor
• Ask me anything about programming, algorithms, or debugging

I'm here to help you code faster and better! What would you like to work on?`;
        } else if (userMessage.toLowerCase().includes('what can you do') || 
                   userMessage.toLowerCase().includes('how can you help')) {
          responseContent = `I'm your coding companion! Here's how I can help:

**🔍 Code Analysis**
• Review code quality and performance
• Identify potential bugs and issues
• Suggest optimizations

**💡 Code Suggestions**
• Recommend improvements
• Share best practices
• Optimize algorithms

**📚 Code Explanation**
• Explain complex code in simple terms
• Break down algorithms step by step
• Clarify programming concepts

**🛠️ Bug Fixing**
• Debug errors and exceptions
• Fix logical issues
• Resolve syntax problems

**⚡ Code Generation**
• Create functions and classes
• Generate boilerplate code
• Build complete solutions

Just ask me anything or use the quick action buttons!`;
        } else {
          responseContent = `Hello! I'm your AI coding assistant. I'm here to help you with:

• Code analysis and review
• Suggestions for improvements
• Explaining code functionality
• Debugging and fixing issues
• Generating new code

What would you like to work on today?`;
        }
        
        setCopilotMessages(prev => [...prev, { type: 'assistant', content: responseContent }]);
        setCopilotLoading(false);
        return;
      }
      
      // Determine action type based on user input for code-related questions
      let action = 'explain'; // Default to explain
      let data = {};
      
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('suggest') || lowerMessage.includes('improve') || lowerMessage.includes('better')) {
        action = 'suggestions';
      } else if (lowerMessage.includes('analyze') || lowerMessage.includes('quality') || lowerMessage.includes('review')) {
        action = 'analyze';
      } else if (lowerMessage.includes('fix') || lowerMessage.includes('bug') || lowerMessage.includes('error')) {
        action = 'fix';
        data.error = userMessage;
      } else if (lowerMessage.includes('generate') || lowerMessage.includes('create') || lowerMessage.includes('write')) {
        action = 'generate';
        data.description = userMessage;
      } else if (lowerMessage.includes('explain') || lowerMessage.includes('what does') || lowerMessage.includes('how does')) {
        action = 'explain';
      }
      
      const result = await onCopilotRequest(action, data);
      
      if (result.success) {
        let responseContent = '';
        
        switch (action) {
          case 'suggestions':
            responseContent = result.suggestions && result.suggestions.length > 0 
              ? result.suggestions.join('\n• ') 
              : 'No specific suggestions found for this code.';
            responseContent = '**Code Suggestions**\n\n• ' + responseContent;
            break;
          case 'analyze':
            const analysis = result.analysis || { score: 0, issues: [] };
            responseContent = `**Code Analysis**\n\nQuality Score: ${analysis.score}/100\n\n`;
            if (analysis.issues && analysis.issues.length > 0) {
              responseContent += `**Issues Found**\n• ${analysis.issues.join('\n• ')}`;
            } else {
              responseContent += 'No major issues found in your code!';
            }
            break;
          case 'fix':
            responseContent = result.explanation || (result.fixedCode 
              ? `Here's the corrected code:\n\n${result.fixedCode}` 
              : 'No specific fixes needed for this code.');
            break;
          case 'generate':
            responseContent = result.code 
              ? `Here's the generated code:\n\n${result.code}` 
              : 'Unable to generate code for this request.';
            break;
          default:
            responseContent = result.explanation || result.code || 'I\'ve processed your request successfully.';
        }
        
        setCopilotMessages(prev => [...prev, { type: 'assistant', content: responseContent }]);
      } else {
        setCopilotMessages(prev => [...prev, { 
          type: 'error', 
          content: result.error || 'Sorry, I encountered an error. Make sure your Groq API key is set in the .env file.' 
        }]);
      }
    } catch (error) {
      console.error('Copilot error:', error);
      setCopilotMessages(prev => [...prev, { 
        type: 'error', 
        content: 'Error: ' + error.message 
      }]);
    } finally {
      setCopilotLoading(false);
    }
  };

  const renderFileTree = (structure, path = '', level = 0) => {
    if (!structure || typeof structure !== 'object') return null;
    
    return Object.entries(structure).map(([name, item]) => {
      const currentPath = path ? `${path}/${name}` : name;
      const isExpanded = expandedFolders.has(currentPath);
      const isRenaming = renamingFile === currentPath;
      
      if (item.type === 'folder') {
        return (
          <div key={currentPath}>
            <div
              className="group flex items-center px-2 py-1 hover:bg-gray-700 cursor-pointer text-sm text-gray-300"
              style={{ paddingLeft: `${8 + level * 16}px` }}
            >
              {isRenaming ? (
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleRename(currentPath)}
                  onBlur={() => setRenamingFile(null)}
                  className="flex-1 px-2 py-0.5 bg-gray-800 border border-blue-500 rounded text-sm text-white"
                  autoFocus
                />
              ) : (
                <>
                  <div
                    onClick={() => toggleFolder(currentPath)}
                    className="flex items-center flex-1"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 mr-1" />
                    ) : (
                      <ChevronRight className="w-4 h-4 mr-1" />
                    )}
                    <Folder className="w-4 h-4 mr-2 text-blue-400" />
                    <span>{name}</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                    <button
                      onClick={() => {
                        setSelectedFolder(currentPath);
                        setShowNewFileInput(true);
                      }}
                      className="p-0.5 hover:bg-gray-600 rounded"
                      title="New File"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFolder(currentPath);
                        setShowNewFolderInput(true);
                      }}
                      className="p-0.5 hover:bg-gray-600 rounded"
                      title="New Folder"
                    >
                      <FolderPlus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        setRenamingFile(currentPath);
                        setRenameValue(name);
                      }}
                      className="p-0.5 hover:bg-blue-600 rounded text-blue-400"
                      title="Rename"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteFile && onDeleteFile(currentPath)}
                      className="p-0.5 hover:bg-red-600 rounded text-red-400"
                      title="Delete Folder"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </>
              )}
            </div>
            {isExpanded && item.children && (
              <div>
                {renderFileTree(item.children, currentPath, level + 1)}
              </div>
            )}
          </div>
        );
      } else {
        const getFileIcon = (language) => {
          switch (language) {
            case 'javascript': return '🟨';
            case 'python': return '🐍';
            case 'cpp': case 'c': return '⚙️';
            case 'java': return '☕';
            case 'css': return '🎨';
            case 'json': return '📋';
            case 'markdown': return '📝';
            case 'html': return '🌐';
            default: return '📄';
          }
        };

        return (
          <div
            key={currentPath}
            className="group flex items-center px-2 py-1 hover:bg-gray-700 cursor-pointer text-sm text-gray-300"
            style={{ paddingLeft: `${24 + level * 16}px` }}
          >
            {isRenaming ? (
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleRename(currentPath)}
                onBlur={() => setRenamingFile(null)}
                className="flex-1 px-2 py-0.5 bg-gray-800 border border-blue-500 rounded text-sm text-white"
                autoFocus
              />
            ) : (
              <>
                <div
                  onClick={() => onFileClick && onFileClick(currentPath, item)}
                  className="flex items-center flex-1"
                >
                  <span className="mr-2 text-xs">{getFileIcon(item.language)}</span>
                  <span>{name}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                  <button
                    onClick={() => {
                      setRenamingFile(currentPath);
                      setRenameValue(name);
                    }}
                    className="p-0.5 hover:bg-blue-600 rounded text-blue-400"
                    title="Rename File"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDeleteFile && onDeleteFile(currentPath)}
                    className="p-0.5 hover:bg-red-600 rounded text-red-400"
                    title="Delete File"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </>
            )}
          </div>
        );
      }
    });
  };

  const renderPanel = () => {
    switch (activePanel) {
      case 'files':
        return (
          <div className="flex-1 overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-gray-700">
              <h3 className="text-sm font-medium text-gray-200 uppercase tracking-wide">Files</h3>
              <div className="flex space-x-1">
                <button
                  onClick={() => {
                    setSelectedFolder(null);
                    setShowNewFileInput(true);
                  }}
                  className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200"
                  title="New File"
                >
                  <File className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedFolder(null);
                    setShowNewFolderInput(true);
                  }}
                  className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200"
                  title="New Folder"
                >
                  <FolderPlus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {showNewFileInput && (
              <div className="px-3 py-2 bg-gray-700 border-b border-gray-600">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateFile()}
                    placeholder={`filename.js ${selectedFolder ? `in ${selectedFolder}` : ''}`}
                    className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-white focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setShowNewFileInput(false);
                      setSelectedFolder(null);
                    }}
                    className="p-1 hover:bg-gray-600 rounded text-gray-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {selectedFolder && (
                  <p className="text-xs text-gray-400 mt-1">📁 {selectedFolder}</p>
                )}
              </div>
            )}

            {showNewFolderInput && (
              <div className="px-3 py-2 bg-gray-700 border-b border-gray-600">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                    placeholder={`foldername ${selectedFolder ? `in ${selectedFolder}` : ''}`}
                    className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-white focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setShowNewFolderInput(false);
                      setSelectedFolder(null);
                    }}
                    className="p-1 hover:bg-gray-600 rounded text-gray-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {selectedFolder && (
                  <p className="text-xs text-gray-400 mt-1">📁 {selectedFolder}</p>
                )}
              </div>
            )}
            
            <div className="flex-1 py-2 overflow-y-auto">
              {renderFileTree(files)}
            </div>

            <div className="border-t border-gray-700 bg-gray-800">
              <button 
                onClick={() => document.getElementById('file-upload')?.click()}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Open File/Folder
              </button>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleOpenFiles}
              />
              <button 
                onClick={() => onDownloadCode && onDownloadCode()}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Code
              </button>
            </div>
          </div>
        );

      case 'copilot':
        return (
          <div className="flex-1 flex flex-col h-full">
            {/* Header with New Chat Button */}
            <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-100">AI Copilot</h3>
                  <p className="text-xs text-gray-400">Powered by Groq Llama 3.1</p>
                </div>
              </div>
              <button
                onClick={() => setCopilotMessages([
                  { type: 'assistant', content: 'Hi! I\'m your AI coding assistant. Ask me anything about your code!' }
                ])}
                className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
                title="New Chat"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* Chat Messages with Auto-Scroll */}
            <div 
              className="flex-1 overflow-y-auto p-3 space-y-4 scroll-smooth"
              style={{ maxHeight: 'calc(100vh - 200px)' }}
              ref={(el) => {
                if (el && copilotMessages.length > 0) {
                  el.scrollTop = el.scrollHeight;
                }
              }}
            >
              {copilotMessages.map((message, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-green-600' 
                      : message.type === 'error'
                      ? 'bg-red-600'
                      : 'bg-gray-600'
                  }`}>
                    {message.type === 'user' ? (
                      <span className="text-white text-xs font-semibold">U</span>
                    ) : message.type === 'error' ? (
                      <X className="w-4 h-4 text-white" />
                    ) : (
                      <Zap className="w-4 h-4 text-white" />
                    )}
                  </div>
                  
                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                      message.type === 'user'
                        ? 'bg-green-600 text-white ml-8'
                        : message.type === 'error'
                        ? 'bg-red-900/50 text-red-200 border border-red-700/50'
                        : 'bg-gray-700/50 text-gray-100 border border-gray-600/30'
                    }`}>
                      <div className="whitespace-pre-wrap break-words">
                        {message.content.split('\n').map((line, lineIdx) => {
                          // Handle markdown-style formatting
                          if (line.startsWith('**') && line.endsWith('**')) {
                            return (
                              <div key={lineIdx} className="font-semibold text-green-300 mb-3 text-base">
                                {line.replace(/\*\*/g, '')}
                              </div>
                            );
                          }
                          if (line.startsWith('• ')) {
                            return (
                              <div key={lineIdx} className="ml-1 mb-2 flex items-start">
                                <span className="text-green-400 mr-2 mt-1">•</span>
                                <span className="flex-1">{line.substring(2)}</span>
                              </div>
                            );
                          }
                          if (line.startsWith('🔍') || line.startsWith('💡') || line.startsWith('📚') || line.startsWith('🛠️') || line.startsWith('⚡')) {
                            return (
                              <div key={lineIdx} className="font-medium text-blue-300 mb-2 mt-4">
                                {line}
                              </div>
                            );
                          }
                          if (line.startsWith('```')) {
                            return null; // Skip code block markers
                          }
                          return line ? (
                            <div key={lineIdx} className="mb-1 leading-relaxed">{line}</div>
                          ) : (
                            <div key={lineIdx} className="mb-3"></div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Timestamp */}
                    <div className="text-xs text-gray-500 mt-1 ml-1">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {copilotLoading && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-700/50 border border-gray-600/30 p-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-gray-400 text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input Area - Fixed at Bottom */}
            <div className="border-t border-gray-700 bg-gray-800 p-3">
              {/* Input Field */}
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={copilotInput}
                    onChange={(e) => setCopilotInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (!copilotLoading && copilotInput.trim()) {
                          handleCopilotSend();
                        }
                      }
                    }}
                    placeholder="Ask me anything about your code..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400 h-[44px]"
                    disabled={copilotLoading}
                  />
                </div>
                <button
                  onClick={handleCopilotSend}
                  disabled={copilotLoading || !copilotInput.trim()}
                  className="p-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-2xl transition-all duration-200 flex items-center justify-center min-w-[44px] h-[44px]"
                  title="Send message"
                >
                  {copilotLoading ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        );

      case 'run':
        return (
          <div className="flex-1 p-4 flex flex-col">
            <h3 className="text-sm font-medium text-gray-200 mb-4 uppercase tracking-wide">Run & Debug</h3>
            <div className="space-y-3 flex-1 flex flex-col">
              <button 
                onClick={handleRunCode}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                <Play className="w-4 h-4 mr-2" />
                Run Code
              </button>
              
              <div className="text-xs text-gray-400 bg-gray-700 rounded px-2 py-1">
                Language: <span className="text-white font-semibold">{localSettings.language}</span>
              </div>
              
              <div className="bg-gray-900 rounded-lg flex-1 flex flex-col overflow-hidden border border-gray-700">
                <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
                  <span className="text-xs font-semibold text-gray-300 uppercase">Console</span>
                  <button
                    onClick={() => setRunOutput([{ type: 'info', text: '$ Console cleared' }])}
                    className="text-xs text-gray-400 hover:text-gray-200"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 font-mono text-xs space-y-1">
                  {runOutput.map((line, idx) => (
                    <div
                      key={idx}
                      className={`whitespace-pre-wrap ${
                        line.type === 'error' ? 'text-red-400' :
                        line.type === 'success' ? 'text-green-400' :
                        line.type === 'output' ? 'text-white' :
                        'text-gray-400'
                      }`}
                    >
                      {line.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-200 mb-4 uppercase tracking-wide">Editor Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Font Family</label>
                <select 
                  value={localSettings.fontFamily}
                  onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="'Space Mono', monospace">Space Mono</option>
                  <option value="'Fira Code', monospace">Fira Code</option>
                  <option value="Monaco, monospace">Monaco</option>
                  <option value="Consolas, monospace">Consolas</option>
                  <option value="'Courier New', monospace">Courier New</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Theme</label>
                <select 
                  value={localSettings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="vs-dark">Dark (VS Code)</option>
                  <option value="vs-light">Light</option>
                  <option value="hc-black">High Contrast</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Language</label>
                <select 
                  value={localSettings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="c">C</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="json">JSON</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Font Size: <span className="font-semibold text-blue-400">{localSettings.fontSize || 14}px</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={localSettings.fontSize || 14}
                  onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10px</span>
                  <span>24px</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  const defaultSettings = {
                    fontFamily: "'Space Mono', monospace",
                    theme: 'vs-dark',
                    language: 'javascript',
                    fontSize: 14
                  };
                  setLocalSettings(defaultSettings);
                  onSettingsChange && onSettingsChange(defaultSettings);
                }}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Reset to Default
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-gray-800 w-full">
      {/* Icon Bar */}
      <div className="w-12 bg-gray-900 flex flex-col items-center py-2 space-y-1 flex-shrink-0">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isDrawingButton = item.id === 'drawing';
          
          if (isDrawingButton) {
            // Drawing mode button - special styling
            return (
              <button
                key={item.id}
                onClick={() => onModeChange && onModeChange(currentMode === 'code' ? 'drawing' : 'code')}
                className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                title={currentMode === 'code' ? 'Switch to Drawing Mode' : 'Switch to Code Mode'}
              >
                {currentMode === 'code' ? <Palette className="w-5 h-5" /> : <Code2 className="w-5 h-5" />}
              </button>
            );
          }
          
          return (
            <button
              key={item.id}
              onClick={() => setActivePanel(activePanel === item.id ? null : item.id)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                activePanel === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              }`}
              title={`${item.label} (${item.shortcut})`}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>

      {/* Panel Content */}
      {activePanel && activePanel !== 'drawing' && (
        <div className="flex-1 bg-gray-800 border-r border-gray-700 flex flex-col overflow-hidden">
          {renderPanel()}
        </div>
      )}
    </div>
  );
};

export default EditorSidebar;
