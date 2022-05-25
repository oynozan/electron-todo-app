window.onbeforeunload = e => {
    ipcRenderer.send("close");
};