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

        this.ipcMain.on('get-config', (request) => {
            let configs = this.db.getCollection('config');
            request.returnValue = configs.chain().data();
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
                            script: false,
                            style: false,
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
        if(title){
            if(title.childNodes){
                analysis.meta.title = title.childNodes[0].rawText;
            }
        }

        //Check canonical
        let links = parser.querySelectorAll('link');
        links.map((link) => {
            if(link.attributes.rel.toLowerCase() === 'canonical'){
                analysis.canonical = true;
            }
        });

        //Check metas
        let metas = parser.querySelectorAll('meta');
        metas.map((meta) => {
            if(meta.attributes) {
                if(meta.attributes.name) {
                    //Robots
                    if (meta.attributes.name.toLowerCase() === 'robots') {
                        if (
                            meta.attributes.content.toLowerCase().indexOf('index') !== -1 &&
                            meta.attributes.content.toLowerCase().indexOf('follow') !== -1
                        ) {
                            analysis.robots = true;
                        }
                    }

                    //ViewPort
                    if (meta.attributes.name.toLowerCase() === 'viewport') {
                        if (
                            meta.attributes.content.toLowerCase().indexOf('width=device-width') !== -1 &&
                            meta.attributes.content.toLowerCase().indexOf('maximum-scale=1') !== -1
                        ) {
                            analysis.mobile = true;
                        }
                    }

                    //Description
                    if (meta.attributes.name.toLowerCase() === 'description') {
                        analysis.meta.description = meta.attributes.content;
                    }

                    //Keywords
                    if (meta.attributes.name.toLowerCase() === 'keywords') {
                        analysis.meta.keywords = meta.attributes.content;
                    }
                }else if(meta.attributes.property){
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
            if(image.attributes) {
                if(image.attributes.alt) {
                    if (image.attributes.alt.length === 0) {
                        analysis.imageNoAlt.push(image.toString());
                    }
                }else{
                    analysis.imageNoAlt.push(image.toString());
                }
            }else{
                analysis.imageNoAlt.push(image.toString());
            }
        });
        return analysis;
    }
}
let app = new LetMeSeo();
app.run();