var canvas = document.getElementById('canvas');
/** @type {CanvasRenderingContext2D} */
var ctx = canvas.getContext('2d');
// ctx.fillStyle = '#ff6';
// ctx.fillRect(0, 0, 900, 600);
// ctx.clearRect(0, 0, 300, 300);
const WIDTH = canvas.width;
const HEIGHT = canvas.height;


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

class Texture {

    constructor(link) {
        this.link = link;
        this.base_image = new Image();
        this.base_image.src = link;
    }

    /*
    var base_image = new Image();
    base_image.src = 'img/sea.jpg';
    base_image.xx = this.x
    base_image.yx = this.y
    base_image.width = this.width
    base_image.height = this.height
    ctx.drawImage(base_image, base_image.xx, base_image.yx, base_image.dWidth = this.width, base_image.dHeight = this.height);
    */

   drawTexture(x = 0, y = 0, width = 100, height = 100) {
        //base_image.onload = function() {
        ctx.drawImage(this.base_image, x, y, this.base_image.dWidth = width, this.base_image.dHeight = height);
        //}
    }

}

class Text {
    constructor(text, color = "yellow") {
        this.text = text;
        this.color = color;
    }

    drawText(x, y) {
        ctx.fillText(this.text, x, y);
    }

    changeText(text) {
        this.text = text;
    }

    changeFont(font) {
        ctx.font = font;
    }

    changeColor(color) {
        this.color = color;
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
        this.drawableArea = {width: this.width, height: this.height};
        this.texture;
        //to be replaced by tree
        this.link;
        this.tree;
    }

    addNode(node) {
        this.nodeList.push(node);
    }

    addPanel(panel) {
        this.resizeDrawableArea(this.width - panel.width);
        this.panel = panel;
    }

    addTexture(texture) {
        this.texture = texture;
    }

    addLink(link) {
        this.link = link;
    }

    addTree(tree) {
        this.tree = tree;
    }

    deleteNode(evt) {
        if (this.isHovered(evt, this.nodeList[this.nodeList.length - 1])) {
            this.nodeList.pop();
        } else {
            console.log("nope");
        }
    }

    drawMap() {
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.beginPath();
        // ctx.fillStyle = this.color;
        ctx.fillStyle = "rgb(203, 169, 124)";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        this.drawTexture();
        this.drawNodes();
        this.drawPanel();
        // this.drawLink();
        this.drawTree();
    }

    drawPanel() {
        this.panel.drawPanel();
    }

    drawNodes() {
        for (var i = 0; i < this.nodeList.length; i++) {
            this.nodeList[i].drawNode();
        }
    }

    drawTexture() {
        this.texture.drawTexture(this.x, this.y, this.drawableArea.width, this.height);
    }

    drawLink() {
        this.link.drawFrom(this.nodeList[0]);
        this.link.drawTo(this.nodeList[1]);
        this.link.drawLink();
    }

    drawTree() {
        this.tree.drawTree();
    }

    moveNode(node, x, y) {
        if (x <= this.drawableArea.width) {
            node.moveNode(x, y);
        }
    }

