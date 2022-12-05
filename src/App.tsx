
import { Box, Button, IconButton, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import styled from '@emotion/styled'
import { Operation } from "./types/Operation";
import { HistoryItem } from "./types/HistoryItem";
import DeleteIcon from '@mui/icons-material/Delete';
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "./theme";

const displayHistory = (history: HistoryItem[]) => {
    let content = [];
    for (let i = history.length - 1; i >= 0; i--) {
        content.push(<Box>
            <Typography sx={{ textAlign: 'end' }}>{history[i].operationBody}</Typography>
            <Typography variant="h4" sx={{ textAlign: 'end' }}>{history[i].result}</Typography>
        </Box>)
    }
    return content;
}

const downloadFile = (text: string,) => {
    let blob = new Blob([text], { type: "text/plain" });
    let link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "OperationResult");
    link.click();
}

//Styles

const OperationButton = styled.button`
    width: 123px;
    height: 68px;
    margin: 1px;
    border: none;
    background-color: #e3e1e1;
    font-size: 20px;
    &:hover {
        background-color: rgb(212, 210, 210);
    }
`

const InputButton = styled.button`
    width: 123px;
    height: 68px;
    margin: 1px;
    border: none;
    background-color: #f6f6f6;
    font-size: 20px;
    &:hover {
        background-color: rgb(212, 210, 210);
    }   
`
const MemoryButton = styled(Button)`
    color: black;
    font-size: 17px;
    width: 100px;
    &:hover {setCurrentInput
        background-color: rgb(0,0,0, 0.3);
    }
`

