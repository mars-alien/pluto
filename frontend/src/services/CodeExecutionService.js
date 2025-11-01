// Code Execution Service for Multiple Languages
// Uses Judge0 API for C++, Java, Python execution

class CodeExecutionService {
  constructor() {
    // Judge0 API - Free tier available
    this.JUDGE0_API = 'https://judge0-ce.p.rapidapi.com';
    
    // Read API key from environment
    this.RAPIDAPI_KEY = import.meta.env.VITE_JUDGE0_API_KEY || null;
    
    // Language IDs for Judge0
    this.languageIds = {
      javascript: 63,  // Node.js
      python: 71,      // Python 3
      java: 62,        // Java
      cpp: 54,         // C++ (GCC)
      c: 50,           // C (GCC)
    };
    
    console.log('⚙️ Code Execution Service initialized:', {
      configured: !!this.RAPIDAPI_KEY
    });
  }

  // Get API key
  getApiKey() {
    return this.RAPIDAPI_KEY;
  }

  // Execute code locally (JavaScript only)
  async executeJavaScript(code) {
    try {
      const output = [];
      const customConsole = {
        log: (...args) => output.push(args.join(' ')),
        error: (...args) => output.push('Error: ' + args.join(' ')),
        warn: (...args) => output.push('Warning: ' + args.join(' '))
      };

      const func = new Function('console', code);
      func(customConsole);
      
      return {
        success: true,
        output: output.join('\n') || '(no output)',
        executionTime: 0
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error.message
      };
    }
  }

  // Execute code remotely using Judge0 API
  async executeRemote(code, language) {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      return {
        success: false,
        error: 'No API key set. Please configure Judge0 API key in settings.'
      };
    }

    const languageId = this.languageIds[language];
    if (!languageId) {
      return {
        success: false,
        error: `Language ${language} not supported for remote execution`
      };
    }

    try {
      // Submit code for execution
      const submitResponse = await fetch(`${this.JUDGE0_API}/submissions?base64_encoded=false&wait=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        body: JSON.stringify({
          source_code: code,
          language_id: languageId,
          stdin: ''
        })
      });

      const result = await submitResponse.json();

      if (result.status.id === 3) { // Success
        return {
          success: true,
          output: result.stdout || '(no output)',
          executionTime: result.time
        };
      } else if (result.status.id === 6) { // Compilation Error
        return {
          success: false,
          error: 'Compilation Error:\n' + (result.compile_output || result.stderr)
        };
      } else {
        return {
          success: false,
          error: result.stderr || result.message || 'Execution failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'API Error: ' + error.message
      };
    }
  }

  // Main execute method
  async execute(code, language) {
    if (language === 'javascript') {
      // Execute JS locally for speed
      return this.executeJavaScript(code);
    } else {
      // Execute other languages remotely
      return this.executeRemote(code, language);
    }
  }

  // Convert code between languages using AI (simulated)
  async convertCode(code, fromLang, toLang) {
    // This is a simple rule-based converter for demo
    // In production, use OpenAI API or similar
    
    const conversions = {
      'javascript_to_python': this.jsToPython,
      'python_to_javascript': this.pythonToJs,
      'javascript_to_java': this.jsToJava,
      'java_to_javascript': this.javaToJs,
      'cpp_to_python': this.cppToPython,
      'python_to_cpp': this.pythonToCpp,
    };

    const key = `${fromLang}_to_${toLang}`;
    const converter = conversions[key];

    if (converter) {
      return converter(code);
    } else {
      return `// Converted from ${fromLang} to ${toLang}\n// Manual conversion needed\n\n${code}`;
    }
  }

  // Simple conversion helpers
  jsToPython(code) {
    let converted = code;
    
    // Convert console.log to print
    converted = converted.replace(/console\.log\((.*?)\)/g, 'print($1)');
    
    // Convert const/let to (remove)
    converted = converted.replace(/const |let |var /g, '');
    
    // Convert function to def
    converted = converted.replace(/function\s+(\w+)\s*\((.*?)\)/g, 'def $1($2):');
    
    // Convert { } to proper indentation (simplified)
    converted = converted.replace(/\{/g, '');
    converted = converted.replace(/\}/g, '');
    
    // Add comment
    converted = `# Converted from JavaScript to Python\n# May need manual adjustments\n\n${converted}`;
    
    return converted;
  }

  pythonToJs(code) {
    let converted = code;
    
    // Convert print to console.log
    converted = converted.replace(/print\((.*?)\)/g, 'console.log($1)');
    
    // Convert def to function
    converted = converted.replace(/def\s+(\w+)\s*\((.*?)\):/g, 'function $1($2) {');
    
    // Add closing braces (simplified)
    converted = converted.replace(/$/gm, '');
    
    // Add comment
    converted = `// Converted from Python to JavaScript\n// May need manual adjustments\n\n${converted}`;
    
    return converted;
  }

  jsToJava(code) {
    return `// Converted from JavaScript to Java
// Manual conversion needed

public class Main {
    public static void main(String[] args) {
        // Original code:
        /*
${code}
        */
        System.out.println("Please convert manually");
    }
}`;
  }

  javaToJs(code) {
    return `// Converted from Java to JavaScript
// Manual conversion needed

${code}`;
  }

  cppToPython(code) {
    let converted = code;
    converted = converted.replace(/std::cout\s*<<\s*(.*?)\s*<</g, 'print($1)');
    converted = converted.replace(/std::endl/g, '');
    return `# Converted from C++ to Python\n\n${converted}`;
  }

  pythonToCpp(code) {
    let converted = code;
    converted = converted.replace(/print\((.*?)\)/g, 'std::cout << $1 << std::endl;');
    return `// Converted from Python to C++\n#include <iostream>\nusing namespace std;\n\n${converted}`;
  }
}

export default new CodeExecutionService();
