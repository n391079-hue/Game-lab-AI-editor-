const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d");


let objects = [];

let selectedObject = null;

let dragging = false;

let zoom = 1;

let events = [];


const colors = {

    player: "#4f8cff",

    platform: "#36b37e",

    enemy: "#ff5252",

    coin: "#ffd43b",

    goal: "#a855f7"

};


const sizes = {

    player: [45, 55],

    platform: [100, 35],

    enemy: [45, 45],

    coin: [30, 30],

    goal: [50, 60]

};


/* =========================
   CREATE OBJECT
========================= */

document.querySelectorAll(".object-btn")
.forEach(button => {

    button.addEventListener("click", () => {

        const type = button.dataset.type;

        const [width, height] = sizes[type];

        const object = {

            id: Date.now(),

            type: type,

            x: 200,

            y: 150,

            width: width,

            height: height,

            rotation: 0

        };

        objects.push(object);

        selectObject(object);

        draw();

    });

});


/* =========================
   DRAW
========================= */

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    objects.forEach(object => {

        ctx.save();

        ctx.translate(
            object.x + object.width / 2,
            object.y + object.height / 2
        );

        ctx.rotate(
            object.rotation * Math.PI / 180
        );


        ctx.fillStyle = colors[object.type];

        ctx.fillRect(
            -object.width / 2,
            -object.height / 2,
            object.width,
            object.height
        );


        /* Object text */

        ctx.fillStyle = "#ffffff";

        ctx.font = "14px Arial";

        ctx.textAlign = "center";

        ctx.textBaseline = "middle";

        ctx.fillText(
            object.type,
            0,
            0
        );


        /* Selection */

        if (object === selectedObject) {

            ctx.strokeStyle = "#ffffff";

            ctx.lineWidth = 2;

            ctx.setLineDash([6, 4]);

            ctx.strokeRect(
                -object.width / 2 - 5,
                -object.height / 2 - 5,
                object.width + 10,
                object.height + 10
            );

            ctx.setLineDash([]);

        }


        ctx.restore();

    });

}


/* =========================
   SELECT OBJECT
========================= */

function selectObject(object) {

    selectedObject = object;

    showProperties();

    draw();

}


/* =========================
   CANVAS CLICK
========================= */

canvas.addEventListener("mousedown", event => {

    const position = getMousePosition(event);

    const object = findObject(
        position.x,
        position.y
    );


    if (object) {

        selectObject(object);

        dragging = true;

    } else {

        selectedObject = null;

        showProperties();

        draw();

    }

});


canvas.addEventListener("mousemove", event => {

    if (!dragging || !selectedObject) {
        return;
    }


    const position = getMousePosition(event);

    selectedObject.x =
        position.x - selectedObject.width / 2;

    selectedObject.y =
        position.y - selectedObject.height / 2;


    showProperties();

    draw();

});


canvas.addEventListener("mouseup", () => {

    dragging = false;

});


/* =========================
   FIND OBJECT
========================= */

function findObject(x, y) {

    for (let i = objects.length - 1; i >= 0; i--) {

        const object = objects[i];

        if (
            x >= object.x &&
            x <= object.x + object.width &&
            y >= object.y &&
            y <= object.y + object.height
        ) {

            return object;

        }

    }

    return null;

}


/* =========================
   MOUSE POSITION
========================= */

function getMousePosition(event) {

    const rect = canvas.getBoundingClientRect();

    return {

        x:
            (event.clientX - rect.left)
            * (canvas.width / rect.width),

        y:
            (event.clientY - rect.top)
            * (canvas.height / rect.height)

    };

}


/* =========================
   PROPERTIES
========================= */

function showProperties() {

    const panel =
        document.getElementById("properties");


    if (!selectedObject) {

        panel.innerHTML =
            `<p class="empty">
                Select an object
            </p>`;

        return;

    }


    panel.innerHTML = `

        <div class="property">

            <label>Type</label>

            <input
                value="${selectedObject.type}"
                disabled
            >

        </div>


        <div class="property">

            <label>X Position</label>

            <input
                id="propX"
                type="number"
                value="${Math.round(selectedObject.x)}"
            >

        </div>


        <div class="property">

            <label>Y Position</label>

            <input
                id="propY"
                type="number"
                value="${Math.round(selectedObject.y)}"
            >

        </div>


        <div class="property">

            <label>Width</label>

            <input
                id="propWidth"
                type="number"
                value="${selectedObject.width}"
            >

        </div>


        <div class="property">

            <label>Height</label>

            <input
                id="propHeight"
                type="number"
                value="${selectedObject.height}"
            >

        </div>


        <div class="property">

            <label>Rotation</label>

            <input
                id="propRotation"
                type="number"
                value="${selectedObject.rotation}"
            >

        </div>

    `;


    document
        .querySelectorAll("#properties input")
        .forEach(input => {

            input.addEventListener(
                "input",
                updateProperties
            );

        });

}


/* =========================
   UPDATE PROPERTIES
========================= */

function updateProperties() {

    if (!selectedObject) return;


    selectedObject.x =
        Number(document.getElementById("propX").value);

    selectedObject.y =
        Number(document.getElementById("propY").value);

    selectedObject.width =
        Number(document.getElementById("propWidth").value);

    selectedObject.height =
        Number(document.getElementById("propHeight").value);

    selectedObject.rotation =
        Number(document.getElementById("propRotation").value);


    draw();

}


/* =========================
   DELETE
========================= */

document
.getElementById("deleteBtn")
.addEventListener("click", () => {

    if (!selectedObject) return;


    objects = objects.filter(
        object => object !== selectedObject
    );


    selectedObject = null;

    showProperties();

    draw();

});


/* =========================
   CLEAR
========================= */

document
.getElementById("clearBtn")
.addEventListener("click", () => {

    objects = [];

    selectedObject = null;

    showProperties();

    draw();

});


/* =========================
   EVENTS
========================= */

document
.getElementById("addEvent")
.addEventListener("click", () => {

    const condition =
        document.getElementById("condition").value;

    const action =
        document.getElementById("action").value;


    events.push({

        condition: condition,

        action: action

    });


    renderEvents();

});


function renderEvents() {

    const list =
        document.getElementById("eventList");


    list.innerHTML = "";


    events.forEach((event, index) => {

        const div =
            document.createElement("div");

        div.className = "event-item";

        div.innerHTML = `

            <b>WHEN</b>
            ${event.condition}

            <br><br>

            <b>DO</b>
            ${event.action}

        `;


        list.appendChild(div);

    });

}


/* =========================
   SAVE
========================= */

document
.getElementById("saveBtn")
.addEventListener("click", () => {

    const project = {

        objects: objects,

        events: events

    };


    localStorage.setItem(
        "gameforgeProject",
        JSON.stringify(project)
    );


    alert("Project saved! 💾");

});


/* =========================
   PLAY
========================= */

document
.getElementById("playBtn")
.addEventListener("click", () => {

    alert(
        "🎮 Preview Mode\n\n" +
        "Your game scene is ready!"
    );

});


/* =========================
   ZOOM
========================= */

document
.getElementById("zoomIn")
.addEventListener("click", () => {

    zoom += 0.1;

    updateZoom();

});


document
.getElementById("zoomOut")
.addEventListener("click", () => {

    zoom = Math.max(
        0.5,
        zoom - 0.1
    );

    updateZoom();

});


function updateZoom() {

    canvas.style.transform =
        `scale(${zoom})`;

    document.getElementById("zoomText")
        .textContent =
        Math.round(zoom * 100) + "%";

}


/* =========================
   START
========================= */

draw();
