const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "HinataNendroid.png"

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
    {x: 100, y: 1, width: 50, height: 50, vx: 0, vy: 0, color: "blue", dragging: false},
    {x: 200, y: 1, width: 5, height: 5, vx: 0, vy: 0, color: "red", dragging: false},
]

function update() {
    // Apply gravity
    for (let box of boxes) {
        if (box === draggingBox) continue;

        box.vy += GRAVITY;
        box.y += box.vy;
        box.x += box.vx;

        //ground collision
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
}

function resolveAllCollisions() {
    for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
            resolveCollision(boxes[i], boxes[j]);
        }
    }
}

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "red";

    for (let box of boxes) {
        //ctx.strokeRect(box.x, box.y, box.width, box.height)
        ctx.fillStyle = box.color;
        ctx.drawImage(img, box.x, box.y, box.width, box.height);
    }
}

function loop() {
    update();
    resolveAllCollisions()
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
        const maxH = 100
        const minH = 400
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

/*
function isColliding(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}
*/

function resolveCollision(a, b) {
    if (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    ) {
        const percent = 0.8; //correction strength
        const slop = 0.5; //allowerd  penetration

        const correction = Math.max(overlapY - slop, 0) * percent;
        
        const axCenter = a.x  + a.width / 2;
        const ayCenter = a.y + a.height / 2;
        const bxCenter = b.x + b.width / 2;
        const byCenter = b.y + b.height / 2;

        const dx = axCenter - bxCenter;
        const dy = ayCenter - byCenter;

        const overlapX = (a.width / 2 + b.width / 2) - Math.abs(dx);
        const overlapY = (a.height / 2 + b.height / 2) - Math.abs(dx);
        
        if (overlapX < overlapY) {
            const push = overlapX / 2 * Math.sign(dx);
            if (!a.dragging) a.x += push;
            if (!b.dragging) b.x -= push;
        } else {
            const push = overlapY / 2 * Math.sign(dy);
            if (!a.dragging) a.y += push;
            if (!b.dragging) b.y -= push;
        }
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
