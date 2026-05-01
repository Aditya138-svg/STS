document.addEventListener('DOMContentLoaded', function () {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const errorMessage = document.getElementById('file-error'); // Error message element
    const maxFiles = 5; // Maximum number of files allowed

    // Handle drag over and drag leave events
    dropZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', function () {
        dropZone.classList.remove('dragover');
    });

    // Handle drop event
    dropZone.addEventListener('drop', function (e) {
        e.preventDefault();
        dropZone.classList.remove('dragover');

        // Assign dropped files to file input
        fileInput.files = e.dataTransfer.files;
        validateFileCount(); // Validate the file count after dropping files
    });

    // Handle file selection via dialog
    fileInput.addEventListener('change', function () {
        validateFileCount(); // Validate the file count on file selection
    });

    // Function to validate the number of selected files
    function validateFileCount() {
        if (fileInput.files.length > maxFiles) {
            errorMessage.textContent = `You cannot upload more than ${maxFiles} files.`;
            errorMessage.style.display = 'block'; // Show the error message
            dropZone.querySelector('p').textContent = 'No files selected';
            fileInput.value = ''; // Clear the selected files
        } else if (fileInput.files.length) {
            errorMessage.style.display = 'none'; // Hide the error message
            dropZone.querySelector('p').textContent = fileInput.files.length + ' file(s) selected';
        } else {
            dropZone.querySelector('p').textContent = 'Drag & drop your images here or click to Choose files';
        }
    }
});
