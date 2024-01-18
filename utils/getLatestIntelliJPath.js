const fs = require('fs');
const path = require('path');

const getLatestIntelliJPath = () => {
    const jetBrainsDir = 'C:\\Program Files (x86)\\JetBrains';
    const folders = fs.readdirSync(jetBrainsDir).filter(folder => folder.startsWith('IntelliJ IDEA'));

    if (folders.length === 0) {
        throw new Error('No IntelliJ IDEA installations found .. ');
    }

    const sortedFolders = folders.sort((a, b) => {
        const versionA = a.split(' ')[2];
        const versionB = b.split(' ')[2];
        return versionA.localeCompare(versionB, undefined, { numeric: true, sensitivity: 'base' });
    });

    const latestVersionFolder = sortedFolders[sortedFolders.length - 1];
    const fullPath = path.join(jetBrainsDir, latestVersionFolder, 'bin', 'idea64.exe');

    return `"${fullPath.replace(/\\/g, '\\\\')}"`;

}


module.exports = getLatestIntelliJPath;

