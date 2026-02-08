require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ChatGroq } = require('@langchain/groq');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        status: '🚀 AI LIVE',
        groqKey: process.env.GROQ_API_KEY ? '✅ LOADED' : '❌ MISSING'
    });
});

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    console.log('👤 User asked:', message);

    try {
        const llm = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model: 'llama-3.1-8b-instant'  // ✅ CURRENT WORKING MODEL (Feb 2026)
        });

        const result = await llm.invoke(`You are CS Interview Mentor. Answer in this EXACT format for perfect chat display:

**Q: [Question title]**

[Short 1-2 sentence answer]

**Code:** (if relevant)
\`\`\`python
[code here]
\`\`\`

**Key Points:**
• Point 1
• Point 2  
• Point 3

**Follow-up:** [1 practice question]

${message}`);


        console.log('🤖 AI:', result.content.slice(0, 50) + '...');
        res.json({ response: result.content });
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        res.json({ response: `AI Error: ${error.message}` });
    }
});

app.listen(5000, () => {
    console.log('🚀 CS INTERVIEW AI LIVE → http://localhost:5000');
    console.log('✅ Using model: llama-3.1-8b-instant');
});