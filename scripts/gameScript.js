const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const X_OFFSET = canvas.getBoundingClientRect().left;
const Y_OFFSET = canvas.getBoundingClientRect().top;
const SIM_FPS = 5;
const TIME_PER_FRAME = 1000 / SIM_FPS;
let START;

const Game = {

    debugMousePos: {
        x: 0,
        y: 0
    },
    startButtonPos: {
        ULCoords: {
            x: 0,
            y: 0
        },
        URCoords: {
            x: 0,
            y: 0
        },
        LLCoords: {
            x: 0,
            y: 0
        },
        LRCoords: {
            x: 0,
            y: 0
        }
    },
    stepButtonPos: {
        ULCoords: {
            x: 0,
            y: 0
        },
        URCoords: {
            x: 0,
            y: 0
        },
        LLCoords: {
            x: 0,
            y: 0
        },
        LRCoords: {
            x: 0,
            y: 0
        }
    },
    clearButtonPos: {
        ULCoords: {
            x: 0,
            y: 0
        },
        URCoords: {
            x: 0,
            y: 0
        },
        LLCoords: {
            x: 0,
            y: 0
        },
        LRCoords: {
            x: 0,
            y: 0
        }
    },
    isRunning: false,
    debug: false,

    setMousePos(x, y) {
        this.debugMousePos.x = x;
        this.debugMousePos.y = y;
    },

    getMousePos() {
        return this.debugMousePos;
    },

    setStartButtonPos(x, y, w, h) {
        this.startButtonPos.ULCoords.x = x;
        this.startButtonPos.ULCoords.y = y;

        this.startButtonPos.URCoords.x = x + w;
        this.startButtonPos.URCoords.y = y;

        this.startButtonPos.LRCoords.x = x + w;
        this.startButtonPos.LRCoords.y = y + h;

        this.startButtonPos.LLCoords.x = x;
        this.startButtonPos.LLCoords.y = y + h;
    },

    getStartButtonPos() {
        return this.startButtonPos;
    },

    setStepButtonPos(x, y, w, h) {
        this.stepButtonPos.ULCoords.x = x;
        this.stepButtonPos.ULCoords.y = y;

        this.stepButtonPos.URCoords.x = x + w;
        this.stepButtonPos.URCoords.y = y;

        this.stepButtonPos.LRCoords.x = x + w;
        this.stepButtonPos.LRCoords.y = y + h;

        this.stepButtonPos.LLCoords.x = x;
        this.stepButtonPos.LLCoords.y = y + h;
    },

    getStepButtonPos() {
        return this.stepButtonPos;
    },

    setClearButtonPos(x, y, w, h) {
        this.clearButtonPos.ULCoords.x = x;
        this.clearButtonPos.ULCoords.y = y;

        this.clearButtonPos.URCoords.x = x + w;
        this.clearButtonPos.URCoords.y = y;

        this.clearButtonPos.LRCoords.x = x + w;
        this.clearButtonPos.LRCoords.y = y + h;

        this.clearButtonPos.LLCoords.x = x;
        this.clearButtonPos.LLCoords.y = y + h;
    },

    getClearButtonPos() {
        return this.clearButtonPos;
    },

    setIsRunning(isRunning) {
        this.isRunning = isRunning;
    },

    getIsRunning() {
        return this.isRunning;
    },

    initialize(debug = false) {
        //Start Timer
        START = Date.now();
        if(debug === true) {
            this.debug = true;
            canvas.addEventListener("mousemove", this.printMousePos);
        }
        canvas.addEventListener("click", this.checkInput);
        Grid.initializeGrid(20);
        Game.setStepButtonPos(315, 680, 105, 28);
        Game.setStartButtonPos(200, 680, 100, 28);
        Game.setClearButtonPos(435, 680, 100, 28);
        window.requestAnimationFrame(this.draw);
    },
    
    printMousePos(e) {
        if(e) {
            const x = Math.floor(e.clientX - X_OFFSET);
            const y = Math.floor(e.clientY - Y_OFFSET);

            Game.setMousePos(x, y);
            
            ctx.clearRect(400, 10, 150, 90);
            ctx.fillStyle = "black";
            ctx.fillRect(400, 10, 150, 90);
        }

        ctx.font = "24px sans-serif";
        ctx.fillStyle = "white";
        ctx.fillText("Mouse Coords:", 150, 675);
        ctx.fillText(`X: ${Game.debugMousePos.x}`, 325, 675);
        ctx.fillText(`Y: ${Game.debugMousePos.y}`, 400, 675);
    },

    handleClick() {
        canvas.addEventListener("click", (e) => {
            this.setMousePos(e.clientX, e.clientY);
        });
    },

    checkInput(e) {
        const mouseX = Math.floor(e.clientX - X_OFFSET);
        const mouseY = Math.floor(e.clientY - Y_OFFSET);

        //Iterate through grid to check for click location and flip isAlive as appropriate
        for(let i = 0; i < Grid.gridState.length; i++) {
            const square = Grid.gridState[i];
            if(mouseX > square.ULCoords.x && mouseX < square.URCoords.x) {
                if(mouseY > square.ULCoords.y && mouseY < square.LLCoords.y) {
                    square.isAlive = !square.isAlive;
                    //console.log("Click detected in Grid at (" + mouseX + ", " + mouseY + ")");
                }
            }
        }

        //Check for Step button click
        const stepButton = Game.getStepButtonPos()
        if(mouseX > stepButton.ULCoords.x && mouseX < stepButton.URCoords.x) {
            if(mouseY > stepButton.ULCoords.y && mouseY < stepButton.LLCoords.y) {
                //console.log("Step Button Clicked");
                Grid.gridState = Grid.nextState();
            }
        }

        //Check for Start button click
        const startButton = Game.getStartButtonPos();
        if(mouseX > startButton.ULCoords.x && mouseX < startButton.URCoords.x) {
            if(mouseY > startButton.ULCoords.y && mouseY < startButton.LLCoords.y) {
                //console.log("Start/Stop Button Clicked");
                const isRunning = Game.getIsRunning();
                Game.setIsRunning(!isRunning);
            }
        }

        //Check for Clear button click
        const clearButton = Game.getClearButtonPos();
        if(mouseX > clearButton.ULCoords.x && mouseX < clearButton.URCoords.x) {
            if(mouseY > clearButton.ULCoords.y && mouseY < clearButton.LLCoords.y) {
                //console.log("Clear Button Clicked");
                for(let square of Grid.gridState) {
                    square.isAlive = false;
                }
            }
        }
    },

    drawButtons() {
        
        ctx.strokeStyle = "#e63eff"
        ctx.fillStyle = "white";
        ctx.font = "18px sans-serif";
        
        //Start Button
        ctx.strokeRect(200, 680, 100, 28);
        if(Game.isRunning) {
            ctx.fillText("Stop", 230, 700);
        }
        else {
            ctx.fillText("Start", 230, 700);
        }

        //Next Step Button
        ctx.strokeRect(315, 680, 105, 28);
        ctx.fillText("Next Step", 330, 700);

        //Clear Button
        ctx.strokeRect(435, 680, 100, 28);
        ctx.fillText("Clear", 463, 700);
       
    },

    draw() {
        
        //Clear canvas
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        //Fill canvas
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        Game.drawButtons();
        
        //Check debug parameters
        if(Game.debug === true) {
            Game.printMousePos();
        }

        //Calculate time elapsed for purposed of limiting simulation speed.
        const endTime = Date.now();
        const timeElapsed = endTime - START;

        //Update gridState only after elapsed time for FPS
        if(Game.isRunning && timeElapsed > TIME_PER_FRAME) {
            Grid.gridState = Grid.nextState();
            START = Date.now();
        }

        Grid.updateGrid(Grid.gridState);
        window.requestAnimationFrame(Game.draw);
    },

}

