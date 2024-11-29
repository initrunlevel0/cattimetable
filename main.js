const { app, BrowserWindow, powerSaveBlocker, ipcMain } = require('electron');
const path = require('node:path')

let mainWindow;
let powerBlockerId;

app.on('ready', () => {
    // Create the main browser window
    mainWindow = new BrowserWindow({
        show: false, // Initially hidden to prevent flicker before maximizing
        webPreferences: {
            nodeIntegration: true, // Allow Node.js in the renderer
            backgroundThrottling: false,
            preload: path.join(__dirname, 'preload.js')
        },
        autoHideMenuBar: true, // Automatically hide the menu bar
    });

    // Maximize the window when it is ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.maximize(); // Maximizes the window
        mainWindow.show(); // Makes the window visible
    });

    // Load your HTML file
    mainWindow.loadFile('index.html');

    // Prevent standby
    powerBlockerId = powerSaveBlocker.start('prevent-display-sleep');
    console.log('Power Save Blocker ID:', powerBlockerId);

    mainWindow.on('closed', () => {
        mainWindow = null;

        // Stop power save blocker when app is closed
        if (powerSaveBlocker.isStarted(powerBlockerId)) {
            powerSaveBlocker.stop(powerBlockerId);
        }
    });

    ipcMain.on('reminder', () => {
        if (mainWindow) {
            mainWindow.maximize();
            mainWindow.show(); // Make the window visible if hidden
            mainWindow.focus(); // Bring it to the front
        }
    });

    //mainWindow.webContents.openDevTools();
});

app.on('window-all-closed', () => {
    // Quit the app when all windows are closed
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // Recreate a window when the app is activated (macOS behavior)
    if (mainWindow === null) {
        createWindow();
    }
});
