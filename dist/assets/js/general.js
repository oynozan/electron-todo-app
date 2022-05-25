const itemsEl = document.getElementsByClassName("items")[0];
const noItemText = document.getElementsByClassName("no-item-text")[0];

const addButton = document.getElementById("add-item-button");
const itemInput = document.getElementById("item-input");

function submitItem() {
    if (itemInput.value != "") {
        ipcRenderer.send('add-todo-item', {
            data: itemInput.value
        });

        itemInput.value = "";
        itemInput.focus();
    }
}

addButton.addEventListener("click", submitItem);

itemInput.addEventListener("keyup", function(e) {
    if (e.keyCode === 13) {
        submitItem();
    }
});

function findIndexByObjectValue(arr, valueName, value) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][valueName] == value) return i;
    }
}