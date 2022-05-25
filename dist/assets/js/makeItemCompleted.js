function completeItem(el) {

    el.classList.add("completed");
    el.querySelector("img").src = "images/check-circle-fill.svg";

    let index = findIndexByObjectValue(itemAndId, "el", el);
    ipcRenderer.send("complete-item", {"id": itemAndId[index].id});

}

function unCompleteItem(el) {

    el.classList.remove("completed");
    el.querySelector("img").src = "images/circle.svg";

    let index = findIndexByObjectValue(itemAndId, "el", el);
    ipcRenderer.send("un-complete-item", {"id": itemAndId[index].id});

}