const { app, BrowserWindow, Menu } =  require('electron');

const url = require("url");
const path = require("path");

let mainWindow

function createWindow() {

  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `./dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  mainWindow.webContents.openDevTools()

  createMenu();

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

function createMenu() {

  var menu = Menu.buildFromTemplate([
      {
          label: 'Menu',
          submenu: [
              {label:'Home',
                click(){
                  console.log("Navigate to Home");
                }
            
              },
              {label:'About',                 
              
               click(){
                console.log("Navigate to About");
              }},
              {label:'Exit',                 
               click() { 
                app.quit() 
              }}
          ]
      }
  ])
  Menu.setApplicationMenu(menu); 
}

console.log(app);
app.on('ready', createWindow)

app.on('window-all-closed', function () {
  app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
