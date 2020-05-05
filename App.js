class LetMeSeo {
    constructor() {
        const { electron, app, BrowserWindow, ipcMain, systemPreferences } = require('electron');
        this.electron                       = electron;
        this.app                            = app;
        this.windows                        = BrowserWindow;
        this.app.allowRendererProcessReuse  = true;
        this.ipcMain                        = ipcMain;
        this.systemPreferences              = systemPreferences;
    }

    run(){
        this.app.on('ready', () => {
            this.showMainWindow();
            this.complieIpc();
        });
    }

    showMainWindow(){
        this.mainWindow = new this.windows({
            width: 1200,
            height: 900,
            minHeight: 768,
            minWidth: 1024,
            frame: false,
            transparent: true,
            show: false,
            webPreferences: {
                nodeIntegration: true
            }
        });

        this.mainWindow.loadFile('app/index.html');

        this.mainWindow.on('ready-to-show', () => {
            this.mainWindow.show();
        });

        this.mainWindow.on('closed', () => {
            this.mainWindow = null
        });
    }

    complieIpc(){
        this.ipcMain.on('quit-app', () => {
           this.app.quit();
        });
        this.ipcMain.on('resize-app', () => {
           if(this.mainWindow.isMaximized()){
               this.mainWindow.unmaximize();
           }else{
               this.mainWindow.maximize();
           }
        });

        this.ipcMain.on('minimize-app', () => {
            this.mainWindow.minimize();
        });

        this.ipcMain.on('system-mode', (request) => {
            request.returnValue = this.systemPreferences.isDarkMode();
        });
    }
}
let app = new LetMeSeo();
app.run();