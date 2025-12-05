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

        // Replace all occurrences of localhost:4000 with ${API_URL}
        content = content.replace(/http:\/\/localhost:4000/g, '${API_URL}');

        // Add import if not already present
        if (!content.includes('import API_URL from')) {
            const lines = content.split('\n');
            let insertIndex = 0;

            // Find the last import statement
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes('import ')) {
                    insertIndex = i + 1;
                }
            }

            lines.splice(insertIndex, 0, "import API_URL from '@/config/api';");
            content = lines.join('\n');
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Updated ${file}`);
    } catch (err) {
        console.error(`✗ Error updating ${file}:`, err.message);
    }
});

console.log('\nDone! All files updated.');
