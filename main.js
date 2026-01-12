const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "HinataNendroid.png"

const GRAVITY = 0.045;
const BOUNCE = 0.7;
const FRICTION = 0.8;

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
    
    for (let box of boxes) {
        ctx.fillStyle = box.color;
        ctx.drawImage(img, box.x, box.y, box.width, box.height);
        console.log("the boox.image!!!")
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();