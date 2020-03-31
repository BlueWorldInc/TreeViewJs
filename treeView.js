var canvas = document.getElementById('canvas');
/** @type {CanvasRenderingContext2D} */
var ctx = canvas.getContext('2d');
// ctx.fillStyle = '#ff6';
// ctx.fillRect(0, 0, 900, 600);
// ctx.clearRect(0, 0, 300, 300);

var mode = "add";

var mouseDownMove = {
    startx: 0,
    starty: 0,
    endx: 0,
    endx: 0,
    diffx: 0,
    diffy: 0,
}

function make_base(x = 0, y = 0, width = 100, height = 100)
{
  base_image = new Image();
  base_image.src = 'img/sea.jpg';
  base_image.onload = function(){
    ctx.drawImage(base_image, x, y, dWidth = width, dHeight = height);
  }
}

class texture {

    constructor(link) {
        this.link = link;
    }

    drawImage(x = 0, y = 0, width = 100, height = 100) {
        var base_image = new Image();
        base_image.src = this.link;
        base_image.onload = function(){
            ctx.drawImage(base_image, x, y, base_image.dWidth = width, base_image.dHeight = height);
          
        }
    }

}

class map {

    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.nodeList = [];
        this.lastSelectedNode;
        this.panel;
    }

    addNode(node) {
        this.nodeList.push(node);
    }

    addPanel(panel) {
        this.panel = panel;
    }

    drawMap() {
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    drawNodes() {
        for (var i = 0; i < this.nodeList.length; i++) {
            this.nodeList[i].drawNode();
            // this.drawNode(this.nodeList[i].x, this.nodeList[i].y, this.nodeList[i].width, this.nodeList[i].height, this.nodeList[i].color);
        }
        this.panel.drawPanel();
    }

    // drawPanel() {
    //     ctx.beginPath();
    //     ctx.fillStyle = this.panel.color;
    //     ctx.fillRect(this.panel.x, this.panel.y, this.panel.width, this.panel.height);
    //     this.panel.drawButtons();
    // }

    // drawNode(x, y, width, height, color) {
    //     ctx.beginPath();
    //     ctx.fillStyle = color;
    //     ctx.fillRect(x, y, width, height);
    // }

    isHovered(evt, node) {
        var mouseX = getMousePos(canvas, evt).x;
        var mouseY = getMousePos(canvas, evt).y;
        if (mouseX >= node.x && mouseX <= (node.x + node.width) && mouseY >= node.y && mouseY <= (node.y + node.height)) {
            return true;
        } else {
            return false;
        }
    }

    getSelectedNode(evt) {
        for (var i = 0; i < this.nodeList.length; i++) {
            if (this.isHovered(evt, this.nodeList[i]) === true) {
                return this.nodeList[i];
            }
        }
        return false;
    }

    selectNode(evt) {
        var hoveredNode = this.getSelectedNode(evt);
        if (hoveredNode !== false) {
            // if (this.isHovered(evt, hoveredNode)) {
            // if (hoveredNode.selected) {
            hoveredNode.selectNode();
            this.drawMap();
            this.drawNodes();
            if (hoveredNode.selected) {
                this.lastSelectedNode = hoveredNode;
            }
            // } else {
            // hoveredNode.selectNode();
            // }
            // }

        }
    }

}

class node {

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = "yellow";
        this.selected = false;
        // drawSquare(x, y, width);
    }

    moveNode(x, y) {
        if (this.selected) {
            this.x = x;
            this.y = y;
            this.selected = false;
        }
    }

    changeColor(color) {
        this.color = color;
    }

    selectNode() {
        if (this.selected === true) {
            this.selected = false;
            // this.drawNode();
        } else {
            this.selected = true;
            // this.strokeNode();
        }
    }

    strokeNode() {
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 5;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    drawNode(x = this.x, y = this.y) {
        if (this.selected) {
            this.strokeNode();
        }
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, this.width, this.height);
    }

}

class button extends node {

    constructor(x, y, width, height) {
        super(x, y, width, height);
    }

    drawButton(offSetX, offSetY) {
        this.drawNode((this.x + offSetX), (this.y + offSetY));
    }

}



class panel {

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = "grey";
        this.buttonsList = [];
        this.texture;
    }

    addButton(button) {
        this.buttonsList.push(button);
    }

    addTexture(texture) {
        this.texture = texture;
        // this.texture.drawImage();
    }

    drawPanel() {
        var gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, 'yellow');
        gradient.addColorStop(1, 'brown');
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        var base_image = new Image();
        base_image.src = 'img/sea.jpg';
        base_image.xx = this.x
        base_image.yx = this.y
        base_image.width = this.width
        base_image.height = this.height
        base_image.onload = function(){
          ctx.drawImage(base_image, this.xx, this.yx, base_image.dWidth = this.width, base_image.dHeight = this.height);
        }
        this.drawButtons();
    }

    drawButtons() {
        for (var i = 0; i < this.buttonsList.length; i++) {
            this.buttonsList[i].drawButton(this.x, this.y);
        }
    }

}

