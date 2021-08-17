class LetMeSeo {
    constructor() {
        const {electron, app, BrowserWindow, ipcMain, nativeTheme, Menu} = require('electron');
        const connector = require('lokijs');
        this.path = require('path');
        this.he = require('he');
        this.fs = require('fs');
        this.electron = electron;
        this.app = app;
        this.windows = BrowserWindow;
        this.app.allowRendererProcessReuse = true;
        this.ipcMain = ipcMain;
        this.nativeTheme = nativeTheme;
        this.fetchUrl = require('fetch').fetchUrl;
        this.htmlParser = require('node-html-parser');

        const menuTemplate = [
            {
                label: 'LetMeSeo',
                submenu: [
                    {
                        label: "About",
                        click: () => {
                            this.mainWindow.webContents.send('change-section', 'about');
                        }
                    },
                    {
                        label: "Quit",
                        role: 'quit',
                        click: () => {
                            this.app.quit();
                        }
                    }
                ]
            },
            {
                label: 'Edit',
                submenu: [
                    { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
                    { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
                    { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" }
                ]
            }
        ];
        Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

        let dbPath = this.path.join(__dirname, '/letmeseo.db');
        if(process.env.DEVELOPMENT !== '1'){
            if(!this.fs.existsSync(this.path.join(__dirname, '/../data'))){
                this.fs.mkdirSync(this.path.join(__dirname, '/../data'));
            }
            dbPath = this.path.join(__dirname, '/../data/letmeseo.db');
        }
        this.db = new connector(dbPath, {
            autoload: true,
            autoloadCallback: this.initDb.bind(this),
        });
    }

    run() {
        this.app.on('ready', () => {
            this.showMainWindow();
            this.compileEvents();
        });
    }

    initDb() {
        let configCollection = this.db.getCollection('config');
        if (configCollection === null) {
            configCollection = this.db.addCollection('config');
            configCollection.insert({
                key: 'darkMode',
                value: this.nativeTheme.shouldUseDarkColors
            });
            configCollection.insert({
                key: 'saveHistory',
                value: true
            });
            this.db.saveDatabase();
        }
    }

    showMainWindow() {
        this.mainWindow = new this.windows({
            width: 1200,
            height: 900,
            minHeight: 768,
            minWidth: 1024,
            frame: false,
            transparent: true,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
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

    compileEvents() {
        this.ipcMain.on('quit-app', () => {
            this.app.quit();
        });
        this.ipcMain.on('resize-app', () => {
            if (this.mainWindow.isMaximized()) {
                this.mainWindow.unmaximize();
            } else {
                this.mainWindow.maximize();
            }
        });

        this.ipcMain.on('minimize-app', () => {
            this.mainWindow.minimize();
        });

        this.ipcMain.on('system-mode', (request) => {
            let configCollection = this.db.getCollection('config');
            let darkMode = configCollection.findOne({key: 'darkMode'});
            if (darkMode instanceof Object) {
                request.returnValue = darkMode.value;
            }
            request.returnValue = false;
        });

        this.ipcMain.on('get-config', (request) => {
            let configs = this.db.getCollection('config');
            request.returnValue = configs.chain().data();
        });

        this.ipcMain.on('get-history', (request) => {
            let history = this.db.addCollection('history');
            let data    = [];
            if(history){
                data = history.chain().simplesort('analysisPoints').data();
            }
            request.reply('history-update', data);
        });

        this.ipcMain.on('save-config', (request, configs) => {
            if (configs instanceof Object) {
                let collection = this.db.getCollection('config');
                configs.map((update) => {
                    try {
                        collection.findAndUpdate({key: update.key}, (objt) => {
                            objt.value = update.value;
                            return objt;
                        });
                    } catch (e) {
                        request.reply('save-done', false);
                    }
                });
                try {
                    this.db.saveDatabase();
                    request.reply('save-done', true);
                } catch (e) {
                    request.reply('save-done', false);
                }
            }
        });

        this.ipcMain.on('delete-history', (request, data) => {
            let history = this.db.getCollection('history');
            if(history){
                history.findAndRemove({analyzedUrl: data.key});
                request.reply('history-update', history.chain().simplesort('analysisPoints').data());
            }
        });

        this.ipcMain.on('clean-history', (request, key) => {
            let history = this.db.getCollection('history');
            history.clear();
            request.reply('history-update', history.chain().simplesort('analysisPoints').data());
        });

        this.ipcMain.on('start-analyze', (request, url) => {
            this.fetchUrl(url, {rejectUnauthorized: false}, (error, meta, body) => {
                if (!error) {
                    if (meta.status === 200) {
                        let parser = this.htmlParser.parse(body, {
                            lowerCaseTagName: false,
                            script: false,
                            style: false,
                            pre: true,
                            comment: false
                        });

                        let analyzed = this.startAnalysis(parser);
                        let points = this.calculatePoints(analyzed);

                        analyzed.analyzedUrl = url;
                        analyzed.analysisPoints = points;
                        let configs = this.db.getCollection('config');
                        let result = configs.findOne({key: 'saveHistory'});
                        if (result) {
                            if (result.value === true) {
                                let history = this.db.getCollection('history');
                                if (!history) {
                                    history = this.db.addCollection('history');
                                }
                                let check = history.findOne({analyzedUrl: analyzed.analyzedUrl});
                                if(check === null){
                                    history.insert(analyzed);
                                }else {
                                    history.findAndUpdate({analyzedUrl: analyzed.analyzedUrl}, (check) => {
                                        Object.keys(analyzed).map((key) => {
                                           check[key] = analyzed[key];
                                        });
                                        return check;
                                    });
                                }
                                request.reply('history-update', history.chain().simplesort('analysisPoints').data());
                            }
                        }
                        this.db.saveDatabase();
                        request.reply('analyze-done', analyzed);
                    }
                } else {
                    request.reply('analyze-error', {message: error});
                }

            });
        });

        this.app.on('will-quit', () => {
            this.db.saveDatabase();
        });
    }

    startAnalysis(parser) {
        let analysis = {
            meta: {
                title: false,
                description: false,
                keywords: false
            },
            social: {
                facebook: {
                    app_id: false,
                    type: false,
                    locale: false,
                    site_name: false
                },
                twitter: {
                    card: false,
                    site: false,
                    creator: false,
                },
                url: false,
                title: false,
                description: false,
                image: false
            },
            robots: false,
            canonical: false,
            mobile: false,
            imageNoAlt: [],
            titles: {
                h1: 0,
                h2: 0,
                h3: 0,
                h4: 0
            }
        };

        //Check title
        let title = parser.querySelector('title');
        if (title) {
            if (title.childNodes && title.childNodes[0].rawText) {
                analysis.meta.title = this.he.decode(title.childNodes[0].rawText, {strict: false});
            }
        }

        //Check canonical
        let links = parser.querySelectorAll('link');
        links.map((link) => {
            if (link.attributes.rel.toLowerCase() === 'canonical') {
                analysis.canonical = link.attributes.href;
            }
        });

        //Check metas
        let metas = parser.querySelectorAll('meta');
        metas.map((meta) => {
            if (meta.attributes) {
                if (meta.attributes.name) {
                    //Robots
                    if (meta.attributes.name.toLowerCase() === 'robots' && meta.attributes.content) {
                        analysis.robots = meta.attributes.content.toLowerCase();
                    }

                    //ViewPort
                    if (meta.attributes.name.toLowerCase() === 'viewport' && meta.attributes.content) {
                        analysis.mobile = meta.attributes.content.toLowerCase();
                    }

                    //Description
                    if (meta.attributes.name.toLowerCase() === 'description' && meta.attributes.content) {
                        analysis.meta.description = this.he.decode(meta.attributes.content, {strict: false});
                    }

                    //Keywords
                    if (meta.attributes.name.toLowerCase() === 'keywords' && meta.attributes.content) {
                        analysis.meta.keywords = this.he.decode(meta.attributes.content, {strict: false});
                    }
                } else if (meta.attributes.property) {
                    //Facebook
                    if (meta.attributes.property.toLowerCase() === 'og:locale') {
                        analysis.social.facebook.locale = true;
                    }
                    if (meta.attributes.property.toLowerCase() === 'og:type') {
                        analysis.social.facebook.type = true;
                    }
                    if (meta.attributes.property.toLowerCase() === 'og:site_name') {
                        analysis.social.facebook.site_name = true;
                    }

                    //Twitter
                    if (meta.attributes.property.toLowerCase() === 'twitter:card') {
                        analysis.social.twitter.card = true;
                    }
                    if (meta.attributes.property.toLowerCase() === 'twitter:site') {
                        analysis.social.twitter.site = true;
                    }
                    if (meta.attributes.property.toLowerCase() === 'twitter:creator') {
                        analysis.social.twitter.creator = true;
                    }

                    //All social
                    if (meta.attributes.property.toLowerCase() === 'og:title') {
                        analysis.social.title = true;
                    }
                    if (meta.attributes.property.toLowerCase() === 'og:description') {
                        analysis.social.description = true;
                    }
                    if (meta.attributes.property.toLowerCase() === 'og:url') {
                        analysis.social.url = true;
                    }
                    if (meta.attributes.property.toLowerCase() === 'og:image') {
                        analysis.social.image = true;
                    }
                }
            }
        });

        //Check h tags
        let h1 = parser.querySelectorAll('h1');
        analysis.titles.h1 = h1.length;
        let h2 = parser.querySelectorAll('h2');
        analysis.titles.h2 = h2.length;
        let h3 = parser.querySelectorAll('h3');
        analysis.titles.h3 = h3.length;
        let h4 = parser.querySelectorAll('h4');
        analysis.titles.h4 = h4.length;

        //No alt images
        let images = parser.querySelectorAll('img');
        images.map((image) => {
            if (image.attributes) {
                if (image.attributes.alt) {
                    if (image.attributes.alt.length === 0) {
                        analysis.imageNoAlt.push(image.toString());
                    }
                } else {
                    analysis.imageNoAlt.push(image.toString());
                }
            } else {
                analysis.imageNoAlt.push(image.toString());
            }
        });
        return analysis;
    }

    calculatePoints(data) {
        let points = 0.0;
        if (data.canonical) {
            points = points + 1.0;
        }else{
            points = points - 1.0;
        }
        if (data.mobile) {
            if (data.mobile.indexOf('width=device-width') !== -1 && data.mobile.indexOf('initial-scale=1') !== -1) {
                points = points + 0.5;
            }
        }
        if(!data.meta.title){
            points = points - 1.0;
        }else if(data.meta.title.length <= 60){
            points = points + 1.0;
        }
        if(!data.meta.description){
            points = points - 1.0;
        }else if(data.meta.description.length >= 120 && data.meta.description.length <= 158){
            points = points + 1.0;
        }
        if(data.titles.h1 > 1 || data.titles.h1 === 0){
            points = points - 0.5;
        }else {
            if(
                ((data.titles.h2 < data.titles.h3) || data.titles.h3 === 0) &&
                ((data.titles.h3 < data.titles.h4) || data.titles.h4 === 0)
            ){
                points = points + 0.5
            }
        }
        if(data.imageNoAlt.length === 0){
            points = points + 0.5
        }
        if(
            data.social.title &&
            data.social.image &&
            data.social.url &&
            data.social.description
        ){
            points = points + 0.5;
        }
        return points;
    }
}
let app = new LetMeSeo();
app.run();
