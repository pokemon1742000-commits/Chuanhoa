const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const XLSX = require('xlsx');
const ExcelJS = require('exceljs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 860,
    minWidth: 1100,
    minHeight: 680,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}

ipcMain.handle('excel:open', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Chon file Excel',
    filters: [{ name: 'Excel', extensions: ['xlsx', 'xls', 'xlsm', 'csv'] }],
    properties: ['openFile']
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const filePath = result.filePaths[0];
  const workbook = XLSX.readFile(filePath, { cellDates: false, raw: false });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    blankrows: false
  });

  return {
    filePath,
    fileName: path.basename(filePath),
    sheetName,
    rows
  };
});

ipcMain.handle('recent:load', async () => {
  const recent = readRecentState();
  return {
    khoFiles: loadRecentFiles(recent.khoPaths || []),
    bomFiles: loadRecentFiles(recent.bomPaths || [])
  };
});

ipcMain.handle('recent:save', async (_event, payload) => {
  writeRecentState({
    khoPaths: payload.khoPaths || [],
    bomPaths: payload.bomPaths || [],
    updatedAt: new Date().toISOString()
  });
  return true;
});

ipcMain.handle('recent:clear', async () => {
  writeRecentState({ khoPaths: [], bomPaths: [], updatedAt: new Date().toISOString() });
  return true;
});

