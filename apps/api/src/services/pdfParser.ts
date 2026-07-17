import fs from 'fs';
import pdfParse from 'pdf-parse';
import logger from '../shared/logger';

/**
 * Extracts raw text from a PDF file using pdf-parse.
 * @param filePath Path to the PDF file
 * @returns Extracted text as a string
 */
export async function extractTextFromPdf(filePath: string): Promise<string> {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text;
    } catch (error) {
        logger.error(`Error parsing PDF at ${filePath}:`, error);
        return "";
    }
}
