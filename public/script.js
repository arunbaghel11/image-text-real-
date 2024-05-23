document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadForm');
    const messageDiv = document.getElementById('message');
    const extractedTextDiv = document.getElementById('extractedText');
    const downloadButton = document.getElementById('downloadButton');

    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(uploadForm);
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            messageDiv.innerText = 'Image uploaded successfully';
            messageDiv.classList.remove('error');
            downloadButton.style.display = 'block';
            downloadButton.addEventListener('click', () => {
                extractedTextDiv.innerText = `Extracted Text:\n${data.extractedText}`;
            });
        } else {
            messageDiv.innerText = 'Error uploading image';
            messageDiv.classList.add('error');
        }
    });
});
