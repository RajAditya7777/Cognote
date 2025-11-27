const multer = require('multer');
const path = require('path');
const fs = require('fs');
const verifyToken = require('../auth/verifyToken');
const { extractTextFromPDF } = require('./extract');
const { prisma } = require('../../prismaClient');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../uploads');

        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename: timestamp-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        cb(null, basename + '-' + uniqueSuffix + ext);
    }
});

// File filter to accept only PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

/**
 * PDF Upload Endpoint
 * POST /api/pdf/upload
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Body (multipart/form-data):
 * pdf: <file>
 * 
 * Response:
 * {
 *   "file": { "id": "...", "filename": "...", "filepath": "..." },
 *   "extractedText": "preview of extracted text...",
 *   "note": { "id": "...", "content": "..." }
 * }
 */
async function uploadPDF(req, res) {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                error: 'No PDF file uploaded'
            });
        }

        const userId = req.user.id;
        const filepath = req.file.path;
        const filename = req.file.originalname;

        console.log(`Processing PDF: ${filename} for user: ${userId}`);

        // Extract text from PDF
        const extractedText = await extractTextFromPDF(filepath);

        // Save file metadata to database
        const file = await prisma.file.create({
            data: {
                filename,
                filepath,
                extractedText,
                userId
            }
        });

        // Create a note with the extracted text
        const note = await prisma.note.create({
            data: {
                content: extractedText,
                fileId: file.id,
                userId
            }
        });

        console.log(`Successfully processed PDF: ${file.id}`);

        // Return response with file info and extracted text preview
        res.status(201).json({
            file: {
                id: file.id,
                filename: file.filename,
                filepath: file.filepath,
                createdAt: file.createdAt
            },
            extractedText: extractedText.substring(0, 500) + (extractedText.length > 500 ? '...' : ''),
            note: {
                id: note.id,
                content: note.content.substring(0, 200) + (note.content.length > 200 ? '...' : '')
            }
        });

    } catch (error) {
        console.error('PDF upload error:', error);

        // Delete uploaded file if processing failed
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            error: 'Failed to process PDF file',
            details: error.message
        });
    }
}

// Export the route handler with middleware chain
module.exports = [
    verifyToken,           // First: verify JWT token
    upload.single('pdf'),  // Second: handle file upload
    uploadPDF              // Third: process and save to database
];
