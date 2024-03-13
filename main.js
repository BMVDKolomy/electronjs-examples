const { ipcMain, Menu } = require("electron/main");
const { app, BrowserWindow } = require("electron/main");
const path = require("node:path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
         click: () => win.webContents.send("update-counter", 1),
          // click: () => console.log("Increment"),
          label: "Increment",
        },
        {
         click: () => win.webContents.send("update-counter", -1),
          // click: () => console.log("Decrement"),
          label: "Decrement",
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);

  ipcMain.on("set-title", (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.setTitle(title);
  });

  //win.loadURL('https://dkolomy.com');
  win.loadFile("index.html");

  win.webContents.openDevTools();
}

// app.whenReady().then(() => {
//   createWindow();

//   app.on("activate", () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

app.on("ready", () => {
  ipcMain.on("counter-value", (_event, value) => {
    console.log(value);
  })

  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  // darwin - macOS
  if (process.platform !== "darwin") {
    app.quit();
  }
});
