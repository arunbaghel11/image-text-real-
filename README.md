Overview---->
This project is designed to process uploaded images to extract text content and manipulate the image based on the extracted text. The core functionalities include:

Image Analysis: Using Vision APIs to analyze the uploaded image.
Text Extraction: Extracting text content from the image using Optical Character Recognition (OCR).
Visual Element Segmentation: Implementing basic image segmentation techniques to isolate individual visual elements within the main image.
Features----->
Text Extraction: Extract text from images using Tesseract.js.
Grayscale Conversion: Convert images to grayscale using Sharp.
Image Manipulation: Create images with and without text content.
File Handling: Save extracted text and processed images to the server.
Technologies Used--->
Node.js: JavaScript runtime environment for server-side programming.
Express.js: Web framework for building the server and handling HTTP requests.
Multer: Middleware for handling file uploads.
Sharp: Image processing library for manipulating images.
Tesseract.js: OCR library for extracting text from images.
fs (File System): Node.js module for handling file operations.
