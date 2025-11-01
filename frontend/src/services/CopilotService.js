// AI Copilot Service - Groq Integration (Free & Fast)

class CopilotService {
  constructor() {
    // Read Groq API key from environment
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY;
    this.apiProvider = 'groq';
    this.apiEndpoint = 'https://api.groq.com/openai/v1/chat/completions';
    this.model = 'llama-3.1-8b-instant'; // Updated to supported model
    
    console.log('🤖 Copilot Service Status:', {
      provider: this.apiProvider,
      model: this.model,
      keyFound: !!this.apiKey,
      keyLength: this.apiKey ? this.apiKey.length : 0,
      keyPrefix: this.apiKey ? this.apiKey.substring(0, 15) + '...' : 'NOT FOUND'
    });
    
    if (!this.apiKey || this.apiKey.trim() === '') {
      console.error('❌ VITE_GROQ_API_KEY not found or empty!');
      console.error('📝 Make sure .env file is in frontend/ folder');
      console.error('📝 Restart dev server after adding key');
    } else if (!this.apiKey.startsWith('gsk_')) {
      console.error('⚠️  VITE_GROQ_API_KEY found but invalid format!');
      console.error('📝 Groq keys should start with "gsk_"');
    } else {
      console.log('✅ Groq API key loaded successfully!');
      console.log('🚀 Using fast Groq inference with Llama 3.1 8B Instant');
    }
  }

  // Check if configured
  isConfigured() {
    return !!this.apiKey && this.apiKey.length > 0 && this.apiKey.startsWith('gsk_');
  }