const Grid = {

    //Array of GridSquare objects
    gridState: [],

    //Total area of the grid
    gridSize: 0,

    //Number of rows the grid contains
    rows: Math.sqrt(this.gridSize),

    //Size in pixels of each grid square
    squareSize: 0,

    setState(gridWidth, gridHeight) {

    },

    getState() {
        return this.gridState;
    },

    addSquare(gridSquare) {
        this.gridState.push(gridSquare);
    },

    initializeGrid(numOfRows) {
        //Check argument size is within parameters
        if(numOfRows < 10) {
            numOfRows = 10;
            window.alert("Minimum grid size is 10.");
        }
        else if(numOfRows > 30) {
            numOfRows = 30;
            window.alert("Max grid size is 30.");
        }

        //Set row and gridSize props
        this.gridSize = numOfRows * numOfRows;
        this.rows = numOfRows;

        //Calculate Square Size in pixels
        this.squareSize = Math.floor(600 / numOfRows);
        //console.log(this.squareSize);
        //console.log(this.rows + " " + this.gridSize);
        
        //Construct Grid
        ctx.strokeStyle = "white";
        
        //UL of entire grid
        let x = 75;
        let y = 20;

        for(let i = 0; i < numOfRows; i++) {
            for(let j = 0; j < numOfRows; j++) {
                const square = new GridSquare(x, y, this.squareSize, false);
                this.gridState.push(square);
                ctx.strokeRect(x, y, this.squareSize, this.squareSize);
                y += this.squareSize;
            }
            x += this.squareSize;
            y = 20;
        }
    },

    updateGrid(gridState) {
        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";
        for(let i = 0; i < gridState.length; i++) {
            if(gridState[i].isAlive) {
                ctx.fillRect(gridState[i].ULCoords.x, gridState[i].ULCoords.y, this.squareSize, this.squareSize);
            }
            else {
                ctx.strokeRect(gridState[i].ULCoords.x, gridState[i].ULCoords.y, this.squareSize, this.squareSize);
            }
        }
    },

    nextState() {
        const nextState = [];

        //Iterate through grid counting how many neighbors are alive for each square
        for(let i = 0; i < this.gridState.length; i++) {
            const currentSquare = this.gridState[i];
            const currentSquareState = currentSquare.isAlive;
            const neighborStates = this.getNeigborStates(i);
            let isAliveCount = 0;
            for(let isAlive of neighborStates) {
                if(isAlive) {
                    isAliveCount++;
                }
            }

            //Determine next square state using the 4 rules
            if(currentSquareState) {
                if(isAliveCount < 2 || isAliveCount > 3) {
                    //nextState.push(false);
                    nextState.push(new GridSquare(currentSquare.ULCoords.x, currentSquare.ULCoords.y, this.squareSize, false));
                }
                else {
                    //nextState.push(true);
                    nextState.push(new GridSquare(currentSquare.ULCoords.x, currentSquare.ULCoords.y, this.squareSize, true));
                }
            }
            else if(isAliveCount === 3) {
                //nextState.push(true);
                nextState.push(new GridSquare(currentSquare.ULCoords.x, currentSquare.ULCoords.y, this.squareSize, true));
            }
            else {
                nextState.push(currentSquare);
            }
        }

        return nextState;
    },

    //Returns an array containing the isAlive property of all neighbors of the given grid square index 
    getNeigborStates(index) {
        const neighborStates = [];
        const neighborIndexes = [];
        
        //UL
        if(index < this.rows || (index % this.rows) === 0) {
            neighborIndexes.push(-1);
        }
        else {
            neighborIndexes.push(index - this.rows - 1);
        }
        
        //UC
        if(index < this.rows) {
            neighborIndexes.push(-1);
        }
        else {
            neighborIndexes.push(index - this.rows);    
        }
        
        //UR
        if(index < this.rows || (index + 1) % this.rows === 0) {
            neighborIndexes.push(-1);
        }
        else {
            neighborIndexes.push(index - this.rows + 1)
        }
        
        //L
        if(index % this.rows === 0) {
            neighborIndexes.push(-1);
        }
        else {
            neighborIndexes.push(index - 1);
        }
        
        //R
        if((index + 1) % this.rows === 0) {
            neighborIndexes.push(-1);
        }
        else {
            neighborIndexes.push(index + 1);
        }
        
        //LL
        if(index > (this.gridSize - this.rows - 1) || index % this.rows === 0) {
            neighborIndexes.push(-1);
        }
        else {
            neighborIndexes.push(index + this.rows - 1);
        }

        //LC
        if(index > (this.gridSize - this.rows - 1)) {
            neighborIndexes.push(-1);
        }
        else {
            neighborIndexes.push(index + this.rows);
        }
        
        //LR
        if(index > (this.gridSize - this.rows - 1) || (index + 1) % this.rows === 0) {
            neighborIndexes.push(-1);
        }
        else {
            neighborIndexes.push(index + this.rows + 1);
        }
        
        //Set out of bound indexes to -1
        for(let i = 0; i < neighborIndexes.length; i++) {
            if(neighborIndexes[i] < 0 || neighborIndexes[i] >= this.gridSize) {
                neighborIndexes[i] = -1;
            }
        }
        //Get isAlive prop of each neighbor from neighborIndexes
       // console.log(neighborIndexes);
        for(let i of neighborIndexes) {
            if(i === -1) {
                neighborStates.push(false);
            }
            else {
                neighborStates.push(this.gridState[i].isAlive);
            }
        }
        return neighborStates;
    }

}

class GridSquare {

    ULCoords = {
        x: 0,
        y: 0
    };
    URCoords = {
        x: 0,
        y: 0
    };
    LRCoords = {
        x: 0,
        y: 0
    };
    LLCoords = {
        x: 0,
        y: 0
    };
    isAlive = false;

    constructor(x, y, squareSize, isAlive) {
        //Upper Left Coords
        this.ULCoords.x = x;
        this.ULCoords.y = y;

        //Upper Right Coords
        this.URCoords.x = x + squareSize;
        this.URCoords.y = y;

        //Lower Right Coords
        this.LRCoords.x = x + squareSize;
        this.LRCoords.y = y + squareSize;

        //Lower Left Coords
        this.LLCoords.x = x;
        this.LLCoords.y = y + squareSize;

        this.isAlive = isAlive;
    }

    setIsAlive(isAlive) {
        this.isAlive = isAlive;
    }

}

Game.initialize();