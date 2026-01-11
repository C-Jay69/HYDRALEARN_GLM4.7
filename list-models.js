const dotenv = require('dotenv');
const fs = require('fs');

async function listModels() {
    const envConfig = dotenv.parse(fs.readFileSync('.env'));
    const apiKey = envConfig.GEMINI_API_KEY || envConfig.GOOGLE_GENAI_API_KEY;

    if (!apiKey) {
        console.error('API Key not found');
        return;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            const flashModels = data.models
                .filter(m => m.name.toLowerCase().includes('flash'))
                .map(m => m.name);
            fs.writeFileSync('models.txt', flashModels.join('\n'));
            console.log('Saved models to models.txt');
        } else {
            console.log('No models found or error in response:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('Error fetching models:', error);
    }
}

listModels();