    moveTree(x, y) {
        this.tree.moveTree(x, y);
    }

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
                var hNode = this.nodeList[i];
                this.nodeList.splice(i, 1);
                this.nodeList.push(hNode);
                return hNode;
            }
        }
        for (var i = 0; i < this.tree.nodeList.length; i++) {
            if (this.isHovered(evt, this.tree.nodeList[i]) === true) {
                var hNode = this.tree.nodeList[i];
                this.tree.nodeList.splice(i, 1);
                this.tree.nodeList.push(hNode);
                return hNode;
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

    resizeDrawableArea(newWidth, newHeight = this.height) {
        this.drawableArea.width = newWidth;
        this.drawableArea.height = newHeight;
    }

}

class Tree {

    constructor() {
        this.nodeList = [];
        this.defaultTree();
    }

    defaultTree() {
        let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"];
        let x = 260;
        let y = HEIGHT / 2;
        let text = new Text(letters[0], "blue");
        let node = new RoundNode (x, y - 150, 60, 60);
        node.setIdText(text);
        this.nodeList.push(node);
        for (let i = 0; i < 7; i++) {
            x = 50 + (i * 80);
            text = new Text(letters[i], "blue");
            node = new RoundNode (x, y - 30, 60, 60);
            node.setIdText(text);
            text = new Text(letters[i + 7], "blue");
            this.nodeList.push(node);
            node = new RoundNode (x, y + 70, 60, 60);
            node.setIdText(text);
            this.nodeList.push(node);
        }
    }

    drawTree() {
        for (let i = 0; i < this.nodeList.length; i++) {
            this.nodeList[i].drawNode();
        }
    }

    moveTree(x, y) {
        let baseX = this.nodeList[0].x;
        let baseY = this.nodeList[0].y;
        for (let i = 0; i < this.nodeList.length; i++) {
            this.nodeList[i].selected = true;
        }
        this.nodeList[0].moveNode(x, y);
        for (let i = 1; i < this.nodeList.length; i++) {
            this.nodeList[i].moveNode(this.nodeList[i].x + x - baseX, this.nodeList[i].y + y - baseY);
        }
        for (let i = 0; i < this.nodeList.length; i++) {
            // this.nodeList[i].selectNode();
        }
        this.drawTree();
        this.treeSelector();
    }

    treeSelector() {
        let selectorDimension = {minX: this.nodeList[0].x, maxX: 0, minY: this.nodeList[0].y, maxY:0};
        for (let i = 0; i < this.nodeList.length; i++) {
            if (this.nodeList[i].x < selectorDimension.minX) {
                selectorDimension.minX = this.nodeList[i].x;
            }
            if (this.nodeList[i].x > selectorDimension.maxX) {
                selectorDimension.maxX = this.nodeList[i].x + this.nodeList[i].width;
            }
            if (this.nodeList[i].y < selectorDimension.minY) {
                selectorDimension.minY = this.nodeList[i].y;
            }
            if (this.nodeList[i].y > selectorDimension.maxY) {
                selectorDimension.maxY = this.nodeList[i].y + this.nodeList[i].height;
            }
        }
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 5;
        ctx.rect(selectorDimension.minX, selectorDimension.minY, selectorDimension.maxX - selectorDimension.minX, selectorDimension.maxY - selectorDimension.minY);
        ctx.stroke();
    }

}

class Node {

    constructor(x, y, width, height, value = 100, color = "yellow") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.selected = false;
        // drawSquare(x, y, width);
        this.idText;
        this.value = value;
        this.random();
        this.sonList = [];
    }

    random() {
        this.value += Math.floor(Math.random() * 100);
    }

    setIdText(idText) {
        this.idText = idText;
    }
    
    changeColor(color) {
        this.color = color;
    }
    
    addSon(son) {
        this.sonList.push(son);
    }
    
    moveNode(x, y) {
        if (this.selected) {
            this.x = (x) - (this.width / 2);
            this.y = (y) - (this.height / 2);
      //      this.selected = false;
        }
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
        if (this.idText !== undefined) {
            this.drawIdText();
        }
    }

    drawIdText() {
        ctx.save();
        ctx.fillStyle = "blue";
        // ctx.font = "20px serif";
        let lineHeight = ctx.measureText('M').width;
        console.log(lineHeight);
        
        // this.idText.drawText((this.width / 2) + this.x, (this.height / 2) + this.y);
        this.idText.drawText((this.width / 5) + this.x, this.y + lineHeight);
        ctx.restore();
    }

}

class RoundNode extends Node {

    constructor(x, y, width, height, value = 100, color = "yellow") {
        super(x, y, width, height, value = value, color = color);
    }

    strokeNode(x = this.x, y = this.y) {
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 5;
        ctx.arc(x + (this.width / 2), y + (this.height / 2), this.width / 2, 0, 2 * Math.PI);
        ctx.stroke();
    }

    drawNode(x = this.x, y = this.y) {
        if (this.selected) {
            this.strokeNode();
        }
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(x + (this.width / 2), y + (this.height / 2), this.width / 2, 0, 2 * Math.PI);
        ctx.fill();
        if (this.idText !== undefined) {
            this.drawIdText();
        }
    }

}

class button extends Node {

    constructor(x, y, width, height) {
        super(x, y, width, height);
    }

    drawButton(offSetX, offSetY) {
        this.drawNode((this.x + offSetX), (this.y + offSetY));
    }

}

class Link {

    constructor(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.lineWidth = "4";
        this.color = "dimgray";
    }

    drawLink() {
        let oldLineWidth = ctx.lineWidth;
        let oldColor = ctx.strokeStyle;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.bezierCurveTo(230, 150, 30, 80, this.endX, this.endY);
        ctx.stroke();
        ctx.lineWidth = oldLineWidth;
        ctx.strokeStyle = oldColor;
    }

    drawFrom(node) {
        this.startX = node.x + Math.round(node.width / 2);
        this.startY = node.y + node.height;
    }

    drawTo(node) {
        this.endX = node.x + Math.round(node.width / 2);
        this.endY = node.y;
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
        this.text;
    }

    addButton(button) {
        this.buttonsList.push(button);
    }

    addTexture(texture) {
        this.texture = texture;
        // this.texture.drawImage();
    }

    addText(text) {
        this.text = text;
    }

    drawTexture() {
        this.texture.drawTexture(this.x, this.y, this.width, this.height);
    }

    drawText(x = 0, y = 0) {
        ctx.fillStyle = this.text.color;
        this.text.drawText(this.x + x, this.y + y);
    }

    drawPanel() {
       /* var gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, 'yellow');
        gradient.addColorStop(1, 'brown');
        ctx.beginPath();
        ctx.fillStyle = gradient;*/
        ctx.beginPath();
        ctx.fillStyle = "rgb(136, 89, 45)";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        this.drawTexture();
        this.drawButtons();
        this.drawText(20, 50);
    }

