const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('inventoryApi', {
  openExcel: () => ipcRenderer.invoke('excel:open'),
  exportExcel: (payload) => ipcRenderer.invoke('excel:export', payload),
  exportCompare: (payload) => ipcRenderer.invoke('excel:exportCompare', payload),
  exportDiscrepancy: (payload) => ipcRenderer.invoke('excel:exportDiscrepancy', payload),
  loadRecent: () => ipcRenderer.invoke('recent:load'),
  saveRecent: (payload) => ipcRenderer.invoke('recent:save', payload),
  clearRecent: () => ipcRenderer.invoke('recent:clear'),
  checkForUpdates: () => ipcRenderer.invoke('update:check'),
  onUpdateStatus: (callback) => {
    ipcRenderer.on('update:status', (_event, message) => callback(message));
  }
});
