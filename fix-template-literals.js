const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'app/dashboard/page.jsx',
    'app/dashboard/_components/MainContent.jsx',
    'app/dashboard/_components/SidebarLeft.jsx',
    'app/dashboard/_components/DashboardHeader.jsx',
    'app/dashboard/_components/QuizPanel.jsx',
    'app/dashboard/_components/SummaryPanel.jsx',
    'app/dashboard/_components/FlashcardPanel.jsx',
    'app/notebooks/page.jsx',
    'app/profile/page.jsx',
];

filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, file);
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Fix the incorrectly replaced URLs - change '${API_URL}' to `${API_URL}`
        // This regex finds fetch calls with the wrong quotes
        content = content.replace(/'(\$\{API_URL\}[^']*)'/g, '`$1`');

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Fixed ${file}`);
    } catch (err) {
        console.error(`✗ Error fixing ${file}:`, err.message);
    }
});

console.log('\nDone! All template literals fixed.');
