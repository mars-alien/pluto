# 🔑 API Setup Guide for Pluto Editor

## Overview
Your Pluto Editor now supports:
1. **Multi-language code execution** (C++, Java, Python, JavaScript)
2. **AI Copilot** for code suggestions and analysis

Here's how to set them up:

---

## 1. Code Execution API (Judge0)

### What is Judge0?
Judge0 is a robust, scalable, and open-source online code execution system. It can compile and execute source code in **60+ programming languages**.

### Getting API Key:

#### **Option A: RapidAPI (Recommended for Beginners)**
1. Go to https://rapidapi.com/judge0-official/api/judge0-ce
2. Click "Sign Up" (free account)
3. Click "Subscribe to Test"
4. Choose **Free Plan** (50 requests/day)
5. Copy your **X-RapidAPI-Key**

#### **Option B: Self-Hosted (Advanced)**
1. Install Docker
2. Run: `docker run -p 2358:2358 judge0/judge0`
3. Use local endpoint: `http://localhost:2358`

### Setup in Pluto:
```javascript
// In your code execution settings
CodeExecutionService.setApiKey('YOUR_RAPIDAPI_KEY_HERE');
```

### Pricing:
- **Free**: 50 requests/day
- **Basic**: $10/month - 1000 requests/day
- **Pro**: $50/month - 10,000 requests/day
- **Self-hosted**: Free, unlimited

---

## 2. AI Copilot API

You have **3 options** for AI Copilot:

### **Option A: OpenAI (ChatGPT) - Recommended**

#### Why OpenAI?
- Best code understanding
- Fast responses
- Well-documented
- Reliable

#### Getting API Key:
1. Go to https://platform.openai.com
2. Sign up / Log in
3. Click "API Keys" in menu
4. Click "Create new secret key"
5. Copy key (starts with `sk-...`)

#### Setup in Pluto:
```javascript
CopilotService.configure('openai', 'sk-YOUR_KEY_HERE');
```

#### Pricing:
- **GPT-3.5-turbo**: $0.001 per 1K tokens (~$0.002 per request)
- **GPT-4**: $0.03 per 1K tokens (more expensive but better)
- First $5 credit free for new accounts
- **Estimated**: ~2500 requests for $5

---

### **Option B: Google Gemini - Free Alternative**

#### Why Gemini?
- **Completely FREE**
- Good code understanding
- Fast
- No credit card required

#### Getting API Key:
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy your key

#### Setup in Pluto:
```javascript
CopilotService.configure('gemini', 'YOUR_GEMINI_KEY_HERE');
```

#### Pricing:
- **Completely FREE**
- 60 requests per minute
- Perfect for learning and development

---

### **Option C: Local AI (Ollama) - Privacy First**

#### Why Local?
- **100% Private** - Your code never leaves your computer
- Completely free
- Unlimited usage
- No internet needed

#### Setup:
1. Install Ollama: https://ollama.ai/download
2. Run: `ollama pull codellama`
3. Start server: `ollama serve`

#### Setup in Pluto:
```javascript
CopilotService.configure('local', null, 'http://localhost:11434/api/generate');
```

#### Pros/Cons:
- ✅ Free, private, unlimited
- ✅ Works offline
- ❌ Requires ~8GB RAM
- ❌ Slower than cloud APIs
- ❌ Quality depends on model

---

## 3. Setting Up in Pluto Editor

### Step-by-Step:

1. **Open Pluto Editor**
2. **Click Settings Icon** (⚙️) in sidebar
3. **Scroll to bottom** of settings panel
4. **You'll see:**
   ```
   [Configure APIs]
   - Code Execution API
   - Copilot API
   ```

5. **Enter your keys**:
   - Judge0 API Key (for code execution)
   - OpenAI/Gemini API Key (for Copilot)

6. **Click Save**

7. **Done!** Try running code or asking Copilot

---

## 4. Quick Start Guide

### Running C++ Code:
```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello from C++!" << endl;
    return 0;
}
```
1. Paste code in editor
2. Settings → Change language to "C++"
3. Click Run icon → Run Code
4. See output in console!

### Running Python Code:
```python
def greet(name):
    return f"Hello, {name}!"

print(greet("Pluto"))
```
1. Paste code
2. Settings → Language: Python
3. Run Code → See output!

### Running Java Code:
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
    }
}
```
1. Paste code
2. Settings → Language: Java
3. Run Code → See output!

---

## 5. Using Copilot

### Get Suggestions:
1. Write some code
2. Click **Copilot** icon (🤖)
3. Click **"Get Suggestions"**
4. See AI recommendations!

### Analyze Code:
1. Write code
2. Copilot → **"Analyze Code"**
3. See quality score and improvements

### Fix Bugs:
1. Code has errors
2. Copilot → **"Fix Bugs"**
3. AI fixes and explains!

### Generate Code:
1. Copilot → **"Generate Code"**
2. Describe what you want: "Create a function to sort array"
3. AI generates the code!

---

## 6. Troubleshooting

### Code Execution Issues:

**Error: "No API key set"**
- Solution: Add Judge0 API key in settings

**Error: "API quota exceeded"**
- Solution: Upgrade plan or wait for reset (daily limit)

**Error: "Compilation error"**
- Solution: Check your code syntax

### Copilot Issues:

**Error: "Copilot not configured"**
- Solution: Add OpenAI/Gemini API key

**Error: "Invalid API key"**
- Solution: Check key is correct (no extra spaces)

**Slow responses:**
- Solution: Try Gemini (faster) or local Ollama

---

## 7. Cost Estimation

### Light Usage (Learning/Practice):
- **Code Execution**: Free tier (50/day) sufficient
- **Copilot**: Gemini FREE or OpenAI $2-5/month
- **Total**: FREE - $5/month

### Medium Usage (Daily Development):
- **Code Execution**: Basic plan $10/month
- **Copilot**: OpenAI $5-15/month
- **Total**: $15-25/month

### Heavy Usage (Professional):
- **Code Execution**: Pro plan $50/month
- **Copilot**: OpenAI $20-50/month
- **Total**: $70-100/month

### Budget Option (Student):
- **Code Execution**: Self-host (FREE)
- **Copilot**: Gemini (FREE) or local Ollama (FREE)
- **Total**: **$0/month!**

---

## 8. Recommended Setup for Beginners

```javascript
// Best free setup:
1. Judge0: FREE tier (50 requests/day)
2. Copilot: Google Gemini (completely free)

// You get:
- Execute code in 60+ languages
- AI code suggestions
- Code analysis
- Bug fixing
- All for FREE!
```

---

## 9. Security Best Practices

1. **Never commit API keys** to GitHub
2. **Use environment variables** in production
3. **Rotate keys** regularly
4. **Monitor usage** to avoid surprise charges
5. **Use local AI** for sensitive code

---

## 10. Next Steps

1. Get FREE Gemini API key (5 minutes)
2. Get FREE Judge0 API key (5 minutes)
3. Configure in Pluto Settings
4. Start coding with AI assistance!

---

## Quick Links:

- **Judge0 (RapidAPI)**: https://rapidapi.com/judge0-official/api/judge0-ce
- **OpenAI**: https://platform.openai.com
- **Google Gemini**: https://makersuite.google.com/app/apikey
- **Ollama (Local)**: https://ollama.ai

---

## Support

Need help? Check:
1. Console for error messages
2. API provider documentation
3. Pluto Editor logs

Happy Coding! 🚀