var firstMap = new map(0, 0, 900, 600, "blue");
var firstRect = new node(30, 30, 60, 60);
var secondRect = new node(130, 80, 60, 60);
var firstButton = new button(90, 180, 60, 60);
var firstTexture = new texture("img/sea.jpg");
secondRect.changeColor("orange");
var firstPanel = new panel(600, 0, 300, 600);
firstMap.addNode(firstRect);
firstMap.addNode(secondRect);
firstMap.addPanel(firstPanel);
firstPanel.addButton(firstButton);
firstPanel.addTexture(firstTexture);
// firstMap.addNode(firstButton);
firstMap.drawMap();
firstMap.drawNodes();


canvas.addEventListener('keydown', function (event) {
    const keys = event.key; // "a", "1", "Shift", etc.
    var displayArea = document.getElementById('coordinateDisplay');
    // alert(keys);
    displayArea.innerHTML = keys;
    switchMode(keys);
});

function showCoords(evt) {
    var displayArea = document.getElementById('coordinateDisplay');
    // displayArea.innerHTML =       "clientX value: " + evt.clientX + "\n" + "clientY value: " + evt.clientY + "\n";
    displayArea.innerHTML = getMousePos(canvas, evt).x + " " + getMousePos(canvas, evt).y;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

    return {
        x: Math.floor((evt.clientX - rect.left) * scaleX),   // scale mouse coordinates after they have
        y: Math.floor((evt.clientY - rect.top) * scaleY)     // been adjusted to be relative to element
    }
}

function drawSquare(x, y, size, color = "red") {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
}

function drawRect(x, y, width, height, color = "red") {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, size, color = "red") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
}

function drawCircleOnEvent(evt) {
    ctx.clearRect(0, 0, 900, 900);
    ctx.fillStyle = '#ff6';
    ctx.fillRect(0, 0, 900, 600);
    drawCircle(getMousePos(canvas, evt).x, getMousePos(canvas, evt).y, 50);
}

function drawSquareOnEvent(evt) {
    endMouseDownMove(evt);
    if (mode === "select" || mode === "wait") {
        // firstMap.nodeList[0].changeColor("grey");
        firstMap.selectNode(evt);
        firstMap.drawNodes();
    } else if (mode === "resize") {
        firstMap.lastSelectedNode.width += mouseDownMove.diffx;
        firstMap.lastSelectedNode.height += mouseDownMove.diffy;
        console.log(mouseDownMove);
        firstMap.drawMap();
        firstMap.drawNodes();
    } else {
        ctx.clearRect(0, 0, 900, 900);
        ctx.fillStyle = '#ff6';
        ctx.fillRect(0, 0, 900, 600);
        // firstMap.nodeList[0].changeColor("yellow");
        // firstMap.addNode(firstRect);
        // firstMap.addNode(firstRect);
        firstMap.drawMap();
        if (firstMap.lastSelectedNode !== undefined) {
            firstMap.lastSelectedNode.moveNode(getMousePos(canvas, evt).x, getMousePos(canvas, evt).y)
        }
        firstMap.drawNodes();
        // drawSquare(getMousePos(canvas, evt).x, getMousePos(canvas, evt).y, 50);
    }
}

// function displayKeyPressed(evt) {
//     var displayArea = document.getElementById('keyPressedDisplay');
//     evt.
//     displayArea.innerHTML = getMousePos(canvas, evt).x + " " + getMousePos(canvas, evt).y;
// }

// function myKeyPress(e) {
//     // var keynum;
//     // keynum = e;

//     // alert(String.fromCharCode(keynum));
//     alert("he");
// }

function switchMode(key) {
    if (key === "e") {
        mode = "erase"
    } else if (key === "a") {
        mode = "add";
    } else if (key === "s") {
        mode = "select";
    } else if (key === "r") {
        mode = "resize";
    } else {
        mode = "wait";
    }
}

function startMouseDownMove(evt) {
    mouseDownMove.startx = getMousePos(canvas, evt).x;
    mouseDownMove.starty = getMousePos(canvas, evt).y;
}

function endMouseDownMove(evt) {
    mouseDownMove.endx = getMousePos(canvas, evt).x;
    mouseDownMove.endy = getMousePos(canvas, evt).y;
    mouseDownMove.diffx = mouseDownMove.endx - mouseDownMove.startx;
    mouseDownMove.diffy = mouseDownMove.endy - mouseDownMove.starty;

}

// class car {
//     constructor(marque, chevaux, vitesseMax) {
//         this.marque = marque;
//         this.chevaux = chevaux;
//         this.vitesseMax = vitesseMax;
//         numberOfCarCreated++;
//     }
// }
// var cars = [];
// var bmwX5 = new car ("bmw", 150, 230);
// var golf7 = new car ("vw", 90, 210);
// var clio4 = new car ("renault", 70, 190);
// cars.push(bmwX5, golf7, clio4);
// console.log(cars);