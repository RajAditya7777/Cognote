const fs = require('fs');
const pdfParse = require('pdf-parse');

/**
 * Extract text from a PDF file
 * 
 * @param {string} filepath - Absolute path to the PDF file
 * @returns {Promise<string>} - Extracted text content
 * 
 * This function uses pdf-parse library to extract text from PDF files.
 * It reads the file buffer and parses it to extract all text content.
 */
async function extractTextFromPDF(filepath) {
    try {
        // Read PDF file as buffer
        const dataBuffer = fs.readFileSync(filepath);

        // Parse PDF and extract text
        const data = await pdfParse(dataBuffer);

        // Return extracted text
        // data.text contains all the text from the PDF
        // data.numpages contains the number of pages
        // data.info contains metadata (title, author, etc.)

        console.log(`Extracted ${data.text.length} characters from ${data.numpages} pages`);

        if (!data.text || data.text.trim().length === 0) {
            throw new Error('No text could be extracted from the PDF. The file might be image-based or empty.');
        }

        return data.text;

    } catch (error) {
        console.error('PDF extraction error:', error);
        throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
}

/**
 * Extract text and metadata from a PDF file
 * 
 * @param {string} filepath - Absolute path to the PDF file
 * @returns {Promise<Object>} - Object containing text, pages, and metadata
 */
async function extractPDFData(filepath) {
    try {
        const dataBuffer = fs.readFileSync(filepath);
        const data = await pdfParse(dataBuffer);

        return {
            text: data.text,
            pages: data.numpages,
            metadata: data.info,
            version: data.version
        };

    } catch (error) {
        console.error('PDF data extraction error:', error);
        throw new Error(`Failed to extract data from PDF: ${error.message}`);
    }
}

module.exports = {
    extractTextFromPDF,
    extractPDFData
};
