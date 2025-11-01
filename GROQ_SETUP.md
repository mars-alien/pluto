# 🚀 Groq API Setup Guide (FREE)

## Why Groq?
- **100% FREE** - No credit card required
- **Super Fast** - Fastest inference speeds available
- **Generous Limits** - 14,400 requests/day, 6,000 tokens/minute
- **Great Models** - Llama 3.1 70B, Mixtral 8x7B, CodeLlama
- **Perfect for Code** - Excellent code generation capabilities

## 🔑 Get Your FREE Groq API Key

### Step 1: Sign Up
1. Visit: https://console.groq.com/
2. Click "Sign Up" 
3. Use your email or Google account
4. Verify your email if required

### Step 2: Get API Key
1. Go to "API Keys" in the left sidebar
2. Click "Create API Key"
3. Give it a name (e.g., "Pluto Editor")
4. Copy the key (starts with `gsk_`)

### Step 3: Add to Your Project
1. Copy `frontend/.env.example` to `frontend/.env`
2. Replace `gsk_your_groq_key_here` with your actual key:
   ```
   VITE_GROQ_API_KEY=gsk_your_actual_key_here
   ```
3. Restart your dev server: `npm run dev`

## 🎯 Available Models (Updated Nov 2025)

### Recommended for Code Generation:
- **llama-3.1-8b-instant** (Default) - Fast and efficient for code tasks
- **mixtral-8x7b-32768** - Good for complex code tasks with large context
- **llama-3.2-90b-text-preview** - Most powerful for complex reasoning
- **gemma2-9b-it** - Good alternative for code generation

### Code-Specific Models:
- **llama3-groq-70b-8192-tool-use-preview** - Function calling (if available)
- **llama3-groq-8b-8192-tool-use-preview** - Lightweight tool use

## 🔧 Configuration Options

You can modify the model in `CopilotService.js`:
```javascript
this.model = 'llama-3.1-8b-instant'; // Change this line
```

## 📊 Free Tier Limits
- **Daily Requests**: 14,400 per day
- **Rate Limit**: 6,000 tokens per minute
- **Context Window**: Up to 32K tokens (model dependent)
- **No Expiration**: Free tier doesn't expire

## 🆚 Model Comparison

| Model | Speed | Quality | Context | Best For |
|-------|-------|---------|---------|----------|
| Llama 3.1 8B Instant | Very Fast | Good | 8K | Quick suggestions, code completion |
| Mixtral 8x7B | Fast | Very Good | 32K | Long code files, complex logic |
| Llama 3.2 90B | Slower | Excellent | 8K | Complex debugging, architecture |
| Gemma2 9B | Fast | Good | 8K | Alternative for code generation |

## 🚨 Troubleshooting

### "API Key not found"
- Check `.env` file exists in `frontend/` folder
- Ensure key starts with `gsk_`
- Restart dev server after adding key

### "Rate limit exceeded"
- You've hit the 6,000 tokens/minute limit
- Wait 1 minute and try again
- Consider using a smaller model for faster requests

### "Invalid API key"
- Double-check the key from Groq console
- Make sure no extra spaces in `.env` file
- Regenerate key if needed

## 🎉 You're All Set!

Once configured, your AI Copilot will use Groq's lightning-fast inference for:
- ✅ Code suggestions and completions
- ✅ Bug fixing and debugging
- ✅ Code explanation and analysis
- ✅ Code generation from descriptions
- ✅ Best practices recommendations

Enjoy coding with AI assistance! 🤖✨
