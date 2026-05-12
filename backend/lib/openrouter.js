const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001';


const model = {
    generateContent: async (prompt) => {
        try {
            const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                model: MODEL,
                messages: [{ role: 'user', content: prompt }]
            }, {
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://cognote.app', 
                    'X-Title': 'CogNote'
                }
            });

            if (!response.data.choices || response.data.choices.length === 0) {
                throw new Error('No response from OpenRouter');
            }

            const text = response.data.choices[0].message.content;
            
         
            return {
                response: {
                    text: () => text
                }
            };
        } catch (error) {
            console.error('OpenRouter Error:', error.response?.data || error.message);
            throw error;
        }
    },

    startChat: ({ history = [] }) => {
        let chatHistory = [...history];

        return {
            sendMessage: async (message) => {
                try {
                   
                    const messages = chatHistory.map(h => ({
                        role: h.role === 'model' ? 'assistant' : (h.role === 'user' ? 'user' : 'system'),
                        content: h.parts[0].text
                    }));

                   
                    messages.push({ role: 'user', content: message });

                    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                        model: MODEL,
                        messages: messages
                    }, {
                        headers: {
                            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                            'Content-Type': 'application/json',
                            'HTTP-Referer': 'https://cognote.app',
                            'X-Title': 'CogNote'
                        }
                    });

                    if (!response.data.choices || response.data.choices.length === 0) {
                        throw new Error('No response from OpenRouter');
                    }

                    const text = response.data.choices[0].message.content;

                  
                    chatHistory.push({ role: 'user', parts: [{ text: message }] });
                    chatHistory.push({ role: 'model', parts: [{ text: text }] });

                    return {
                        response: {
                            text: () => text
                        }
                    };
                } catch (error) {
                    console.error('OpenRouter Chat Error:', error.response?.data || error.message);
                    throw error;
                }
            }
        };
    }
};

module.exports = { model };
