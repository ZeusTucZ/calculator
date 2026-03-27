

let fullOp = "";
let res = 0;
let history = [];

let operationInString = false;

let pLeft = 1;
let pRight = 1;

function renderHistory() {
    const historyList = document.getElementById("quick-history-list");

    if (!historyList) {
        return;
    }

    historyList.innerHTML = history
        .map((item, index) => `
            <article class="quick-history__item ${index === 0 ? "quick-history__item--active" : ""}">
                <span class="quick-history__amount">${item}</span>
            </article>
        `)
        .join("");
}

function clearHistory() {
    history = [];
    renderHistory();
}

function handleClick(number) {

    if (operationInString && (number === "+" || number === "-" || number === "x" || number === "/" || number === "^")) {
        return;
    }

    if ((number === "+" || number === "-" || number === "x" || number === "/" || number === "^") && fullOp != "") {
        operationInString = true;
    }

    if (number === '.' && !operationInString) {
        if (pLeft === 1) {
            pLeft = pLeft - 1;
        } else {
            return;
        }
    }

    
    if (number === '.' && operationInString) {
        if (pRight === 1) {
            pRight = pRight - 1;
        } else {
            return;
        }
    }


    fullOp = fullOp + number;
    showNumber(fullOp)
}

function calculate() {
    const [a, op, b] = fullOp.split(/(?<=.)(\+|-|\^|x|\/)/);

    if (!a || !op || !b) {
        return;
    }

    switch (op) {
        case "+":
            res = Number(a) + Number(b);
            break
        case "-":
            res = Number(a) - Number(b);
            break
        case "x":
            res = Number(a) * Number(b);
            break
        case "/":
            res = Number(a) / Number(b);
            break
        case "^":
            res = Number(a) ** Number(b);
            break
        default:
            break
    }

    const formattedResult = Number(res).toFixed(2);
    history.unshift(`${a} ${op} ${b} = ${formattedResult}`);
    history = history.slice(0, 8);
    renderHistory();

    operationInString = false;
    pLeft = 0;
    pRight = 1;
    fullOp = formattedResult;
    showNumber(formattedResult);
}

function showNumber(number) {
    document.getElementById("screen").innerHTML = number;
}

function handleCE() {
    document.getElementById("screen").innerHTML = "";
    operationInString = false;
    pLeft = 1;
    pRight = 1;
    fullOp = "";
    res = 0;
}

function handleDelete() {
    if (fullOp === '') {
        return;
    }

    if (fullOp[fullOp.length - 1] === '.') {
        if (!operationInString) {
            pLeft = 1;
        } else {
            pRight = 1;
        }
    }

    fullOp = String(fullOp).slice(0, -1);
    operationInString = /(\+|-|\^|x|\/)/.test(fullOp);
    showNumber(fullOp);
}

renderHistory();
