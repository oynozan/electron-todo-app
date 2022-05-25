//Fadeout function
function fadeout(el) {
    return new Promise((resolve, reject) => {
        let counter = 1;
        let interval = setInterval(() => {

            //Decrease opacity every 1ms until element is completely gone
            counter-=0.015;
            el.style.opacity = `${counter}`;

            if (counter <= 0) {
                el.remove();
                clearInterval(interval);
                resolve();
            }

        }, 1);
    });
}

function deleteItem(el) {

    let index = findIndexByObjectValue(itemAndId, "el", el);
    ipcRenderer.send("delete-item", {"id": itemAndId[index].id});
    
    fadeout(el).then(response => {
        if (itemsEl.children.length == 0) noItemText.removeAttribute("style");
    });

}
