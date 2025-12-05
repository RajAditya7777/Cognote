const axios = require('axios');

const API_URL = 'http://localhost:4000';

async function testEndpoints() {
    try {
        console.log('Testing all backend endpoints...\n');

        // Test 1: Health check
        console.log('1. Testing health endpoint...');
        const health = await axios.get(`${API_URL}/health`);
        console.log(`   ✓ Health: ${health.data.status}`);

        // Test 2: User data endpoint (the one that was failing)
        console.log('2. Testing /api/user/data endpoint...');
        const userData = await axios.post(`${API_URL}/api/user/data`, {
            userId: 'cmiq4yuly0000yts075pt9qb0',
            notebookId: 'cmirlt6w70012v6lmyvitja5h'
        });
        console.log(`   ✓ Files returned: ${userData.data.files.length}`);
        console.log(`   ✓ Notes returned: ${userData.data.notes.length}`);
        if (userData.data.files.length > 0) {
            const file = userData.data.files[0];
            console.log(`   ✓ First file has quiz: ${file.quiz ? file.quiz.length : 0}`);
            console.log(`   ✓ First file has flashcards: ${file.flashcards ? file.flashcards.length : 0}`);
            console.log(`   ✓ First file has summary: ${file.summary ? 'yes' : 'no'}`);
        }

        console.log('\n✅ All endpoints working correctly!');
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testEndpoints();
