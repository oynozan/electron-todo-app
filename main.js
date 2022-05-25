require('dotenv').config();
const electron = require("electron");
const path = require("path");
const url = require("url");
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const {app, BrowserWindow, ipcMain} = electron;
const db = new sqlite3.Database(path.join(__dirname, "db/todo.db"));

let mainWindow;
function startApp() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 800,
        backgroundColor: '#0d0d0d',
        resizable: false,
        icon: __dirname + '/icon.ico',
        webPreferences: {
            nodeIntegration: true,
            devTools: process.env.NODE_ENV === "development",
            enableRemoteModule: true,
            contextIsolation: false
        }
    });

    //Wait until page finishes the loading
    mainWindow.webContents.on("did-finish-load", () => {
        db.serialize(() => {
            //Create table if not exist
            db.run("CREATE TABLE IF NOT EXISTS todo_items (id TEXT, todo TEXT, completed BOOLEAN)");
            readFromDatabase();
        });
    });

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "dist/index.html"),
            protocol: "file",
            slashes: true
        })
    );

    mainWindow.removeMenu();
}

app.on("ready", () => {
    startApp();
});

function readFromDatabase() {
    let todoDatas = [];
    //Read existing values from database
    db.all("SELECT * FROM todo_items", (err, rows) => {
        let counter = 0;
        rows.forEach(row => {
            counter++;
            todoDatas.push({
                "id": row.id,
                "todo" : row.todo,
                "completed": row.completed
            });
            if (counter == rows.length) mainWindow.webContents.send("todo-values", todoDatas);
        });
    });
}

//Listen for to-do inputs
ipcMain.on("add-todo-item", (event, data) => {

    //Add todo item to database
    db.run("INSERT INTO todo_items (id, todo, completed) VALUES (?, ?, ?)", [uuidv4(), data.data, false], err => {
        if (err) console.log(err);
        else {
            readFromDatabase();
        }
    });

});

//Listen for to-do deletion request
ipcMain.on("delete-item", (event, data) => {

    db.run("DELETE FROM todo_items WHERE id = ?", data.id, err => {
        if (err) console.log(err);
    });

})

//Make item completed
ipcMain.on("complete-item", (err, data) => {
    db.run("UPDATE todo_items SET completed = 1 WHERE id = ?", data.id, err => {
        if (err) console.log(err);
    });
});

//Make item uncompleted
ipcMain.on("un-complete-item", (err, data) => {
    db.run("UPDATE todo_items SET completed = 0 WHERE id = ?", data.id, err => {
        if (err) console.log(err);
    });
});

//Listen for closing app
ipcMain.on("close", () => {
    //Close database before quiting from app
    db.close();
    app.quit();
});