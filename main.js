const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const Hinata = new Image();
Hinata.src = "HinataNendroid.png"
const Kageyama  = new Image();
Kageyama.src = "KageyamaNendroid.png"


const GRAVITY = 0.35;
const BOUNCE = 0.7;
const FRICTION = 0.8;

let draggingBox = null;
let lastMouseX = 0;
let lastMouseY = 0;

let prevMouseX = 0;
let prevMouseY = 0;
let mouseVX = 0;
let mouseVY = 0;

let velocityXmine = 0;
let velocityYmine = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/*
const box = {
    x: 100,
    y: 1,
    width: 5,
    height: 5,
    vx: 0,
    vy: 0,
    color: "blue",
};
*/

const boxes = [
    //image insert when ok
    {image: Hinata, x: 100, y: 1, width: 150, height: 150, vx: 0, vy: 0, color: "blue", dragging: false},
    {image: Hinata, x: 200, y: 1, width: 50, height: 50, vx: 0, vy: 0, color: "red", dragging: false},
]

function update() {
    boxes.forEach(box => {
        if (box !== draggingBox) {
            updateBox(box);
        }
    })

    if (!draggingBox) {
        for (let i = 0; i < boxes.length; i++) {
            for (let j = i + 1; j < boxes.length; j++) {
                if (isColliding(boxes[i], boxes[j])) {
                    console.log(boxes[i].y, boxes[j].y, "boxoes i and j and their y")
                    resolveCollision(boxes[i], boxes[j]);
                    
                }
            }
        }
    }
}

function updateBox(box) {
    box.vy += GRAVITY;
    box.x += box.vx;
    box.y += box.vy;

    //floooorrrr colision
    if (box.y + box.height > canvas.height) {
        box.y = canvas.height - box.height;
        box.vy = -box.vy * BOUNCE;
        box.vx *= FRICTION;
    }
        //side collision
    if (box.x < 0 ||box.x + box.width > canvas.width) {
        box.vx = -box.vx;
    }
        //FRICTION
    if (box.y + box.height >= canvas.height) {
        box.vx *= 0.98;
    }

}

function resolveAllCollisions() {
    for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
        console.log(isColliding(boxes[i], boxes[j]))
        if (isColliding(boxes[i], boxes[j])) {
            resolveCollision(boxes[i], boxes[j]);
        }
        }
    }
}

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "red";

    for (let box of boxes) {
        //ctx.strokeRect(box.x, box.y, box.width, box.height)
        ctx.fillStyle = box.color;
        ctx.drawImage(box.image, box.x, box.y, box.width, box.height);
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();


function randomizeBox() {
    for (let box of boxes)  {
        const maxX = canvas.width - box.width
        const minX = 0
        const maxY = 0
        const minY = canvas.height - box.height
        const maxH = 50
        const minH = 500
        const maxW = 10
        const minW = 5
        box.x = Math.floor(Math.random() * (maxX - minX + 1)) + minX
        box.y = Math.floor(Math.random() * (maxY - minY + 1)) + minY
        box.vy = 0
        box.height = Math.floor(Math.random() * (maxH - minH + 1)) + minH
        box.width = box.height
    }
}

canvas.addEventListener("mousedown", (e) => {
  
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (let box of boxes) {
        if (
            mouseX >= box.x &&
            mouseX <= box.x + box.width &&
            mouseY >= box.y &&
            mouseY <= box.y + box.height
        ) {
            draggingBox = box;
            box.dragging = true
            box.vx = 0;
            box.vy = 0;
            lastMouseX = mouseX;
            lastMouseY = mouseY;
            break;
        }
    }
});



canvas.addEventListener("mousemove", (e) => {
    if (!draggingBox) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    draggingBox.x += mouseX - lastMouseX;
    draggingBox.y += mouseY - lastMouseY;

    

    velocityXmine = mouseX - lastMouseX;
    velocityYmine = mouseY - lastMouseY;
    lastMouseX = mouseX;
    lastMouseY = mouseY;

    //i think useless idk draggingBox.vx = mouseX - lastMouseX;
    //draggingBox.vy = mouseY - lastMouseY;

    /* tge chatgpt solution, open this up if i fail
    mouseVX = mouseX - prevMouseX;
    mouseVY = mouseY - prevMouseY;

    prevMouseX = mouseX;
    prevMouseY = mouseY;
    */

});

canvas.addEventListener("mouseup", (e) => {
    if (!draggingBox) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // velocity = change in position
    //CORRECTdraggingBox.vx = mouseVX;
    //CORRECTdraggingBox.vy = mouseVY;
    //mine vvvvv 
    draggingBox.vx = velocityXmine;
    draggingBox.vy = velocityYmine;
    draggingBox.dragging = false
    draggingBox = null;
});

function isColliding(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function resolveCollision(a, b) {
    const overlapY = 
        Math.min(a.y + a.height, b.y + b.height) -
        Math.max(a.y, b.y);
    
    console.log("resolving collision  rn, A AND B", a, b)

    if (a.y < b.y) {
        a.y -= overlapY / 2;
        b.y += overlapY / 2;
    } else {
        a.y += overlapY / 2;
        b.y -= overlapY / 2;
    }

    const temp = a.vy;
    a.vy = b.vy;
    b.vy = temp;
}

function getLocation() {
    for (let box of boxes) {
        console.log(box.x, box.y, "GET LOCATION")
    }
}

/*
likeee actually like kill me right now
if (overlapX < overlapY) {
            //horizontal  collision
            const sign = Math.sign(dx);
            const correctionX = overlapX * sign / 2;
            const correctionY = overlapY * sign / 2;

            if (a.dragging && !b.dragging) {
                //only move B
                b.x -= overlapX * sign;
                b.vx *= -0.6;
            } else if (b.dragging && !a.dragging) {
                //only move a
                a.x -= overlapX * sign;
                a.vx *= -0.6;
            } else {
                //neither or both drag(???) split cforrection
                a.x += correctionX;
                b.x -= correctionX;
                a.vx *= -0.6;
                b.vx *= -0.6;
            }
            
            
        } else {
            //vertical collisoin
            const sign = Math.sign(dy);
            const correctionX = overlapX * sign / 2;
            const correctionY = overlapY * sign / 2;
            if (a.dragging && !b.dragging) {
                //only move B
                b.y -= overlapY * sign;
                b.vy *= -0.9;
            } else if (b.dragging && !a.dragging) {
                //only move a
                a.y -= overlapY * sign;
                a.vy *= -0.9;
            } else {
                //neither or both drag(???) split cforrection
                a.y += correctionY;
                b.y -= correctionY;
                a.vy *= -0.9;
                b.vy *= -0.9;
            }
        }

        if (a.dragging || b.dragging) {

        }
*/
