let gameRunning = false;
let keys = {};

let player = {
    x: 100,
    y: 100,
    width: 45,
    height: 55,
    vx: 0,
    vy: 0,
    speed: 4,
    jump: 11,
    grounded: false
};

let score = 0;

document.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;

    if (e.key === " " || e.key === "arrowup") {
        e.preventDefault();
    }
});

document.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
});


function startGame() {

    gameRunning = true;

    score = 0;

    const playerObject =
        objects.find(o => o.type === "player");

    if (playerObject) {
        player.x = playerObject.x;
        player.y = playerObject.y;
    } else {
        player.x = 100;
        player.y = 100;
    }

    requestAnimationFrame(gameLoop);
}


function gameLoop() {

    if (!gameRunning) return;

    updateGame();

    drawGame();

    requestAnimationFrame(gameLoop);
}


function updateGame() {

    /* Movement */

    player.vx = 0;

    if (keys["arrowleft"] || keys["a"]) {
        player.vx = -player.speed;
    }

    if (keys["arrowright"] || keys["d"]) {
        player.vx = player.speed;
    }


    /* Jump */

    if (
        (keys["arrowup"] ||
        keys["w"] ||
        keys[" "]) &&
        player.grounded
    ) {

        player.vy = -player.jump;

        player.grounded = false;
    }


    /* Gravity */

    player.vy += 0.5;


    /* Horizontal */

    player.x += player.vx;


    /* Vertical */

    player.y += player.vy;

    player.grounded = false;


    /* Platform collision */

    objects
        .filter(o => o.type === "platform")
        .forEach(platform => {

            if (isColliding(player, platform)) {

                if (
                    player.vy > 0 &&
                    player.y + player.height -
                    player.vy <= platform.y
                ) {

                    player.y =
                        platform.y - player.height;

                    player.vy = 0;

                    player.grounded = true;
                }
            }

        });


    /* Coins */

    objects
        .filter(o => o.type === "coin")
        .forEach(coin => {

            if (isColliding(player, coin)) {

                coin.collected = true;

                score++;

            }

        });


    /* Remove collected coins */

    objects = objects.filter(o => {
        return !(o.type === "coin" && o.collected);
    });


    /* Enemy */

    objects
        .filter(o => o.type === "enemy")
        .forEach(enemy => {

            if (isColliding(player, enemy)) {

                restartGame();

            }

        });


    /* Goal */

    objects
        .filter(o => o.type === "goal")
        .forEach(goal => {

            if (isColliding(player, goal)) {

                gameRunning = false;

                alert(
                    "🎉 LEVEL COMPLETE!\n\n" +
                    "Score: " + score
                );

                draw();

            }

        });


    /* Fell from map */

    if (player.y > canvas.height + 100) {
        restartGame();
    }


    /* Boundaries */

    player.x = Math.max(
        0,
        Math.min(
            canvas.width - player.width,
            player.x
        )
    );
}


function isColliding(a, b) {

    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );

}


function restartGame() {

    player.x = 100;
    player.y = 100;

    player.vx = 0;
    player.vy = 0;

}


function drawGame() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* Draw objects */

    objects.forEach(object => {

        ctx.fillStyle =
            colors[object.type];

        ctx.fillRect(
            object.x,
            object.y,
            object.width,
            object.height
        );

    });


    /* Player */

    ctx.fillStyle = "#4f8cff";

    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );


    /* Score */

    ctx.fillStyle = "white";

    ctx.font = "22px Arial";

    ctx.fillText(
        "⭐ Score: " + score,
        20,
        35
    );

                     }