ipcMain.handle('excel:export', async (_event, payload) => {
  const result = await dialog.showSaveDialog({
    title: 'Luu bao cao so sanh',
    defaultPath: `BaoCao_SoSanh_${getTimestamp()}.xlsx`,
    filters: [{ name: 'Excel Workbook', extensions: ['xlsx'] }]
  });

  if (result.canceled || !result.filePath) {
    return null;
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Inventory Compare App';
  workbook.created = new Date();

  addSheet(workbook, 'Kho Quet Ma', [
    ['STT', 'Ten ma du an', 'Ma ban ve', 'So luong/may', 'Nha san xuat', 'Ngay nhap kho', 'N/A']
  ], payload.khoRows.map((row, index) => [
    index + 1,
    row.projectCode,
    row.drawingCode,
    row.quantity,
    row.manufacturer,
    row.importDate,
    row.note
  ]));

  addSheet(workbook, 'Bomlist Thiet Ke', [
    ['STT', 'Ten mat hang', 'Ma ban ve', 'Nha san xuat', 'So luong/may']
  ], payload.bomRows.map((row, index) => [
    index + 1,
    row.itemName,
    row.drawingCode,
    row.manufacturer,
    row.quantity
  ]));

  addCompareSheet(workbook, payload.compareRows);
  addDiscrepancySheet(workbook, payload.discrepancyRows || []);

  addConfirmSheet(workbook, payload.confirmRows || []);

  await workbook.xlsx.writeFile(result.filePath);
  return result.filePath;
});

ipcMain.handle('excel:exportCompare', async (_event, payload) => {
  const result = await dialog.showSaveDialog({
    title: 'Luu bang So Sanh',
    defaultPath: `SoSanh_ThieuThuaDu_${getTimestamp()}.xlsx`,
    filters: [{ name: 'Excel Workbook', extensions: ['xlsx'] }]
  });

  if (result.canceled || !result.filePath) {
    return null;
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Inventory Compare App';
  workbook.created = new Date();
  addCompareSheet(workbook, payload.compareRows || []);
  addConfirmSheet(workbook, payload.confirmRows || []);

  await workbook.xlsx.writeFile(result.filePath);
  return result.filePath;
});

ipcMain.handle('excel:exportDiscrepancy', async (_event, payload) => {
  const result = await dialog.showSaveDialog({
    title: 'Luu bang Thieu Thua',
    defaultPath: `ThieuThua_${getTimestamp()}.xlsx`,
    filters: [{ name: 'Excel Workbook', extensions: ['xlsx'] }]
  });

  if (result.canceled || !result.filePath) {
    return null;
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Inventory Compare App';
  workbook.created = new Date();
  addDiscrepancySheet(workbook, payload.discrepancyRows || []);

  await workbook.xlsx.writeFile(result.filePath);
  return result.filePath;
});

function addCompareSheet(workbook, compareRows) {
  const compareSheet = addSheet(workbook, 'So Sanh', [
    ['STT', 'Ma BOM', 'Ma Kho', 'Ten mat hang', 'Nha san xuat', 'So luong BOM', 'So luong Kho', 'Chenh lech', 'Trang thai', 'Do tuong dong', 'Ghi chu']
  ], compareRows.map((row, index) => [
    index + 1,
    row.bomDrawingCode,
    row.khoDrawingCode,
    row.itemName,
    row.manufacturer,
    row.bomQuantity,
    row.khoQuantity,
    row.difference,
    row.status,
    row.similarity,
    row.mergeNote
  ]));

  return compareSheet;
}

function readExcelFile(filePath) {
  const workbook = XLSX.readFile(filePath, { cellDates: false, raw: false });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    blankrows: false
  });

  return {
    filePath,
    fileName: path.basename(filePath),
    sheetName,
    rows
  };
}

function loadRecentFiles(paths) {
  return paths
    .filter((filePath) => {
      try {
        return fs.existsSync(filePath);
      } catch {
        return false;
      }
    })
    .map((filePath) => {
      try {
        return readExcelFile(filePath);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function getRecentStatePath() {
  return path.join(app.getPath('temp'), 'inventory-compare-recent-files.json');
}

function readRecentState() {
  try {
    const raw = fs.readFileSync(getRecentStatePath(), 'utf8');
    return JSON.parse(raw);
  } catch {
    return { khoPaths: [], bomPaths: [] };
  }
}

function writeRecentState(payload) {
  fs.writeFileSync(getRecentStatePath(), JSON.stringify(payload, null, 2), 'utf8');
}

function addDiscrepancySheet(workbook, discrepancyRows) {
  const sheet = addSheet(workbook, 'Thieu Thua', [
    ['STT', 'Nguon', 'Ma BOM', 'Ma Kho', 'Ten mat hang', 'Nha san xuat', 'So luong BOM', 'So luong Kho', 'Chenh lech', 'Trang thai', 'Ghi chu']
  ], discrepancyRows.map((row, index) => [
    index + 1,
    row.source,
    row.bomDrawingCode,
    row.khoDrawingCode,
    row.itemName,
    row.manufacturer,
    row.bomQuantity,
    row.khoQuantity,
    row.difference,
    row.status,
    row.note
  ]));

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const status = row.getCell(10).value;
    if (status === 'Thiếu') {
      emphasizeRow(row);
    }
  });

  return sheet;
}

function addConfirmSheet(workbook, confirmRows) {
  if (!confirmRows.length) return null;
  return addSheet(workbook, 'Can Xac Nhan', [
    ['STT', 'Ma Kho', 'So luong Kho', 'Ma BOM de xuat', 'Ten mat hang', 'So luong BOM', 'Do tuong dong']
  ], confirmRows.map((row, index) => [
    index + 1,
    row.khoDrawingCode,
    row.khoQuantity,
    row.bomDrawingCode,
    row.itemName,
    row.bomQuantity,
    row.similarity
  ]));
}

function addSheet(workbook, name, headerRows, dataRows) {
  const sheet = workbook.addWorksheet(name);
  headerRows.concat(dataRows).forEach((row) => sheet.addRow(row));

  sheet.getRow(1).eachCell((cell) => {
    cell.font = { name: 'Times New Roman', bold: true };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DBEAFE' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.font = { name: 'Times New Roman', bold: row.number === 1 };
      cell.border = {
        top: { style: 'thin', color: { argb: 'D9E0EA' } },
        left: { style: 'thin', color: { argb: 'D9E0EA' } },
        bottom: { style: 'thin', color: { argb: 'D9E0EA' } },
        right: { style: 'thin', color: { argb: 'D9E0EA' } }
      };
    });
  });

  sheet.columns.forEach((column) => {
    let maxLength = 12;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const value = cell.value == null ? '' : String(cell.value);
      maxLength = Math.max(maxLength, value.length + 2);
    });
    column.width = Math.min(maxLength, 36);
  });

  sheet.views = [{ state: 'frozen', ySplit: 1 }];
  return sheet;
}

function emphasizeRow(row) {
  row.eachCell((cell) => {
    cell.font = { name: 'Times New Roman', bold: true };
  });
}

function getTimestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
