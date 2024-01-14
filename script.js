let container = document.querySelector(".container");
let gridWidth = document.getElementById("width-range");
let gridHeight = document.getElementById("height-range");
let colorButton = document.getElementById("color-input");
let eraseRadio = document.getElementById("erase-radio");
let paintRadio = document.getElementById("paint-radio");
let widthValue = document.getElementById("width-value");
let heightValue = document.getElementById("height-value");
let createGridRadio = document.getElementById("create-grid-radio");
let clearGridRadio = document.getElementById("clear-grid-radio");

let events = {
    mouse: {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup"
    },
    touch: {
        down: "touchstart",
        move: "touchmove",
        up: "touchend",
    },
};

let deviceType = "";
let draw = false;
let erase = false;

const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    } catch (e) {
        deviceType = "mouse";
        return false;
    }
};

isTouchDevice();

const createGrid = () => {
    container.innerHTML = "";
    let count = 0;
    for (let i = 0; i < gridHeight.value; i++) {
        count += 2;
        let div = document.createElement("div");
        div.classList.add("gridRow");

        for (let j = 0; j < gridWidth.value; j++) {
            count += 2;
            let col = document.createElement("div");
            col.classList.add("gridCol");
            col.setAttribute("id", `gridCol${count}`);
            col.addEventListener(events[deviceType].down, () => {
                draw = true;
                if (erase) {
                    col.style.backgroundColor = "transparent";
                } else {
                    col.style.backgroundColor = colorButton.value;
                }
            });

            col.addEventListener(events[deviceType].move, (e) => {
                let elementId = document.elementFromPoint(
                    !isTouchDevice() ? e.clientX : e.touches[0].clientX,
                    !isTouchDevice() ? e.clientY : e.touches[0].clientY,
                ).id;
                checker(elementId);
            });

            col.addEventListener(events[deviceType].up, () => {
                draw = false;
            });

            div.appendChild(col);
        }
        container.appendChild(div);
    }
};

const checker = (elementId) => {
    let gridColumns = document.querySelectorAll(".gridCol");
    gridColumns.forEach((element) => {
        if (elementId == element.id) {
            if (draw && !erase) {
                element.style.backgroundColor = colorButton.value;
            } else if (draw && erase) {
                element.style.backgroundColor = "transparent";
            }
        }
    });
};

createGridRadio.addEventListener("change", () => {
    if (createGridRadio.checked) {
        createGrid();
    }
});

clearGridRadio.addEventListener("change", () => {
    if (clearGridRadio.checked) {
        container.innerHTML = "";
    }
});

eraseRadio.addEventListener("change", () => {
    erase = eraseRadio.checked;
});

paintRadio.addEventListener("change", () => {
    erase = !paintRadio.checked;
});

gridWidth.addEventListener("input", () => {
    widthValue.innerHTML = gridWidth.value < 10 ? `0${gridWidth.value}` : gridWidth.value;
});

gridHeight.addEventListener("input", () => {
    heightValue.innerHTML = gridHeight.value < 10 ? `0${gridHeight.value}` : gridHeight.value;
});

// Function to convert the grid to a canvas
function gridToCanvas() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const gridRows = document.querySelectorAll('.gridRow');
    const gridSize = gridRows.length;
    const cellSize = 20; // Size of each cell in the canvas

    canvas.width = gridSize * cellSize;
    canvas.height = gridSize * cellSize;

    gridRows.forEach((row, y) => {
        row.childNodes.forEach((cell, x) => {
            ctx.fillStyle = cell.style.backgroundColor || '#FFFFFF'; // Default to white if no color
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        });
    });

    return canvas;
}

// Function to download the image
function downloadImage() {
    const canvas = gridToCanvas();
    const image = canvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
    const link = document.createElement('a');
    link.download = 'pixel-art.jpg';
    link.href = image;
    link.click();
}

// Event listener for save button
document.getElementById('save-btn').addEventListener('click', downloadImage);

window.onload = () => {
    gridHeight.value = 10;
    gridWidth.value = 10;
    widthValue.innerHTML = gridWidth.value;
    heightValue.innerHTML = gridHeight.value;
    createGrid(); // Optionally, create an initial grid on load
};