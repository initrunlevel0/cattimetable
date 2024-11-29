const { app, BrowserWindow, powerSaveBlocker } = require('electron');

let mainWindow;
let powerBlockerId;

app.on('ready', () => {
    // Create the main browser window
    mainWindow = new BrowserWindow({
        show: false, // Initially hidden to prevent flicker before maximizing
        webPreferences: {
            nodeIntegration: true, // Allow Node.js in the renderer
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
