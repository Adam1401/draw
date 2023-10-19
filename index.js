const canvas = document.getElementById("drawingCanvas");
const context = canvas.getContext("2d");
const clearButton = document.getElementById("clearButton");
const colorPicker = document.getElementById("colorPicker");
const colorPickerImage = document.getElementById("colorPickerImage");
let isDrawing = false;
const undoStack = [];
const redoStack = [];

// Appeler la fonction de redimensionnement lors du chargement initial de la page
resizeCanvas();

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.clientHeight * 0.93;
}

// Appeler la fonction de redimensionnement lors du redimensionnement de la fenêtre
window.addEventListener('resize', resizeCanvas);

canvas.addEventListener("mousedown", () => {
    isDrawing = true;
});

canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    context.beginPath();
    undoStack.push(context.getImageData(0, 0, canvas.width, canvas.height));
    //redoStack.length = 0; // Réinitialiser la pile redo lorsque de nouveaux dessins sont effectués
});

canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", (event) => {
    isDrawing = true;
    draw(event.touches[0]);
});

canvas.addEventListener("touchend", () => {
    isDrawing = false;
    context.beginPath();
    undoStack.push(context.getImageData(0, 0, canvas.width, canvas.height));
    //redoStack.length = 0; // Réinitialiser la pile redo lorsque de nouveaux dessins sont effectués
});

canvas.addEventListener("touchmove", (event) => {
    draw(event.touches[0]);
});

clearButton.addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    undoStack.length = 0;
    redoStack.length = 0;
});

colorPicker.addEventListener("input", () => {
    context.strokeStyle = colorPicker.value;
});

colorPickerImage.addEventListener("click", () => {
    colorPicker.click();
});

function draw(event) {
    if (!isDrawing) return;
    context.lineWidth = 4;
    context.lineCap = "round";
    context.strokeStyle = colorPicker.value;

    context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    context.stroke();
    context.beginPath();
    context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Delete" || event.key === "Backspace") {
        context.clearRect(0, 0, canvas.width, canvas.height);
        undoStack.length = 0;
        redoStack.length = 0;
    }
});

document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "z") {
        event.preventDefault(); // Empêche la navigation arrière du navigateur

        if (undoStack.length > 0) {
            redoStack.push(context.getImageData(0, 0, canvas.width, canvas.height));
            context.putImageData(undoStack.pop(), 0, 0);
        }
    }
});

document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "y") {
        event.preventDefault(); // Empêche la navigation avant du navigateur

        if (redoStack.length > 0) {
            undoStack.push(context.getImageData(0, 0, canvas.width, canvas.height));
            context.putImageData(redoStack.pop(), 0, 0);
        }
    }
});
