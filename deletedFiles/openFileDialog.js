

const { dialog } = require('electron');

const openFileDialog = (fileType) => {
    const options = {
        title: `Open ${fileType.toUpperCase()} File`,
        filters: [
            { name: `${fileType.toUpperCase()} Files`, extensions: ['fileType'] }
        ],
        properties: ['openFile'],
    };

    dialog.showOpenDialog(options)
        .then((result) => {
            if (!result.canceled && result.filePaths.length > 0) {
                const selectedFile = result.filePaths[0];
                // Do something with the selected file, e.g., run it.
                console.log(`Selected file: ${selectedFile}`);
            }
        })
        .catch((err) => {
            console.error(err);
        });
}

module.exports = openFileDialog;