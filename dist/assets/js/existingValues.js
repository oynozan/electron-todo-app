let itemAndId = [];
ipcRenderer.on("todo-values", (event, message) => {

    itemsEl.innerHTML = "";

    if (message.length != 0) {
        noItemText.style.display = "none";
    }

    message.forEach(d => {
        let completedClass = "";

        if (d.completed) {
            completedClass = "completed";
        }

        let itemContent = 
        `<button class="item-completed"><img src="images/circle.svg"></button>${d.todo}<button class="delete-item">X</button>`;

        createItemAsPromise(itemContent, completedClass).then((response) => {
            itemAndId.push({"el": response, "id": d.id});
        });
    });
});

function createItemAsPromise(content, completed) {
    return new Promise((resolve, reject) => {
        let itemEl = document.createElement("div");
        itemEl.className = `item ${completed}`;

        itemsEl.appendChild(itemEl);
        itemEl.innerHTML = content;

        itemEl.getElementsByClassName("delete-item")[0].addEventListener("click", (e) => {
            deleteItem(e.target.parentElement);
            e.stopPropagation();
        });
        
        itemEl.addEventListener("click", (e) => {
            if (itemEl.classList.toString().includes("completed")) unCompleteItem(itemEl);
            else completeItem(itemEl);
        });

        let interval = setInterval(() => {
            if (itemEl.innerHTML == content) {
                clearInterval(interval);
                resolve(itemEl);
            }
        }, 1);
    });
}