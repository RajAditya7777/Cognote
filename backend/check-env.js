require('dotenv').config();

console.log('Checking OPENROUTER_API_KEY...');
if (process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'your_openrouter_api_key_here') {
    console.log('✅ OPENROUTER_API_KEY is set.');
    console.log('Length:', process.env.OPENROUTER_API_KEY.length);
    console.log('First 4 chars:', process.env.OPENROUTER_API_KEY.substring(0, 4));
} else {
    console.log('❌ OPENROUTER_API_KEY is NOT set or still using placeholder.');
}

console.log('Checking OPENROUTER_MODEL...');
if (process.env.OPENROUTER_MODEL) {
    console.log('✅ OPENROUTER_MODEL is set to:', process.env.OPENROUTER_MODEL);
} else {
    console.log('❌ OPENROUTER_MODEL is NOT set.');
}
