const { ipcRenderer } = require('electron');

document.getElementById('exportBtn').addEventListener('click', async () => {
const csvData = 'name,age\nAlice,30\nBob,25';
const result = await ipcRenderer.invoke('save-dialog', csvData);
if (result.success) {
    alert(`File saved to: ${result.filePath}`);
} else {
    alert('File save canceled');
}
});
