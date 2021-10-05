let x, y, r;
const X_VALUES = [-4, -3, -2, -1, 0, 1, 2, 3, 4]
let errorMessage = "";
const maxLength = 15;
let canvas;

canvas = $("#graph-canvas");



function onload () {
    const xTableValues = document.getElementsByClassName("x-table-value");
    const yTableValues = document.getElementsByClassName("y-table-value");
    const rTableValues = document.getElementsByClassName("r-table-value");

    for (let i = 0; i < xTableValues.length; i++) {
        drawPointByRelativeCoordinates(xTableValues[i].innerHTML, yTableValues[i].innerHTML, rTableValues[i].innerHTML);
    }
}



function drawPoint(x, y) {
 //   clearCanvas();
  //  if (x > canvas.width() || x < -canvas.width() || y > canvas.height() || y < -canvas.height()) return;

    let ctxAxes = canvas[0].getContext('2d');
    ctxAxes.setLineDash([2, 2]);
    ctxAxes.beginPath();
    ctxAxes.moveTo(x, 150);
    ctxAxes.lineTo(x, y);
    ctxAxes.moveTo(150, y);
    ctxAxes.lineTo(x, y);
    ctxAxes.stroke();
    ctxAxes.fillStyle = 'red';
    ctxAxes.arc(x, y, 2, 0, 2 * Math.PI);
    ctxAxes.fill();
}

function drawPointByRelativeCoordinates(relX, relY, relR) {
    drawPoint(relX*120/relR + 150, -(relY*120/relR - 150))
}

canvas.on("click", function (event) {
    if (validateR()) {
        let offX = event.offsetX;
        let offY = event.offsetY;
        let x = ((offX - 150) * r) / 120;
        let y = -((offY - 150) * r) / 120;
        window.x = x
        window.y = y;
        if (sendCheckAreaRequest(window.x, window.y, r)) {
            drawPoint(offX, offY);
        }
        errorMessage = "";
    } else {
        alert("R not chosen.")
    }
})

// function findClosestToX(number) {
//     let distToClosest = Infinity;
//     let closest = 0;
//     for (const val of X_VALUES) {
//         if (Math.abs(val - number) < distToClosest) {
//             closest = val;
//             distToClosest = Math.abs(val - number);
//         }
//     }
//     return closest;
// }


function isNumber(input) {
    return !isNaN(parseFloat(input)) && isFinite(input);
}

function addToErrorMessage(errorDesc) {
    errorMessage += (errorDesc + "\n");
}

function hasProperLength(input) {
    return input.length <= maxLength;
}

function validateX() {
    const selector = document.getElementById("XSelect");
    const selectedValue = selector.value;
    if (selectedValue === "") {
        addToErrorMessage("Нужно выбрать X");
        return false;
    }
    x = selectedValue;
    return true;
}

function validateY() {
    y = document.querySelector("input[id=yCoordinate]").value.replace(",", ".");
    if (y === undefined) {
        addToErrorMessage("Поле Y не заполнено");
        return false;
    }
    if (!isNumber(y)) {
        addToErrorMessage("Y должен быть числом от -3 до 3!");
        return false;
    }
    if (!hasProperLength(y)) {
        addToErrorMessage(`Длина числа должна быть не более ${maxLength} символов`);
        return false;
    }
    if (!((y > -3) && (y < 3))) {
        addToErrorMessage("Нарушена область допустимых значений Y (-3; 3)");
        return false;
    }
    return true;
}


function validateR() {
    let RButtons = document.querySelectorAll("input[name=r]");
    RButtons.forEach(function (button) {
        console.log(button.value);
        if (button.checked) {
            r = button.value;
            console.log("success");
        }
    });

    if (r === undefined) {
        addToErrorMessage("Выберите R.");
        console.log("check r");
        return false;
    }
    return true;
}

function submit() {
    if (validateX() & validateY() & validateR()) {
        sendCheckAreaRequest(x, y, r);
    }
    if (!(errorMessage === "")) {
        alert(errorMessage);
        errorMessage = "";
    }
}

function sendCheckAreaRequest(x, y, r) {
    return $.post("process", {
        'x': x,
        'y': y,
        'r': r
    }).done(function (result, status, xhr) {
        if (xhr.getResponseHeader('isValid') === "true") {
            $('#result-table tr:first').after(result);
            drawPointByRelativeCoordinates(x, y, r);
            return true;
        }
    })
}

window.addEventListener('load', onload, false);
