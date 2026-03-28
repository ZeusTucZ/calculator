

let fullOp = "";
let res = 0;
let history = [];

let operationInString = false;

let pLeft = 1;
let pRight = 1;

function isOperator(value) {
    return value === "+" || value === "-" || value === "x" || value === "/" || value === "^";
}

function getMainOperatorIndex(expression) {
    for (let i = 1; i < expression.length; i++) {
        if (isOperator(expression[i])) {
            return i;
        }
    }

    return -1;
}

function getExpressionParts(expression) {
    const operatorIndex = getMainOperatorIndex(expression);

    if (operatorIndex === -1) {
        return {
            left: expression,
            operator: "",
            right: ""
        };
    }

    return {
        left: expression.slice(0, operatorIndex),
        operator: expression[operatorIndex],
        right: expression.slice(operatorIndex + 1)
    };
}

function syncInputState() {
    const { left, operator, right } = getExpressionParts(fullOp);
    const sanitizedLeft = left.startsWith("-") ? left.slice(1) : left;
    const sanitizedRight = right.startsWith("-") ? right.slice(1) : right;

    operationInString = operator !== "";
    pLeft = sanitizedLeft.includes(".") ? 0 : 1;
    pRight = sanitizedRight.includes(".") ? 0 : 1;
}

function formatResult(value) {
    if (!Number.isFinite(value)) {
        return String(value);
    }

    if (Number.isInteger(value)) {
        return String(value);
    }

    return Number(value.toFixed(10)).toString();
}

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
    const isInputOperator = isOperator(number);
    const { operator, right } = getExpressionParts(fullOp);
    const lastChar = fullOp[fullOp.length - 1];

    if (isInputOperator) {
        if (fullOp === "") {
            if (number === "-") {
                fullOp = number;
                showNumber(fullOp);
            }
            return;
        }

        if (!operationInString) {
            operationInString = true;
        } else {
            const canUseNegativeSign = number === "-" && right === "" && isOperator(lastChar);

            if (!canUseNegativeSign) {
                return;
            }
        }
    }

    if (number === '.' && !operationInString) {
        if (!fullOp.includes('.') && pLeft === 1) {
            pLeft = pLeft - 1;
        } else {
            return;
        }
    }

    
    if (number === '.' && operationInString) {
        const sanitizedRight = right.startsWith("-") ? right.slice(1) : right;

        if (!sanitizedRight.includes('.') && pRight === 1) {
            pRight = pRight - 1;
        } else {
            return;
        }
    }


    fullOp = fullOp + number;
    showNumber(fullOp)
}

function calculate() {
    const match = fullOp.match(/^(-?\d*\.?\d+)(\+|-|\^|x|\/)(-?\d*\.?\d+)$/);

    if (!match) {
        return;
    }

    const [, a, op, b] = match;

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

    const formattedResult = formatResult(res);
    history.unshift(`${a} ${op} ${b} = ${formattedResult}`);
    history = history.slice(0, 8);
    renderHistory();

    fullOp = formattedResult;
    syncInputState();
    showNumber(formattedResult);
}

function showNumber(number) {
    document.getElementById("screen").innerHTML = number;
}

function handleCE() {
    document.getElementById("screen").innerHTML = "";
    fullOp = "";
    res = 0;
    syncInputState();
}

function handleDelete() {
    if (fullOp === '') {
        return;
    }

    fullOp = String(fullOp).slice(0, -1);
    syncInputState();
    showNumber(fullOp);
}

syncInputState();
renderHistory();
