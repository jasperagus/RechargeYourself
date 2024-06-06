const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
saveDialog: (data) => ipcRenderer.invoke('save-dialog', data)
});
