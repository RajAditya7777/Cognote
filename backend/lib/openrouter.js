const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001';

/**
 * OpenRouter Client Utility
 * Mimics the @google/generative-ai interface for minimal refactoring
 */
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
                    'HTTP-Referer': 'https://cognote.app', // Optional for OpenRouter rankings
                    'X-Title': 'CogNote'
                }
            });

            if (!response.data.choices || response.data.choices.length === 0) {
                throw new Error('No response from OpenRouter');
            }

            const text = response.data.choices[0].message.content;
            
            // Mocking the Google SDK response structure
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
                    // Map Gemini roles to OpenAI/OpenRouter roles
                    const messages = chatHistory.map(h => ({
                        role: h.role === 'model' ? 'assistant' : (h.role === 'user' ? 'user' : 'system'),
                        content: h.parts[0].text
                    }));

                    // Add the new message
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

                    // Update local history for subsequent calls if needed
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
