"use strict";
exports.__esModule = true;
exports.Controller = void 0;
var CreateElements = /** @class */ (function () {
    function CreateElements(root) {
        this.root = root;
        this.root.classList.add("snake---root");
        this.gridElement = document.createElement("div");
        this.gridElement.classList.add("snake---grid");
        this.newGameButton = document.createElement("div");
        this.newGameButton.classList.add("snake---new-game");
        this.newGameButton.innerText = "NEW GAME";
        this.root.appendChild(this.newGameButton);
        this.root.appendChild(this.gridElement);
        this.grid = [];
        for (var i = 0; i < 20; i++) {
            this.grid[i] = [];
            for (var j = 0; j < 20; j++) {
                this.square = document.createElement("div");
                this.square.classList.add("snake---square".concat(i, ".").concat(j));
                this.square.classList.add("snake---square");
                this.gridElement.appendChild(this.square);
                if (i == 0 || i == 19 || j == 0 || j == 19) {
                    this.square.classList.add("snake---border");
                }
                this.grid[i][j] = {
                    htmlElement: this.square,
                    hasSnakeOnSquare: false,
                    hasSnakeBody: false,
                    hasApple: false
                };
            }
        }
    }
    return CreateElements;
}());
var Board = /** @class */ (function () {
    function Board(grid, snakeList) {
        //  This is the 2d board array
        this.snakeList = snakeList;
        this.grid = grid;
    }
    Board.prototype.show = function () {
        var current = this.snakeList.tail;
        for (var i = 0; i < 20; i++) {
            for (var j = 0; j < 20; j++) {
                // Clear the board first
                this.grid[i][j].htmlElement.classList.remove("snake---square-on");
                this.grid[i][j].htmlElement.classList.remove("snake---has-apple");
                this.grid[i][j].hasSnakeOnSquare = false;
                this.grid[i][j].hasSnakeBody = false;
                // Show apple
                if (this.grid[i][j].hasApple) {
                    this.grid[i][j].htmlElement.classList.add("snake---has-apple");
                }
            }
        }
        // Show snake
        do {
            var x = current.x;
            var y = current.y;
            if (current.next != null) {
                this.grid[y][x].hasSnakeBody = true;
            }
            this.grid[y][x].htmlElement.classList.add("snake---square-on");
            this.grid[y][x].hasSnakeOnSquare = true;
            current = current.next;
        } while (current);
    };
    return Board;
}());
// Define a snake node
var SnakeNode = /** @class */ (function () {
    function SnakeNode(next, y, x) {
        this.next = next;
        this.x = x;
        this.y = y;
    }
    return SnakeNode;
}());
// Define linked list
var SnakeList = /** @class */ (function () {
    function SnakeList() {
        this.tail;
        this.head;
        this.body;
    }
    SnakeList.prototype.reset = function () {
    };
    return SnakeList;
}());
var GameFlow = /** @class */ (function () {
    function GameFlow(snakeList, root, board, grid, newGameButton, initializeSnake) {
        this.initializeSnake = initializeSnake;
        this.root = root;
        this.grid = grid;
        this.board = board;
        this.newGameButton = newGameButton;
        this.direction = "right";
        this.lastDirection = "";
        this.eventListeners();
        this.snakeList = snakeList;
        this.generateApple();
    }
    GameFlow.prototype.moveHead = function () {
        switch (this.direction) {
            case "left":
                this.snakeList.head.x -= 1;
                break;
            case "right":
                this.snakeList.head.x += 1;
                break;
            case "up":
                this.snakeList.head.y -= 1;
                break;
            case "down":
                this.snakeList.head.y += 1;
                break;
        }
    };
    GameFlow.prototype.moveBody = function () {
        var current = this.snakeList.tail;
        do {
            current.x = current.next.x;
            current.y = current.next.y;
            current = current.next;
        } while (current.next);
    };
    GameFlow.prototype.eatApple = function () {
        if (this.grid[this.snakeList.head.y][this.snakeList.head.x].hasApple) {
            this.addSnakeNode();
            this.grid[this.snakeList.head.y][this.snakeList.head.x].hasApple = false;
            console.log("WE RAN OVER AN APPLE");
            this.generateApple();
        }
    };
    GameFlow.prototype.randomNumber = function () {
        return Math.floor(Math.random() * 17) + 1;
    };
    GameFlow.prototype.generateApple = function () {
        var y = this.randomNumber();
        var x = this.randomNumber();
        if (!this.grid[y][x].hasSnakeOnSquare) {
            this.grid[y][x].hasApple = true;
        }
        else {
            this.generateApple();
        }
    };
    GameFlow.prototype.addSnakeNode = function () {
        this.snakeList.head.next = new SnakeNode(null, this.snakeList.head.y, this.snakeList.head.x);
        this.snakeList.head = this.snakeList.head.next;
    };
    GameFlow.prototype.checkForGameOver = function () {
        var x = this.snakeList.head.x;
        var y = this.snakeList.head.y;
        if (this.grid[y][x].hasSnakeBody || x > 18 || x < 1 || y > 18 || y < 1) {
            console.log("GAME OVER");
            clearInterval(this.turn);
            this.newGameButton.classList.remove("snake---hidden");
        }
    };
    GameFlow.prototype.changeTurn = function () {
        var _this = this;
        return this.turn = setInterval(function () {
            _this.lastDirection = _this.direction;
            _this.moveBody();
            _this.moveHead();
            _this.board.show();
            _this.eatApple();
            _this.checkForGameOver();
        }, 100);
    };
    GameFlow.prototype.eventListeners = function () {
        var _this = this;
        this.newGameButton.addEventListener("click", function () {
            _this.initializeSnake();
            _this.direction = "right";
            _this.changeTurn();
            _this.newGameButton.classList.add("snake---hidden");
        });
        document.addEventListener("keydown", function (event) {
            if (event.repeat)
                return;
            if (event.keyCode == 37 && _this.lastDirection != "right") {
                _this.direction = "left";
            }
            if (event.keyCode == 39 && _this.lastDirection != "left") {
                _this.direction = "right";
            }
            if (event.keyCode == 40 && _this.lastDirection != "up") {
                _this.direction = "down";
            }
            if (event.keyCode == 38 && _this.lastDirection != "down") {
                _this.direction = "up";
            }
            console.log(_this.direction);
        });
    };
    return GameFlow;
}());
var Controller = /** @class */ (function () {
    function Controller(root) {
        this.snakeList = new SnakeList();
        this.initializeSnake();
        this.createElements = new CreateElements(root);
        this.grid = this.createElements.grid;
        this.board = new Board(this.grid, this.snakeList);
        this.gameFlow = new GameFlow(this.snakeList, root, this.board, this.grid, this.createElements.newGameButton, this.initializeSnake);
    }
    Controller.prototype.initializeSnake = function () {
        this.snakeList.head = new SnakeNode(null, 4, 4);
        this.snakeList.body = new SnakeNode(this.snakeList.head, 4, 3);
        this.snakeList.tail = new SnakeNode(this.snakeList.body, 4, 2);
    };
    return Controller;
}());
exports.Controller = Controller;
var ROOT = document.getElementById("snake");
var SNAKE = new Controller(ROOT);
