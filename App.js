class LetMeSeo {
    constructor() {
        const { electron, app, BrowserWindow, ipcMain, nativeTheme } = require('electron');
        const connector                     = require('lokijs');
        this.path                           = require('path');
        this.electron                       = electron;
        this.app                            = app;
        this.windows                        = BrowserWindow;
        this.app.allowRendererProcessReuse  = true;
        this.ipcMain                        = ipcMain;
        this.nativeTheme                    = nativeTheme;
        this.fetchUrl                       = require('fetch').fetchUrl;
        this.htmlParser                     = require('node-html-parser');
        this.db                             = new connector(this.app.getAppPath() + this.path.sep + 'letmeseo.db', {
            autoload: true,
            autoloadCallback: this.initDb.bind(this),
        });
    }

    run(){
        this.app.on('ready', () => {
            this.showMainWindow();
            this.compileEvents();
        });
    }

    initDb(){
        let configCollection = this.db.getCollection('config');
        if(configCollection === null){
            configCollection = this.db.addCollection('config');
            configCollection.insert({
                key:    'darkMode',
                value:  this.nativeTheme.shouldUseDarkColors
            });
            configCollection.insert({
                key:    'saveHistory',
                value:  true
            });
            this.db.saveDatabase();
        }
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

    compileEvents(){
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
            let configCollection    = this.db.getCollection('config');
            let darkMode            = configCollection.findOne({key: 'darkMode'});
            if(darkMode instanceof Object) {
                request.returnValue = darkMode.value;
            }
            request.returnValue = false;
        });

        this.ipcMain.on('save-config', (request, configs) => {
            if(configs instanceof  Object){
                let collection = this.db.getCollection('config');
                configs.map((update) => {
                    try{
                        collection.findAndUpdate({key: update.key}, (objt) => {
                            objt.value = update.value;
                            return objt;
                        });
                    }catch (e) {
                        request.reply('save-done', false);
                    }
                });
                try{
                    this.db.saveDatabase();
                    request.reply('save-done', true);
                }catch (e) {
                    request.reply('save-done', false);
                }
            }
        });

        this.ipcMain.on('start-analyze', (request, url) => {
            this.fetchUrl(url, {rejectUnauthorized: false}, (error, meta, body) => {
                if (!error) {
                    if (meta.status == 200) {
                        let parser = this.htmlParser.parse(body, {
                            lowerCaseTagName: false,
                            script: true,
                            style: true,
                            pre: true,
                            comment: false
                        });

                        let analyzed = this.startAnalysis(parser);

                        request.reply('analyze-done', analyzed);
                    }
                }else{
                    request.reply('analyze-error');
                }

            });
        });

        this.app.on('will-quit', () => {
            this.db.saveDatabase();
        });
    }

    startAnalysis(parser){
        return {};
    }
}
let app = new LetMeSeo();
app.run();