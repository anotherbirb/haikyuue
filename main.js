const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "HinataNendroid.png"

const GRAVITY = 0.2;
const BOUNCE = 0.7;
const FRICTION = 0.8;

let draggingBox = null;
let lastMouseX = 0;
let lastMouseY = 0;

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
    {x: 100, y: 1, width: 50, height: 50, vx: 0, vy: 0, color: "blue"},
    {x: 200, y: 1, width: 5, height: 5, vx: 0, vy: 0, color: "red"},
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
            box.vx *= 98;
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
/* MY CODE
canvas.addEventListener("mousedown", (e) => {
    if (!draggingBox) return;

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
            box.vx = 0;
            box.vy = 0;
            lastMouseX = mouseX
            lastMouseY = mouseY
            break;
        }
    }    

});

canvas.addEventListener("mousemove", (e) => {
    if (!draggingBox) return;
    
    const rect = canvas.getBoundingClientRect;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    draggingBox.x += mouseX - lastMouseX;
    draggingBox.y += mouseY - lastMouseY;

    lastMouseX = mouseX;
    lastMouseY = mouseY;
});

canvas.addEventListener("mouseup", (e) => {
    if (!draggingBox) return;
    
    const rect = canvas.getBoundingClientRect;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    //velocy = change in position
    draggingBox.vx = (mouseX - lastMouseX) * 0.8
    draggingBox.vy = (mouseY - lastMouseY) * 0.8

    draggingBox = null;;

});
*/

canvas.addEventListener("mousedown", (e) => {
  
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    console.log("mouse:", e.offsetX, e.offsetY)

    for (let box of boxes) {
        console.log(
            "checking box",
            box.x, box.y, box.width, box.height,
            "mouse",
            e.offsetX, e.offsetY,
        )
        console.log("box y:", box.y)
        if (
            mouseX >= box.x &&
            mouseX <= box.x + box.width &&
            mouseY >= box.y &&
            mouseY <= box.y + box.height
        ) {
            console.log("mouse DOWN INSIDE THE BOX");
            draggingBox = box;
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

    lastMouseX = mouseX;
    lastMouseY = mouseY;
});

canvas.addEventListener("mouseup", (e) => {
    if (!draggingBox) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // velocity = change in position
    draggingBox.vx = (mouseX - lastMouseX) * 0.8;
    draggingBox.vy = (mouseY - lastMouseY) * 0.8;

    draggingBox = null;
});

//a