function App() {

    const [tabValue, setTabValue] = useState<string>('history');
    const [currentInput, setCurrentInput] = useState<string>("0");
    const [currentOperationExpression, setCurrenOperationExpression] = useState<string>("");
    const [currentOperation, setCurrentOperation] = useState<Operation>(Operation.None);
    const [firstSavedParam, setFirstSavedParam] = useState<number>(0);
    const [secondSavedParam, setSecondSavedParam] = useState<number>(0);
    const [isNewInput, setIsNewInput] = useState<boolean>(true);
    const [isNewOperation, setIsNewOperation] = useState<boolean>(true);
    const [repeatOperation, setRepeateOperation] = useState<boolean>(false);
    const [repeatSqr, setRepeatSqr] = useState<boolean>(false);
    const [repeatOneDevideValue, setRepeatOneDevideValue] = useState<boolean>(false);
    const [repeatRootExtraction, setRepeatRootExtraction] = useState<boolean>(false);
    const [desableOperationBtns, setDisableOperationBtns] = useState<boolean>(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isMemoryEnabled, setMemoryEnabled] = useState<boolean>(false);
    const [memory, setMemory] = useState<number>(0);

    let operationResult: number = 0;

    const input = useRef<HTMLDivElement>(null!);

    useEffect(() => {
        const minSize = 1;
        const maxSize = 99;
        let size = maxSize;
        do {
            input.current.style.fontSize = size + "px";
            size = size - 0.1;
        } while (
            (input.current.clientWidth < input.current.scrollWidth ||
                input.current.clientHeight < input.current.scrollHeight) &&
            size > minSize
        );
    }, [currentInput]);


    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    const resetOperationsRepeat = () => {
        setRepeatSqr(false);
        setRepeatRootExtraction(false);
        setRepeatOneDevideValue(false);
        setRepeateOperation(false);
    }

    const setInitialStates = () => {
        setFirstSavedParam(0);
        setCurrentOperation(Operation.None);
        setCurrenOperationExpression("");
        setDisableOperationBtns(true);
        setIsNewInput(true);
        setSecondSavedParam(0);
    }


    //Buttons hundlers

    const inputBtnsClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        resetOperationsRepeat();
        setDisableOperationBtns(false);

        let additionalSymbol = e.currentTarget.value;

        if (currentInput === "0" && additionalSymbol === "0") {
            return;
        }
        if (additionalSymbol === ".") {
            if (currentInput.indexOf(".") != -1)
                return;
            if (isNewInput && currentInput != "0")
                return;
            else
                setCurrentInput(prev => prev + additionalSymbol)

            setIsNewInput(false);
            return;
        }
        if (isNewInput) {
            setIsNewInput(false);
            setCurrentInput(additionalSymbol)
        }
        else {
            setCurrentInput(prev => prev + additionalSymbol)
        }
    }

    const hundleDelButton = () => {
        if (currentInput.length > 1) {
            setCurrentInput(prev => prev.slice(0, -1));
        }
    }

    // x^2
    const handleSqr = () => {

        let value = Number(currentInput);
        let operationBody = "";
        let result = String(value * value);
        if (!isFinite(value * value)) {
            setInitialStates();
            setCurrentInput("Overflow");
        }
        else {
            setCurrentInput(result);
            operationBody = repeatSqr
                ? "sqr(" + currentOperationExpression + ")"
                : "sqr(" + currentInput + ")";

            repeatSqr
                ? setCurrenOperationExpression(operationBody)
                : setCurrenOperationExpression(operationBody)

            setHistory(historyArr => [...historyArr, {
                operationBody: operationBody,
                result: result
            }])
        }
        setIsNewInput(true);
        setRepeatSqr(true);
    }

    // √x
    const handleRootExtraction = () => {
        let value = Number(currentInput);
        let operationBody = "";
        let result = String(Math.sqrt(value));
        setCurrentInput(result);

        operationBody = repeatRootExtraction
            ? "√(" + currentOperationExpression + ")"
            : "√(" + currentInput + ")";

        repeatRootExtraction
            ? setCurrenOperationExpression(operationBody)
            : setCurrenOperationExpression(operationBody);

        setHistory(historyArr => [...historyArr, {
            operationBody: operationBody,
            result: result
        }])
        setIsNewInput(true);
        setRepeatRootExtraction(true);
    }

    // 1/(x)
    const oneDivideValue = () => {
        if (currentInput == "0") {
            setCurrentInput("Cannot divide by zero");
            setInitialStates();
        }
        else {
            let value = Number(currentInput);
            let result = String(1 / value);
            let operationBody = "";

            setCurrentInput(result);
            setCurrenOperationExpression("1/(" + currentInput + ")");
            operationBody = repeatOneDevideValue
                ? "1/(" + currentOperationExpression + ")"
                : "1/(" + currentInput + ")";

            repeatOneDevideValue
                ? setCurrenOperationExpression(operationBody)
                : setCurrenOperationExpression(operationBody);

            setHistory(historyArr => [...historyArr, {
                operationBody: operationBody,
                result: result
            }])
            setIsNewInput(true);
            setRepeatOneDevideValue(true);
        }
    }

    // +, - , * , /
    const operationBtnsHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        resetOperationsRepeat();
        if (isNewOperation || (currentOperation.toString() != e.currentTarget.value)) {
            setIsNewInput(true);
            setFirstSavedParam(Number(currentInput));
            setIsNewOperation(false);
            switch (e.currentTarget.value) {
                case "addition": {
                    setCurrenOperationExpression(currentInput + " + ");
                    setCurrentOperation(Operation.Addition);
                    break;
                }
                case "subtraction": {
                    setCurrenOperationExpression(currentInput + " - ");
                    setCurrentOperation(Operation.Subtraction);
                    break;
                }
                case "multiplication": {
                    setCurrenOperationExpression(currentInput + " * ");
                    setCurrentOperation(Operation.Multiplication);
                    break;
                }
                case "division": {
                    setCurrenOperationExpression(currentInput + " / ");
                    setCurrentOperation(Operation.Division);
                    break;
                }
            }
        }
        else {
            let value: number = 0;
            let operationBody = "";
            let operationResult = "";
            switch (e.currentTarget.value) {
                case "addition": {
                    value = firstSavedParam + Number(currentInput);
                    setFirstSavedParam(prev => prev + Number(currentInput));
                    setCurrenOperationExpression(value + " + ");
                    setCurrentOperation(Operation.Addition);
                    operationBody = String(firstSavedParam) + " + " + currentInput + " = ";
                    operationResult = String(value);
                    break;
                }
                case "subtraction": {
                    value = firstSavedParam - Number(currentInput);
                    setFirstSavedParam(prev => prev - Number(currentInput));
                    setCurrenOperationExpression(value + " - ");
                    setCurrentOperation(Operation.Subtraction);
                    operationBody = String(firstSavedParam) + " - " + currentInput + " = ";
                    operationResult = String(value);
                    break;
                }
                case "multiplication": {
                    value = firstSavedParam * Number(currentInput);
                    setFirstSavedParam(prev => prev * Number(currentInput));
                    setCurrenOperationExpression(value + " * ");
                    setCurrentOperation(Operation.Multiplication);
                    operationBody = String(firstSavedParam) + " * " + currentInput + " = ";
                    operationResult = String(value);
                    break;
                }
                case "division": {
                    value = firstSavedParam / Number(currentInput);
                    setFirstSavedParam(prev => prev / Number(currentInput));
                    setCurrenOperationExpression(value + " / ");
                    setCurrentOperation(Operation.Division);
                    operationBody = String(firstSavedParam) + " / " + currentInput + " = ";
                    operationResult = String(value);
                    break;
                }
            }
            if (e.currentTarget.value == "division" && currentInput == "0") {
                setCurrentInput("Cannot divide by zero")
                setInitialStates();
            }
            else {
                setCurrentInput(String(value));
                setHistory(historyArr => [...historyArr, {
                    operationBody: operationBody,
                    result: operationResult
                }])
            }

            setIsNewInput(true);
        }
    }

    // = 
    const hundleResultButton = () => {
        let operationBody = "";
        if (currentOperation == Operation.None) {
            operationBody = currentInput + " = ";
            setCurrenOperationExpression(operationBody);
            setHistory(historyArr => [...historyArr, { operationBody: operationBody, result: currentInput }])
            return;
        }
        if (repeatOperation) {
            if (currentOperation == Operation.Addition) {
                operationBody = String(firstSavedParam) + " + " + String(secondSavedParam) + " = "
                setCurrenOperationExpression(operationBody)
            }
            else if (currentOperation == Operation.Subtraction) {
                operationBody = String(firstSavedParam) + " - " + String(secondSavedParam) + " = "
                setCurrenOperationExpression(operationBody)
            }
            else if (currentOperation == Operation.Multiplication) {
                operationBody = String(firstSavedParam) + " * " + String(secondSavedParam) + " = "
                setCurrenOperationExpression(operationBody)
            }
            else if (currentOperation == Operation.Division) {
                operationBody = String(firstSavedParam) + " / " + String(secondSavedParam) + " = "
                setCurrenOperationExpression(operationBody)
            }
        }
        else {
            setCurrenOperationExpression(prev => prev + currentInput + " = ");
            operationBody = currentOperationExpression + currentInput + " = "
        }
        let calculationResult = calculation()
        setCurrentInput(calculationResult);
        setIsNewInput(true);
        setIsNewOperation(true);
        setRepeateOperation(true);
        if (calculationResult != "Cannot divide by zero" && calculationResult != "Error"){
            setHistory(historyArr => [...historyArr, {
                operationBody: operationBody,
                result: String(operationResult)
            }])
            downloadFile(operationBody + String(operationResult));
        }
            
    }

    const calculation = () => {
        let value = repeatOperation ? secondSavedParam : Number(currentInput);
        if (currentOperation == Operation.Addition) {
            operationResult = firstSavedParam + value;
        }
        else if (currentOperation == Operation.Subtraction) {
            operationResult = firstSavedParam - value;
        }
        else if (currentOperation == Operation.Multiplication) {
            operationResult = firstSavedParam * value;
        }
        else if (currentOperation == Operation.Division) {
            if (currentInput == "0") {
                setInitialStates();
                return "Cannot divide by zero"
            }
            operationResult = firstSavedParam / value;
        }
        setFirstSavedParam(operationResult);
        setSecondSavedParam(value);
        return String(operationResult);
    }

    const clearAll = () => {
        setFirstSavedParam(0);
        setSecondSavedParam(0);
        setCurrenOperationExpression("");
        setCurrentInput("0");
        setIsNewOperation(true);
        setIsNewInput(true);
        setDisableOperationBtns(false);
        setCurrentOperation(Operation.None);
    }

    const clearInput = () => {
        if (isNewOperation) {
            clearAll();
            return;
        }
        setCurrentInput("0");
        setIsNewInput(true);
        setDisableOperationBtns(false);
    }
    const changeInputSign = () => {
        let value = Number(currentInput);
        setCurrentInput(String(value * (-1)));
    }

    const clearHistory = () => {
        setHistory([]);
    }

    //Memory Buttons handlers

    const memoryAddButtonHandler = () => {
        if (!isMemoryEnabled) {
            setMemoryEnabled(true);
            setMemory(Number(currentInput));
            setIsNewInput(true);
        }
        else {
            setMemory(memory => memory + Number(currentInput));
            setIsNewInput(true);
        }
    }

    const memorySubstractButtonHandler = () => {
        if (!isMemoryEnabled) {
            setMemoryEnabled(true);
            setMemory(Number(currentInput));
            setIsNewInput(true);
        }
        else {
            setMemory(memory => memory - Number(currentInput));
            setIsNewInput(true);
        }
    }
    const clearMemoryButtonHandler = () => {
        setMemoryEnabled(false);
        setMemory(0);
        setIsNewInput(true);
    }
    const recallMemoryButtonHandler = () => {
        setCurrentInput(String(memory));
        setIsNewInput(true);
    }
    const storeMemoryButtonHandler = () => {
        if (!isMemoryEnabled) {
            setMemoryEnabled(true);
            setIsNewInput(true);
            setMemory(Number(currentInput));
        }
        else {
            setIsNewInput(true);
            setMemory(Number(currentInput));
        }
    }


    return (
        <Box sx={{
            display: "flex",
            justifyContent: 'center',
            alignItems: 'center',
            height: "95vh"
        }}>
            <Box sx={{
                width: 900,
                height: 658,
                backgroundColor: '#bebebe',
                display: 'flex'
            }}>
                <Box sx={{
                    width: 500,
                    height: "100%"
                }}>
                    <Typography variant="h5"
                        sx={{
                            ml: 5,
                            mt: 1
                        }}>
                        Standart Windows Calculator
                    </Typography>
                    <Box sx={{
                        height: 70,
                        display: 'flex',
                        justifyContent: 'end'
                    }}>
                        <Typography variant="h5"
                            sx={{
                                ml: 5,
                                mt: 1
                            }}>
                            {currentOperationExpression}
                        </Typography>
                    </Box>
                    <Box sx={{
                        height: 70,
                        display: 'flex',
                        justifyContent: 'end',
                        maxWidth: 500
                    }}>
                        <div style={{ maxWidth: "500px" }} ref={input}> {currentInput}</div>
                    </Box>
                    <Box sx={{ display: 'flex', mt: 1 }}>
                        <MemoryButton disabled={desableOperationBtns || !isMemoryEnabled} onClick={clearMemoryButtonHandler}>MC</MemoryButton>
                        <MemoryButton disabled={desableOperationBtns || !isMemoryEnabled} onClick={recallMemoryButtonHandler}>MR</MemoryButton>
                        <MemoryButton disabled={desableOperationBtns} onClick={memoryAddButtonHandler}>M+</MemoryButton>
                        <MemoryButton disabled={desableOperationBtns} onClick={memorySubstractButtonHandler}>M-</MemoryButton>
                        <MemoryButton disabled={desableOperationBtns} onClick={storeMemoryButtonHandler}>MS</MemoryButton>
                    </Box>
                    <Box sx={{
                        mt: 1,
                        display: 'flex',
                        flexWrap: 'wrap'
                    }}>
                        <OperationButton disabled={desableOperationBtns}>%</OperationButton>
                        <OperationButton onClick={clearInput}>CE</OperationButton>
                        <OperationButton onClick={clearAll}>C</OperationButton>
                        <OperationButton disabled={desableOperationBtns} onClick={hundleDelButton}>del</OperationButton>
                        <OperationButton disabled={desableOperationBtns} onClick={oneDivideValue}>1/x</OperationButton>
                        <OperationButton disabled={desableOperationBtns} onClick={handleSqr}>x^2</OperationButton>
                        <OperationButton disabled={desableOperationBtns} onClick={handleRootExtraction}>sqrt(x)</OperationButton>
                        <OperationButton disabled={desableOperationBtns} value="division" onClick={(e) => (operationBtnsHandler(e))}>/</OperationButton>
                        <InputButton value="7"
                            onClick={(e) => inputBtnsClickHandler(e)}>7</InputButton>
                        <InputButton value="8" onClick={(e) => inputBtnsClickHandler(e)}>8</InputButton>
                        <InputButton value="9" onClick={(e) => inputBtnsClickHandler(e)}>9</InputButton>
                        <OperationButton disabled={desableOperationBtns} value="multiplication" onClick={(e) => (operationBtnsHandler(e))}>*</OperationButton>
                        <InputButton value="4" onClick={(e) => inputBtnsClickHandler(e)}>4</InputButton>
                        <InputButton value="5" onClick={(e) => inputBtnsClickHandler(e)}>5</InputButton>
                        <InputButton value="6" onClick={(e) => inputBtnsClickHandler(e)}>6</InputButton>
                        <OperationButton disabled={desableOperationBtns} value="subtraction" onClick={(e) => (operationBtnsHandler(e))}>-</OperationButton>
                        <InputButton value="1" onClick={(e) => inputBtnsClickHandler(e)}>1</InputButton>
                        <InputButton value="2" onClick={(e) => inputBtnsClickHandler(e)}>2</InputButton>
                        <InputButton value="3" onClick={(e) => inputBtnsClickHandler(e)}>3</InputButton>
                        <OperationButton disabled={desableOperationBtns} value="addition" onClick={(e) => (operationBtnsHandler(e))}>+</OperationButton>
                        <InputButton disabled={desableOperationBtns} onClick={changeInputSign}>+/-</InputButton>
                        <InputButton value="0" onClick={(e) => inputBtnsClickHandler(e)}>0</InputButton>
                        <InputButton disabled={desableOperationBtns} value="." onClick={(e) => inputBtnsClickHandler(e)}>,</InputButton>
                        <OperationButton disabled={desableOperationBtns} onClick={hundleResultButton}>=</OperationButton>
                    </Box>
                </Box>
                <Box sx={{
                    width: 400,
                    height: "100%"
                }}>
                    <ThemeProvider theme={appTheme}>
                        <Box>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                textColor="primary"
                                indicatorColor="secondary"
                                aria-label="secondary tabs example"
                            >
                                <Tab value="history" label="History" />
                                <Tab value="memory" label="Memory" />
                            </Tabs>
                        </Box>
                        <Box>
                            {tabValue === "history" && (
                                <Box sx={{ mt: 2 }}>
                                    {history.length > 0
                                        ? <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            mr: 2
                                        }}>
                                            <Box sx={{
                                                overflowY: 'auto',
                                                maxHeight: "520px",
                                                height: "520px"
                                            }}>
                                                {displayHistory(history)}
                                            </Box>
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'end'
                                            }}
                                                onClick={clearHistory}>
                                                <IconButton sx={{ width: 50 }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                        : <Typography sx={{ ml: 2 }}>There's no history yet</Typography>}
                                </Box>
                            )}
                            {tabValue === "memory" && (
                                <Box sx={{ mt: 2 }}>
                                    {isMemoryEnabled
                                        ? <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'end',
                                            mr: 2
                                        }}>
                                            <Typography variant="h3">{memory}</Typography>
                                        </Box>
                                        : <Typography sx={{ ml: 2 }}>There's nothing saved in memory</Typography>
                                    }
                                </Box>
                            )}
                        </Box>
                    </ThemeProvider>
                </Box>
            </Box>
        </Box>
    );
}

export default App;