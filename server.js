const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const Tesseract = require('tesseract.js');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up storage for uploaded images
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve static files from the public directory
app.use(express.static('public'));

// Set up routes
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const { buffer } = req.file;

        // Process uploaded image
        const grayImageBuffer = await sharp(buffer).greyscale().toBuffer();
        const text = await extractTextWithTesseract(grayImageBuffer);

        // Save extracted text to file
        const textFilePath = `public/extracted_text.txt`;
        saveTextToFile(text, textFilePath);

        // Process image without text
        const imageWithoutTextBuffer = await clearTextFromImage(grayImageBuffer);
        const imageWithoutTextPath = `public/image_without_text.png`;
        saveImageToFile(imageWithoutTextBuffer, imageWithoutTextPath);

        // Create an image containing only the extracted text
        const textOnlyImagePath = `public/text_only.png`;
        createTextOnlyImage(text, textOnlyImagePath);

        res.json({ success: true, extractedText: text });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ success: false, error: 'Error uploading image' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Helper functions
async function extractTextWithTesseract(grayImageBuffer) {
    const { data: { text } } = await Tesseract.recognize(grayImageBuffer, 'eng');
    return text;
}

async function clearTextFromImage(grayImageBuffer) {
    const textData = await Tesseract.recognize(grayImageBuffer, 'eng');
    const paragraphs = textData.data.paragraphs || [];
    const imageWithoutTextBuffer = Buffer.from(grayImageBuffer);
    for (const paragraph of paragraphs) {
        const block = paragraph.block || {};
        const bbox = block.bbox || [];
        if (bbox.length === 4) {
            const x1 = Math.max(0, Math.floor(bbox[0]));
            const y1 = Math.max(0, Math.floor(bbox[1]));
            const x2 = Math.min(imageWithoutTextBuffer.width, Math.ceil(bbox[2]));
            const y2 = Math.min(imageWithoutTextBuffer.height, Math.ceil(bbox[3]));
            imageWithoutTextBuffer.fill(255, x1, y1, x2, y2);
        }
    }
    return imageWithoutTextBuffer;
}

function saveTextToFile(text, filePath) {
    fs.writeFileSync(filePath, text);
}

function saveImageToFile(imageBuffer, filePath) {
    fs.writeFileSync(filePath, imageBuffer);
}

function createTextOnlyImage(text, filePath) {
    const width = 800;
    const height = 200;
    const backgroundColor = { r: 255, g: 255, b: 255 };
    sharp({
        create: {
            width: width,
            height: height,
            channels: 3,
            background: backgroundColor
        }
    })
    .png()
    .toFile(filePath, (err, info) => {
        if (err) {
            console.error('Error creating text-only image:', err);
            return;
        }
        console.log(`Text-only image saved to '${filePath}'`);
    });
}