    drawButtons() {
        for (var i = 0; i < this.buttonsList.length; i++) {
            this.buttonsList[i].drawButton(this.x, this.y);
        }
    }

    changeText(newText) {
        this.text.changeText(newText);
    }

}

var firstMap = new map(0, 0, 900, 600, "blue");
var firstRect = new Node(30, 30, 60, 60);
var secondRect = new Node(130, 80, 60, 60);
var thirdRect = new Node(130, 80, 60, 60);
// console.log(thirdRect);
var firstButton = new button(90, 180, 60, 60);
var firstTexture = new Texture("img/bg_01_02.png");
var secondTexture = new Texture("img/bg_01_02.png");
secondRect.changeColor("orange");
var firstPanel = new panel(600, 0, 300, 600);
var firstText = new Text("Hellow");
var firstLink = new Link(50, 50, 300, 300);
let firstTree = new Tree();
let secondText = new Text("A", "blue");
// canvas.focus();
firstText.changeFont("48px serif");
firstText.changeColor("red");
firstMap.addNode(firstRect);
firstMap.addNode(secondRect);
firstMap.addPanel(firstPanel);
firstMap.addTexture(secondTexture);
firstMap.addLink(firstLink);
firstPanel.addButton(firstButton);
firstPanel.addTexture(firstTexture);
firstPanel.addText(firstText);
firstLink.drawFrom(firstRect);
firstLink.drawTo(secondRect);
firstMap.addTree(firstTree);
// firstMap.addNode(firstButton);
firstMap.drawMap();
firstTexture.base_image.onload = function() {
    firstTexture.drawTexture(firstPanel.x, firstPanel.y, firstPanel.width, firstPanel.height);
    firstPanel.drawButtons();
    firstPanel.drawText(20, 50);
}
secondTexture.base_image.onload = function() {
    secondTexture.drawTexture(firstMap.x, firstMap.y, firstMap.drawableArea.width, firstMap.height);
    firstMap.drawMap();
}
//console.log(firstText.text.complete);
firstMap.drawNodes();
firstLink.drawLink();
mode = "wait";


canvas.addEventListener('keydown', function (event) {
    const keys = event.key; // "a", "1", "Shift", etc.
    var displayArea = document.getElementById('coordinateDisplay');
    // alert(keys);
    displayArea.innerHTML = keys;
    switchMode(keys);
});

var c = 0;
var er = 0;
//setInterval(d, 10);

//while (c < 100) {
  //  c++;
    //d();
//}
function d() {
    firstMap.drawMap();
    console.log(++er);
}

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

function startMouseMove(evt) {
    if (mode === "select" || mode === "wait") {
        if (firstMap.lastSelectedNode !== undefined) {
            firstMap.moveNode(firstMap.lastSelectedNode, getMousePos(canvas, evt).x, getMousePos(canvas, evt).y);
            firstPanel.changeText(firstMap.lastSelectedNode.value);
        }
        firstMap.drawMap();
    }
}

function drawSquareOnEvent(evt) {
    endMouseDownMove(evt);
    if (mode === "select" || mode === "wait") {
        firstMap.selectNode(evt);
        if (firstMap.lastSelectedNode !== undefined) {
            firstMap.moveNode(firstMap.lastSelectedNode, getMousePos(canvas, evt).x, getMousePos(canvas, evt).y);
            firstPanel.changeText(firstMap.lastSelectedNode.value);
        }
        firstMap.drawMap();
    } else if (mode === "resize") {
        firstMap.lastSelectedNode.width += mouseDownMove.diffx;
        firstMap.lastSelectedNode.height += mouseDownMove.diffy;
        console.log(mouseDownMove);
        firstMap.drawMap();
        firstMap.drawNodes();
    } else if (mode === "add") {
        firstMap.addNode(new Node(getMousePos(canvas, evt).x, getMousePos(canvas, evt).y, 60, 60));
        firstMap.drawMap();
    } else if (mode === "erase") {
        firstMap.selectNode(evt);
        firstMap.deleteNode(evt);
        firstMap.drawMap();
    } else if (mode === "moveTree") {
        firstMap.moveTree(getMousePos(canvas, evt).x, getMousePos(canvas, evt).y);
        firstMap.drawMap();
        firstMap.tree.treeSelector();
    }
    
    
    /*else {
        ctx.clearRect(0, 0, 900, 900);
        ctx.fillStyle = '#ff6';
        ctx.fillRect(0, 0, 900, 600);
        // firstMap.nodeList[0].changeColor("yellow");
        // firstMap.addNode(firstRect);
        // firstMap.addNode(firstRect);
        if (firstMap.lastSelectedNode !== undefined) {
            firstMap.lastSelectedNode.moveNode(getMousePos(canvas, evt).x, getMousePos(canvas, evt).y)
        }
        firstMap.drawMap();
//        firstMap.drawNodes();
        // drawSquare(getMousePos(canvas, evt).x, getMousePos(canvas, evt).y, 50);
    }*/
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
    } else if (key === "t") {
        mode = "moveTree";
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}