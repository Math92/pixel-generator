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
    for (let i = 0; i < gridHeight.value; i++) {
        let div = document.createElement("div");
        div.classList.add("gridRow");

        for (let j = 0; j < gridWidth.value; j++) {
            let col = document.createElement("div");
            col.classList.add("gridCol");
            col.style.backgroundColor = "#FFFFFF"; // Establecer el color de fondo inicial a blanco

            col.addEventListener(events[deviceType].down, (e) => {
                draw = true;
                paintCell(e.target);
            });

            col.addEventListener(events[deviceType].move, (e) => {
                if (draw) {
                    const element = document.elementFromPoint(e.clientX, e.clientY);
                    if (element && element.classList.contains("gridCol")) {
                        paintCell(element);
                    }
                }
            });

            col.addEventListener(events[deviceType].up, () => {
                draw = false;
            });

            div.appendChild(col);
        }
        container.appendChild(div);
    }
};

function paintCell(cell) {
    if (cell && cell.classList.contains("gridCol")) {
        if (erase) {
            cell.style.backgroundColor = "white";
        } else {
            cell.style.backgroundColor = colorButton.value;
        }
    }
}

document.addEventListener(events[deviceType].up, () => {
    draw = false;
});

const checker = (elementId) => {
    let gridColumns = document.querySelectorAll(".gridCol");
    gridColumns.forEach((element) => {
        if (elementId == element.id) {
            if (draw && !erase) {
                element.style.backgroundColor = colorButton.value;
            } else if (draw && erase) {
                element.style.backgroundColor = "white"; // Asegurarse de que se pinte de blanco
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
    if (eraseRadio.checked) {
        erase = true;
        draw = false; // Asegurar que no estamos en modo dibujo
    }
});

paintRadio.addEventListener("change", () => {
    if (paintRadio.checked) {
        erase = false;
        draw = true; // Activar el modo dibujo
    }
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
    const numCols = parseInt(gridWidth.value); // Número de columnas
    const numRows = parseInt(gridHeight.value); // Número de filas
    const cellSize = 20; // Tamaño de cada celda en el lienzo

    canvas.width = numCols * cellSize;
    canvas.height = numRows * cellSize;

    // Obtener las filas de la cuadrícula directamente aquí
    const gridRows = document.querySelectorAll('.gridRow');

    // Dibuja el fondo de cada celda
    gridRows.forEach((row, y) => {
        row.childNodes.forEach((cell, x) => {
            ctx.fillStyle = cell.style.backgroundColor || '#FFFFFF';
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        });
    });

    // Dibuja los bordes de las celdas
    ctx.strokeStyle = '#bdbbbb'; // Color del borde
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
        }
    }

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
    createGrid(); // Opcionalmente, crear una cuadrícula inicial al cargar
};