  // Get code suggestions
  async getSuggestions(code, language, cursorPosition) {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'Groq API key not found! Get free key from https://console.groq.com/ and add VITE_GROQ_API_KEY to frontend/.env file.'
      };
    }

    // Detect the actual framework/technology being used
    let actualTech = language;
    if (code.includes('import React') || code.includes('from "react"') || code.includes('jsx') || code.includes('<div>')) {
      actualTech = 'React';
    } else if (code.includes('import Vue') || code.includes('from "vue"')) {
      actualTech = 'Vue.js';
    } else if (code.includes('useState') || code.includes('useEffect')) {
      actualTech = 'React Hooks';
    }

    const prompt = `You are an expert ${actualTech} developer. Provide specific, actionable suggestions to improve this code.

Code to improve:
\`\`\`${language}
${code}
\`\`\`

Provide your suggestions in this exact format:

**Technology:** ${actualTech}

**Improvement Suggestions:**

1. **[Improvement Category]**
   • [Specific suggestion with explanation]
   • [Why this improvement matters]

2. **[Another Category]**
   • [Another specific suggestion]
   • [Benefit of this change]

3. **[Third Category]**
   • [Third suggestion]
   • [Impact of this improvement]

Focus on ${actualTech}-specific best practices, performance, readability, and maintainability.`;

    try {
      const response = await this.callGroq(prompt);
      return {
        success: true,
        suggestions: this.parseSuggestions(response)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Analyze code quality
  async analyzeCode(code, language) {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'Copilot not configured'
      };
    }

    // Detect the actual framework/technology being used
    let actualTech = language;
    if (code.includes('import React') || code.includes('from "react"') || code.includes('jsx') || code.includes('<div>')) {
      actualTech = 'React';
    } else if (code.includes('import Vue') || code.includes('from "vue"')) {
      actualTech = 'Vue.js';
    } else if (code.includes('useState') || code.includes('useEffect')) {
      actualTech = 'React Hooks';
    }

    const prompt = `You are an expert ${actualTech} developer. Analyze this code for quality, best practices, and potential improvements.

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Provide your analysis in this exact format:

**Code Quality Score:** [X]/100

**Technology:** ${actualTech}

**Strengths:**
• [What's good about this code]
• [Another positive aspect]

**Issues Found:**
• [Issue 1 with explanation]
• [Issue 2 with explanation]

**Improvement Suggestions:**
• [Specific improvement 1]
• [Specific improvement 2]

**Best Practices:**
• [Relevant best practice for this technology]
• [Another best practice]

Be specific to ${actualTech} conventions and best practices.`;

    try {
      const response = await this.callGroq(prompt);
      return {
        success: true,
        analysis: this.parseAnalysis(response)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Explain code
  async explainCode(code, language) {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'Copilot not configured'
      };
    }

    // Detect the actual framework/technology being used
    let actualTech = language;
    if (code.includes('import React') || code.includes('from "react"') || code.includes('jsx') || code.includes('<div>') || code.includes('export default')) {
      actualTech = 'React';
    } else if (code.includes('import Vue') || code.includes('from "vue"')) {
      actualTech = 'Vue.js';
    } else if (code.includes('import Angular') || code.includes('@Component')) {
      actualTech = 'Angular';
    } else if (code.includes('useState') || code.includes('useEffect')) {
      actualTech = 'React Hooks';
    }

    const prompt = `You are an expert coding instructor. Explain this ${actualTech} code in a clear, structured way like ChatGPT would.

Code to explain:
\`\`\`${language}
${code}
\`\`\`

Provide your explanation in this exact format:

**What This Code Does:**
[Brief overview in one sentence]

**Technology:** ${actualTech}

**Step-by-Step Breakdown:**
1. **[First concept]** - [Clear explanation]
2. **[Second concept]** - [Clear explanation]
3. **[Third concept]** - [Clear explanation]

**Key Concepts:**
• **[Concept 1]** - [Definition]
• **[Concept 2]** - [Definition]

**Output/Result:**
[What happens when this code runs]

Be precise, accurate, and educational. Focus on the specific technology being used.`;

    try {
      const response = await this.callGroq(prompt);
      return {
        success: true,
        explanation: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Fix bugs
  async fixBugs(code, language, errorMessage = '') {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'Copilot not configured'
      };
    }

    const prompt = `Fix the bugs in this ${language} code${errorMessage ? `: ${errorMessage}` : ''}:

\`\`\`${language}
${code}
\`\`\`

Provide the corrected code with explanation.`;

    try {
      const response = await this.callGroq(prompt);
      return {
        success: true,
        fixedCode: this.extractCode(response),
        explanation: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate code from description
  async generateCode(description, language) {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'Copilot not configured'
      };
    }

    const prompt = `Generate ${language} code for: ${description}

Provide clean, well-commented code.`;

    try {
      const response = await this.callGroq(prompt);
      return {
        success: true,
        code: this.extractCode(response)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Groq API call
  async callGroq(prompt) {
    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { 
            role: 'system', 
            content: 'You are ChatGPT, an expert AI coding assistant. Provide accurate, well-structured, and educational responses. Always identify the correct technology/framework being used. Format your responses clearly with proper headings, bullet points, and step-by-step explanations. Be precise and helpful like the real ChatGPT.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
        top_p: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Groq API Error:', error);
      throw new Error(error.error?.message || `Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  // Helper: Parse suggestions
  parseSuggestions(response) {
    const lines = response.split('\n').filter(line => line.trim());
    const suggestions = [];
    
    for (const line of lines) {
      if (line.match(/^\d+\./) || line.match(/^[-•*]/)) {
        suggestions.push(line.replace(/^[\d+\.\-•*]\s*/, '').trim());
      }
    }
    
    return suggestions.length > 0 ? suggestions : [response];
  }

  // Helper: Parse analysis
  parseAnalysis(response) {
    const scoreMatch = response.match(/(\d+)\/100|score.*?(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2]) : 75;
    
    return {
      score,
      issues: this.parseSuggestions(response).slice(0, 5),
      fullAnalysis: response
    };
  }

  // Helper: Extract code from response
  extractCode(response) {
    const codeBlockMatch = response.match(/```[\w]*\n([\s\S]*?)```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }
    return response.trim();
  }
}

export default new CopilotService();
