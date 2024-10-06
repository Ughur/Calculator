function Calculator() {
    const display = document.getElementById('calc-display');

    this.isOn = true;
    const operators = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        'x': (a, b) => a * b,
        '/': (a, b) => a / b,
        '%': (a, b) => a % b,
    };
    this.power = () => {
        display.classList.toggle('opacity-0');
        this.clearDisplay();
        this.isOn = false;
    }
    this.clearDisplay = () => {
        display.innerText = '0';
        this.adjustFontSize();
    }
    this.deleteLastEntry = () => {
        if (display.innerText.length > 0) {
            display.innerText = display.innerText.substring(0, display.innerText.length - 1);
        }

        if (display.innerText.length === 0) {
            this.clearDisplay();
        }

        this.adjustFontSize();
    }

    this.adjustFontSize = () => {
        const maxCharacters = 14;

        if (display.innerText.length > maxCharacters) {
            display.style.fontSize = "20px";
        } else {
            display.style.fontSize = "30px";
        }
    }
    this.ensureMinValue = () => {
        const minValue = 20;

        let currentValue = parseFloat(display.innerText);

        if (currentValue < minValue) {
            display.innerText = minValue.toString();
        }
    }

    this.appendValue = (value) => {
        let isOperator = false;
        for (let operator in operators) {
            if (operator == value) {
                isOperator = true;
                break;
            }
        }

        if (isOperator && display.innerText.length === 0) {
            return;
        }

        if (display.innerText === '0' && !isOperator) {
            display.innerText = value;
            return;
        }

        const lastChar = display.innerText[display.innerText.length - 1];
        if (isOperator && operators[lastChar]) {
            display.innerText = display.innerText.substring(0, display.innerText.length - 1) + value;
        } else {
            if (display.innerText.length < 30) {
                display.innerText += value;
            }
        }

        this.adjustFontSize();
    }

    this.handleValues = () => {
        const values = display.innerText.split('');
        const operatorList = [];
        const numbers = [];
        let currentNumber = '';

        for (let value of values) {
            if (operators[value]) {
                if (currentNumber !== '') {
                    numbers.push(Number(currentNumber));
                    currentNumber = '';
                }
                operatorList.push(value);
            } else {
                currentNumber += value;
            }
        }

        if (currentNumber !== '') {
            numbers.push(Number(currentNumber));
        }

        return {
            operatorList,
            numbers
        };
    }

    this.calculate = (operatorList, numbers) => {

        if (operatorList.length !== numbers.length - 1)
            throw new Error('Count of operator list and numbers does not match');

        let result = numbers[0]
        for (let i = 0; i < operatorList.length; i++) {
            const operator = operatorList[i];
            const nextNumber = numbers[i + 1];

            if (!operators[operator])
                throw new Error(`Not valid operator: ${operator}`);

            result = operators[operator](result, nextNumber);
        }
        return result;
    }
    this.appendResult = (result) => {
        display.innerText = result;
    }
}

const calculator = new Calculator();
const buttons = document.querySelectorAll('.btn');

document.getElementById('power-button').addEventListener('click', calculator.power);
document.getElementById('clear-button').addEventListener('click', calculator.clearDisplay);
document.getElementById('delete-last').addEventListener('click', calculator.deleteLastEntry);
document.getElementById('calculate-button').addEventListener('click', () => {
    const operatorList = calculator.handleValues().operatorList;
    const numbers = calculator.handleValues().numbers;
    const result = calculator.calculate(operatorList, numbers);

    calculator.appendResult(result);

})

for (button of buttons)
    button.addEventListener('click', element => calculator.appendValue(element.target.innerText))
