import * as THREE from "three";

/* =====================================================
   GAME STATE
===================================================== */

const gameState = {
    paintingStep: 0,
    bookshelfStep: 0,
    drawerStep: 0,
    computerStep: 0,

    keyFound: false,
    keyInspected: false,
    clockChecked: false,
    escaped: false,

    clues: 0,
    puzzles: 0,
    hints: 3,

    activeMission: 1,

    hintIndex: [0, 0, 0, 0, 0, 0],
    clueIndex: [0, 0, 0, 0, 0, 0],

    completedMissions:
        [false, false, false, false, false, false]
};


/* =====================================================
   RANDOM HELPERS
===================================================== */

function randomNumber(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}

function shuffle(array) {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            result[i],
            result[j]
        ] = [
            result[j],
            result[i]
        ];
    }

    return result;
}

function numberToRoman(number) {
    const values = [
        [10, "X"],
        [9, "IX"],
        [8, "VIII"],
        [7, "VII"],
        [6, "VI"],
        [5, "V"],
        [4, "IV"],
        [3, "III"],
        [2, "II"],
        [1, "I"]
    ];

    let result = "";

    for (const [value, roman] of values) {
        while (number >= value) {
            result += roman;
            number -= value;
        }
    }

    return result;
}

function romanToNumber(roman) {
    const values = {
        I: 1,
        V: 5,
        X: 10
    };

    let total = 0;

    for (let i = 0; i < roman.length; i++) {
        const current = values[roman[i]];
        const next = values[roman[i + 1]] || 0;

        if (current < next) {
            total -= current;
        } else {
            total += current;
        }
    }

    return total;
}

function alphabetLetter(number) {
    return String.fromCharCode(
        64 + number
    );
}

function uniqueNumbers(count, min, max) {
    const numbers = [];

    while (numbers.length < count) {
        const value =
            randomNumber(min, max);

        if (!numbers.includes(value)) {
            numbers.push(value);
        }
    }

    return numbers;
}

function makeUniqueCode(usedCodes, code) {
    let result = String(code);

    while (usedCodes.has(result)) {
        result =
            String(
                randomNumber(1, 9)
            ) +
            String(
                randomNumber(0, 9)
            ) +
            String(
                randomNumber(0, 9)
            ) +
            String(
                randomNumber(0, 9)
            );
    }

    usedCodes.add(result);

    return result;
}


/* =====================================================
   RANDOM PUZZLE GENERATOR
===================================================== */

function createRandomPuzzleSet() {

    const usedCodes = new Set();

    /* -------------------------------------------------
       PAINTING
    ------------------------------------------------- */

    const paintingCounts = {
        sun: randomNumber(1, 9),
        clouds: randomNumber(1, 9),
        trees: randomNumber(1, 9),
        mountains: randomNumber(1, 9)
    };

    const paintingOrder = [
        "clouds",
        "trees",
        "sun",
        "mountains"
    ];

    const paintingItems =
        paintingOrder.map(name => ({
            name,
            value: paintingCounts[name]
        }));

    const paintingCode =
        makeUniqueCode(
            usedCodes,
            paintingItems
                .map(item => item.value)
                .join("")
        );


    /* -------------------------------------------------
       BOOKSHELF
       Completely independent random letters.
    ------------------------------------------------- */

    const bookshelfNumbers =
        uniqueNumbers(
            4,
            1,
            9
        );

    const bookshelfLetters =
        bookshelfNumbers.map(
            alphabetLetter
        );

    const bookshelfCode =
        makeUniqueCode(
            usedCodes,
            bookshelfNumbers.join("")
        );


    /* -------------------------------------------------
       DRAWER
       Random Roman numerals.
    ------------------------------------------------- */

    const drawerNumbers =
        uniqueNumbers(
            4,
            1,
            9
        );

    const drawerRomans =
        drawerNumbers.map(
            numberToRoman
        );

    const drawerCode =
        makeUniqueCode(
            usedCodes,
            drawerNumbers.join("")
        );


    /* -------------------------------------------------
   COMPUTER PASSWORD
   Random words are selected from different
   secret-message groups.
------------------------------------------------- */

const passwordWords = [
    [
        "Never",
        "Open",
        "Verify",
        "Always"
    ],
    [
        "Search",
        "Under",
        "Read",
        "Exit"
    ],
    [
        "Look",
        "Observe",
        "Verify",
        "Analyze"
    ],
    [
        "Find",
        "Unlock",
        "Inspect",
        "Escape"
    ],
    [
        "Check",
        "Observe",
        "Move",
        "Enter"
    ],
    [
        "Follow",
        "Understand",
        "Remember",
        "Examine"
    ]
];

const selectedGroups = [];

while (selectedGroups.length < 4) {

    const groupIndex =
        randomNumber(
            0,
            passwordWords.length - 1
        );

    if (!selectedGroups.includes(groupIndex)) {
        selectedGroups.push(groupIndex);
    }
}

const selectedWords = selectedGroups.map(groupIndex => {

    const group = passwordWords[groupIndex];

    return group[
        randomNumber(
            0,
            group.length - 1
        )
    ];

});

const computerPassword =
    selectedWords
        .map(word => word[0])
        .join("")
        .toUpperCase();

    /* -------------------------------------------------
       COMPUTER MATH
       Random expression.
    ------------------------------------------------- */

    const mathA =
        randomNumber(1, 9);

    const mathB =
        randomNumber(1, 9);

    const mathC =
        randomNumber(2, 9);

    const mathD =
        randomNumber(1, 9);

    const mathOperations = [
        "multiply",
        "addMultiply",
        "subtractMultiply",
        "multiplyAdd"
    ];

    const mathType =
        mathOperations[
            randomNumber(
                0,
                mathOperations.length - 1
            )
        ];

    let mathExpression;
    let mathAnswer;

    if (mathType === "multiply") {

        mathExpression =
            `${mathA} × ${mathB}`;

        mathAnswer =
            mathA * mathB;

    } else if (mathType === "addMultiply") {

        mathExpression =
            `${mathA} + ${mathB} × ${mathC}`;

        mathAnswer =
            mathA +
            mathB * mathC;

    } else if (mathType === "subtractMultiply") {

        mathExpression =
            `${mathA} + ${mathB} × ${mathC} - ${mathD}`;

        mathAnswer =
            mathA +
            mathB * mathC -
            mathD;

    } else {

        mathExpression =
            `${mathA} × ${mathB} + ${mathC}`;

        mathAnswer =
            mathA * mathB +
            mathC;
    }


    /* -------------------------------------------------
   KEY PATTERN
   Random arithmetic progression below 9.
------------------------------------------------- */

const keyStart =
    randomNumber(1, 3);

const keyStep =
    randomNumber(1, 2);

const keySequence = [
    keyStart,
    keyStart + keyStep,
    keyStart + keyStep * 2,
    keyStart + keyStep * 3
];

const keyNext =
    keyStart + keyStep * 4;

const keyRomanSequence =
    keySequence.map(
        numberToRoman
    );

const keyNextRoman =
    numberToRoman(keyNext);


    /* -------------------------------------------------
       CLOCK
       Starting number is the key's next number.
       Three other unique numbers are generated.
    ------------------------------------------------- */

    const otherClockNumbers =
        uniqueNumbers(
            3,
            1,
            12
        ).filter(
            number =>
                number !== keyNext
        );

    while (
        otherClockNumbers.length < 3
    ) {
        const value =
            randomNumber(1, 12);

        if (
            value !== keyNext &&
            !otherClockNumbers.includes(value)
        ) {
            otherClockNumbers.push(value);
        }
    }

    const clockNumbers = [
        keyNext,
        ...otherClockNumbers
    ];

    /*
       Shuffle the remaining marked numbers
       while keeping the key number as the first
       number the player should search for.
    */

    const clockMarkedNumbers =
        shuffle(clockNumbers);

    /*
       Put the key number somewhere random.
       The actual final code follows the physical
       clockwise order of the marked numbers.
    */

    const keyIndex =
        randomNumber(
            0,
            clockMarkedNumbers.length - 1
        );

    [
        clockMarkedNumbers[0],
        clockMarkedNumbers[keyIndex]
    ] = [
        clockMarkedNumbers[keyIndex],
        clockMarkedNumbers[0]
    ];

    /*
       The first marked number is the key number.
       Final code is clockwise order.
    */

    const clockCode =
        makeUniqueCode(
            usedCodes,
            clockMarkedNumbers.join("")
        );


    /* -------------------------------------------------
       RETURN EVERYTHING
    ------------------------------------------------- */

    return {
        paintingCounts,
        paintingItems,
        paintingCode,

        bookshelfNumbers,
        bookshelfLetters,
        bookshelfCode,

        drawerNumbers,
        drawerRomans,
        drawerCode,

        computerPassword,

        selectedWords,

        mathA,
        mathB,
        mathC,
        mathD,
        mathExpression,
        mathAnswer,

        keyStart,
        keyStep,
        keySequence,
        keyRomanSequence,
        keyNext,
        keyNextRoman,

        clockNumbers,
        clockMarkedNumbers,
        clockCode
    };
}


/*
   A COMPLETELY NEW PUZZLE SET IS CREATED
   EVERY TIME THE PAGE/GAME STARTS.
*/

let puzzleSet =
    createRandomPuzzleSet();


/* =====================================================
   MISSION DATA
===================================================== */

const missionData = [

    {
    title: "Find the painting",

    hints: [
        "Go to the painting on the left wall.",
        "Interact with the painting to begin.",
        "Solve the 3×3 puzzle.",
        "The solved puzzle reveals the access code."
    ],

    clues: [
        "🧩 Solve the 3×3 painting puzzle.",
        "Arrange all pieces into the correct picture.",
        "The blank space helps you move the pieces.",
        "After solving it, use the access code."
    ]
    },

    {
        title: "Solve the bookshelf",

        hints: [
            "Look closely at the marked books.",
            "Letters can be converted into alphabet positions.",
            "A = 1, B = 2, C = 3 and so on.",
            "The marked letters are different in every game."
        ],

        clues: [
            "🔤 LOGIC: ALPHABET POSITION",
            "Find the four marked letters.",
            "Convert each letter into its alphabet number.",
            "Enter the four numbers in order."
        ]
    },

    {
        title: "Unlock the drawer",

        hints: [
            "The bookshelf reveals a Roman-number clue.",
            "Roman numerals represent ordinary numbers.",
            "Convert every Roman numeral.",
            "The Roman numerals are randomized every game."
        ],

        clues: [
            "🔎 LOGIC: ROMAN NUMERALS",
            "Read the four Roman symbols.",
            "Convert each symbol into a number.",
            "Enter the converted numbers in order."
        ]
    },

    {
        title: "Hack the computer",

        hints: [
            "The drawer contains a hidden message.",
            "Look at the beginning of every line.",
            "The first letters create the login password.",
            "After logging in, solve the new mathematical expression."
        ],

        clues: [
            "🔎 LOGIC: HIDDEN MESSAGE",
            "Take the first letter of every line.",
            "The letters form the computer password.",
            "Then solve the randomly generated maths puzzle."
        ]
    },

    {
        title: "Find the key",

        hints: [
            "The computer tells you where to search.",
            "The key is underneath the painting table.",
            "Inspect the key after you find it.",
            "The sequence engraved on the key changes every game."
        ],

        clues: [
            "🔑 LOGIC: NUMBER PATTERN",
            "Look underneath the painting table.",
            "Inspect the sequence on the key.",
            "Continue the sequence to find the clock's starting number."
        ]
    },

    {
        title: "Escape the room",

        hints: [
            "The key gives you the first clock number.",
            "Look for the highlighted numbers around the clock.",
            "Start from the number supplied by the key.",
            "Follow the highlighted numbers clockwise."
        ],

        clues: [
            "🕒 LOGIC: CLOCK PATTERN",
            "The key gives you the starting number.",
            "Find all highlighted clock numbers.",
            "Read them clockwise to obtain the final code."
        ]
    }
];


/* =====================================================
   SCENE
===================================================== */

const scene =
    new THREE.Scene();

scene.background =
    new THREE.Color(
        0xbfe3f2
    );

scene.fog =
    new THREE.Fog(
        0xbfe3f2,
        25,
        55
    );


/* =====================================================
   CAMERA
===================================================== */

const camera =
    new THREE.PerspectiveCamera(
        75,
        window.innerWidth /
            window.innerHeight,
        0.1,
        100
    );


/* =====================================================
   RENDERER
===================================================== */

const renderer =
    new THREE.WebGLRenderer({
        antialias: true
    });

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

document.body.appendChild(
    renderer.domElement
);

/* =====================================================
   LIGHTING
===================================================== */

const hemisphereLight =
    new THREE.HemisphereLight(
        0xffffff,
        0x8b9a9e,
        3.5
    );

scene.add(
    hemisphereLight
);


const ceilingLight =
    new THREE.PointLight(
        0xffffff,
        10,
        30
    );

ceilingLight.position.set(
    0,
    6.5,
    0
);

ceilingLight.castShadow = true;

scene.add(
    ceilingLight
);


const leftLight =
    new THREE.PointLight(
        0xffffff,
        6,
        22
    );

leftLight.position.set(
    -7,
    5,
    -3
);

leftLight.castShadow = true;

scene.add(
    leftLight
);


const rightLight =
    new THREE.PointLight(
        0xffffff,
        6,
        22
    );

rightLight.position.set(
    7,
    5,
    3
);

rightLight.castShadow = true;

scene.add(
    rightLight
);


/* =====================================================
   LIGHT / DARK MODE
===================================================== */

function setRoomLightMode(mode) {

    if (mode === "dark") {

        hemisphereLight.intensity = 0.8;

        ceilingLight.intensity = 2.5;

        leftLight.intensity = 1.5;

        rightLight.intensity = 1.5;

        scene.background.set(
            0x18202b
        );

    } else {

        hemisphereLight.intensity = 3.5;

        ceilingLight.intensity = 10;

        leftLight.intensity = 6;

        rightLight.intensity = 6;

        scene.background.set(
            0xdce8ef
        );
    }
}


/* LIGHT BUTTON */

window.addEventListener(
    "room-light",
    () => {

        setRoomLightMode("light");

    }
);


/* DARK BUTTON */

window.addEventListener(
    "room-dark",
    () => {

        setRoomLightMode("dark");

    }
);


/* INITIAL MODE */

setRoomLightMode(
    document.body.dataset.mode === "dark"
        ? "dark"
        : "light"
);

/* =====================================================
   ROOM LIGHT CONTROLS
===================================================== */

function makeRoomLight() {

    hemisphereLight.intensity = 3;

    ceilingLight.intensity = 7;

    leftLight.intensity = 4;

    rightLight.intensity = 4;

    scene.background.set(
        0xdce8ef
    );
}


function makeRoomDark() {

    hemisphereLight.intensity = 0.7;

    ceilingLight.intensity = 1.2;

    leftLight.intensity = 0.6;

    rightLight.intensity = 0.6;

    scene.background.set(
        0x111827
    );
}


window.addEventListener(
    "room-light",
    function () {

        makeRoomLight();

    }
);


window.addEventListener(
    "room-dark",
    function () {

        makeRoomDark();

    }
);
rightLight.position.set(
    7,
    5,
    3
);

rightLight.castShadow = true;

scene.add(
    rightLight
);


/* =====================================================
   LIGHT / DARK CONTROL
===================================================== */

function setRoomLight() {

    hemisphereLight.intensity = 3;

    ceilingLight.intensity = 7;

    leftLight.intensity = 4;

    rightLight.intensity = 4;

    scene.background.set(
        0xdce8ef
    );
}


function setRoomDark() {

    hemisphereLight.intensity = 0.8;

    ceilingLight.intensity = 1.5;

    leftLight.intensity = 0.7;

    rightLight.intensity = 0.7;

    scene.background.set(
        0x111827
    );
}


/* =====================================================
   MATERIALS
===================================================== */

const floorMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xa97850,
        roughness: 0.8
    });

const wallMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xcfeef5,
        roughness: 0.8
    });

const ceilingMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xf7fbfc,
        roughness: 0.9
    });

const woodMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x70452a,
        roughness: 0.7
    });

const darkWoodMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x382115,
        roughness: 0.7
    });

const blackMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x15191d,
        roughness: 0.3
    });

const metalMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x858b91,
        metalness: 0.8,
        roughness: 0.25
    });

const whiteMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xffffff
    });

const redMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xb91c1c
    });


/* =====================================================
   ROOM
===================================================== */

const roomWidth = 20;
const roomDepth = 20;
const wallHeight = 7;


/* =====================================================
   FLOOR
===================================================== */

const floor =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            roomWidth,
            0.3,
            roomDepth
        ),
        floorMaterial
    );

floor.position.set(
    0,
    -0.15,
    0
);

floor.receiveShadow = true;

scene.add(floor);


/* =====================================================
   FLOOR PLANK LINES
===================================================== */

for (
    let x = -9;
    x <= 9;
    x += 2
) {
    const line =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.025,
                0.02,
                20
            ),
            new THREE.MeshStandardMaterial({
                color: 0x805738
            })
        );

    line.position.set(
        x,
        0.02,
        0
    );

    scene.add(line);
}


/* =====================================================
   WALLS
===================================================== */

const backWall =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            roomWidth,
            wallHeight,
            0.3
        ),
        wallMaterial
    );

backWall.position.set(
    0,
    wallHeight / 2,
    -10
);

scene.add(backWall);


const frontWall =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            roomWidth,
            wallHeight,
            0.3
        ),
        wallMaterial
    );

frontWall.position.set(
    0,
    wallHeight / 2,
    10
);

scene.add(frontWall);


const leftWall =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.3,
            wallHeight,
            roomDepth
        ),
        wallMaterial
    );

leftWall.position.set(
    -10,
    wallHeight / 2,
    0
);

scene.add(leftWall);


const rightWall =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.3,
            wallHeight,
            roomDepth
        ),
        wallMaterial
    );

rightWall.position.set(
    10,
    wallHeight / 2,
    0
);

scene.add(rightWall);


/* =====================================================
   CEILING
===================================================== */

const ceiling =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            roomWidth,
            0.3,
            roomDepth
        ),
        ceilingMaterial
    );

ceiling.position.y = 7;

scene.add(ceiling);


/* =====================================================
   RUG
===================================================== */

const rug =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            8,
            0.05,
            5
        ),
        new THREE.MeshStandardMaterial({
            color: 0x607579,
            roughness: 0.9
        })
    );

rug.position.set(
    0,
    0.04,
    1
);

scene.add(rug);


/* =====================================================
   PLAYER
===================================================== */

const player =
    new THREE.Object3D();

player.position.set(
    0,
    2.4,
    7
);

scene.add(player);

player.add(camera);

camera.position.set(
    0,
    0,
    0
);


/* =====================================================
   PAINTING TABLE
===================================================== */

const paintingTable =
    new THREE.Group();

paintingTable.position.set(
    -5.5,
    0,
    3.5
);

scene.add(
    paintingTable
);


const paintingTableTop =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            3.2,
            0.3,
            1.6
        ),
        woodMaterial
    );

paintingTableTop.position.y = 1.8;

paintingTable.add(
    paintingTableTop
);


for (
    const x of [-1.25, 1.25]
) {
    for (
        const z of [-0.55, 0.55]
    ) {
        const leg =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.2,
                    1.8,
                    0.2
                ),
                darkWoodMaterial
            );

        leg.position.set(
            x,
            0.9,
            z
        );

        paintingTable.add(leg);
    }
}


/* =====================================================
   PAINTING CHAIR
===================================================== */

const paintingChair =
    new THREE.Group();

paintingChair.position.set(
    -5.5,
    0,
    5
);

scene.add(
    paintingChair
);


const paintingChairSeat =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            1.4,
            0.3,
            1.4
        ),
        woodMaterial
    );

paintingChairSeat.position.y = 1.1;

paintingChair.add(
    paintingChairSeat
);


for (
    const x of [-0.55, 0.55]
) {
    for (
        const z of [-0.5, 0.5]
    ) {
        const leg =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.15,
                    1.1,
                    0.15
                ),
                darkWoodMaterial
            );

        leg.position.set(
            x,
            0.55,
            z
        );

        paintingChair.add(leg);
    }
}


const paintingChairBack =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            1.4,
            1.5,
            0.2
        ),
        woodMaterial
    );

paintingChairBack.position.set(
    0,
    1.8,
    0.55
);

paintingChair.add(
    paintingChairBack
);


/* =====================================================
   NATURE PAINTING
===================================================== */

const painting =
    new THREE.Group();

painting.position.set(
    -9.70,
    4.55,
    2
);

painting.rotation.y =
    Math.PI / 2;

scene.add(
    painting
);


/* =====================================================
   PAINTING FRAME
===================================================== */

const paintingFrameMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x5a351f,
        roughness: 0.6
    });


const frameTop =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            4.9,
            0.22,
            0.22
        ),
        paintingFrameMaterial
    );

frameTop.position.set(
    0,
    1.85,
    0
);

painting.add(frameTop);


const frameBottom =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            4.9,
            0.22,
            0.22
        ),
        paintingFrameMaterial
    );

frameBottom.position.set(
    0,
    -1.85,
    0
);

painting.add(frameBottom);


const frameLeft =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.22,
            3.5,
            0.22
        ),
        paintingFrameMaterial
    );

frameLeft.position.set(
    -2.35,
    0,
    0
);

painting.add(frameLeft);


const frameRight =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.22,
            3.5,
            0.22
        ),
        paintingFrameMaterial
    );

frameRight.position.set(
    2.35,
    0,
    0
);

painting.add(frameRight);


/* =====================================================
   RANDOM PAINTING CANVAS
===================================================== */

const paintingCanvas =
    document.createElement("canvas");

paintingCanvas.width = 1200;
paintingCanvas.height = 800;

const paintingContext =
    paintingCanvas.getContext("2d");


function drawCloud(
    ctx,
    x,
    y,
    scale
) {
    ctx.fillStyle =
        "#ffffff";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        45 * scale,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 50 * scale,
        y - 25 * scale,
        60 * scale,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 105 * scale,
        y,
        45 * scale,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


function drawTree(
    ctx,
    x,
    y,
    scale
) {
    ctx.fillStyle =
        "#70452a";

    ctx.fillRect(
        x - 15 * scale,
        y,
        30 * scale,
        120 * scale
    );

    ctx.fillStyle =
        "#185c2d";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        65 * scale,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle =
        "#2d813d";

    ctx.beginPath();

    ctx.arc(
        x - 45 * scale,
        y + 25 * scale,
        45 * scale,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        x + 45 * scale,
        y + 25 * scale,
        45 * scale,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


function drawRandomPainting(ctx, width, height, puzzle) {
    ctx.clearRect(0, 0, width, height);

    // SKY
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, "#87CEEB");
    sky.addColorStop(1, "#DFF6FF");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    // SUN

ctx.beginPath();

ctx.arc(
    1000,
    100,
    45,
    0,
    Math.PI * 2
);

ctx.fillStyle = "#FFD93D";
ctx.fill();

ctx.strokeStyle = "#F4B400";
ctx.lineWidth = 4;
ctx.stroke();


// CLOUDS

const cloudPositions = [
    [150, 100],
    [450, 150],
    [750, 90],
    [950, 200]
];

for (const [x, y] of cloudPositions) {

    ctx.fillStyle = "#FFFFFF";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        28,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 35,
        y - 15,
        35,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 75,
        y,
        28,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 40,
        y + 12,
        32,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// THREE MOUNTAINS

const mountainPositions = [
    100,
    500,
    900
];

for (const x of mountainPositions) {

    ctx.beginPath();

    ctx.moveTo(
        x - 160,
        470
    );

    ctx.lineTo(
        x,
        280
    );

    ctx.lineTo(
        x + 160,
        470
    );

    ctx.closePath();

    ctx.fillStyle = "#607D8B";

    ctx.fill();


    // SNOW

    ctx.beginPath();

    ctx.moveTo(
        x,
        280
    );

    ctx.lineTo(
        x - 45,
        340
    );

    ctx.lineTo(
        x - 15,
        325
    );

    ctx.lineTo(
        x,
        350
    );

    ctx.lineTo(
        x + 18,
        325
    );

    ctx.lineTo(
        x + 48,
        340
    );

    ctx.closePath();

    ctx.fillStyle = "#FFFFFF";

    ctx.fill();
}


    // GREEN GROUND

    ctx.fillStyle = "#7CB342";

    ctx.fillRect(
        0,
        470,
        width,
        height - 470
    );


    // ONE RIVER

    ctx.beginPath();

    ctx.moveTo(
        500,
        470
    );

    ctx.bezierCurveTo(
        450,
        540,
        650,
        590,
        500,
        800
    );

    ctx.lineTo(
        720,
        800
    );

    ctx.bezierCurveTo(
        820,
        590,
        620,
        540,
        680,
        470
    );

    ctx.closePath();

    ctx.fillStyle = "#42A5F5";

    ctx.fill();


    // RIVER HIGHLIGHT

    ctx.beginPath();

    ctx.moveTo(
        590,
        480
    );

    ctx.bezierCurveTo(
        550,
        560,
        700,
        620,
        590,
        790
    );

    ctx.strokeStyle = "#90CAF9";

    ctx.lineWidth = 7;

    ctx.stroke();


    // BORDER

    ctx.strokeStyle = "#5D4037";

    ctx.lineWidth = 18;

    ctx.strokeRect(
        5,
        5,
        width - 10,
        height - 10
    );
}

function paintingCountsSafe(
    value,
    min,
    max
) {
    return (
        min +
        Math.min(
            max - min,
            value * 70
        )
    );
}


drawRandomPainting(
    paintingContext,
    paintingCanvas.width,
    paintingCanvas.height,
    puzzleSet
);


/* =====================================================
   PAINTING TEXTURE
===================================================== */

const paintingTexture =
    new THREE.CanvasTexture(
        paintingCanvas
    );

paintingTexture.colorSpace =
    THREE.SRGBColorSpace;

paintingTexture.minFilter =
    THREE.LinearFilter;

paintingTexture.magFilter =
    THREE.LinearFilter;


const paintingImage =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            4.45,
            3.25
        ),
        new THREE.MeshBasicMaterial({
            map: paintingTexture,
            side: THREE.DoubleSide
        })
    );

paintingImage.position.set(
    0,
    0,
    0.16
);

paintingImage.renderOrder = 5;

painting.add(
    paintingImage
);


/* =====================================================
   BOOKSHELF
===================================================== */

const bookshelf =
    new THREE.Group();

bookshelf.position.set(
    9.72,
    0,
    -3
);

scene.add(
    bookshelf
);


const shelfBack =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.45,
            5.8,
            4.2
        ),
        darkWoodMaterial
    );

shelfBack.position.y = 2.9;

bookshelf.add(
    shelfBack
);


for (
    const z of [-2.1, 2.1]
) {
    const side =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.7,
                6,
                0.25
            ),
            woodMaterial
        );

    side.position.set(
        0,
        3,
        z
    );

    bookshelf.add(side);
}


for (
    let i = 0;
    i < 5;
    i++
) {
    const shelf =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.7,
                0.2,
                4.3
            ),
            woodMaterial
        );

    shelf.position.set(
        -0.05,
        0.6 + i * 1.2,
        0
    );

    bookshelf.add(shelf);
}


/* =====================================================
   BOOKS WITH RANDOM LETTERS
===================================================== */

const bookColors = [
    0xb91c1c,
    0x2563eb,
    0x16a34a,
    0xfacc15,
    0x9333ea,
    0xea580c
];


function createLetterTexture(letter) {

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.width = 256;
    canvas.height = 256;

    const ctx =
        canvas.getContext("2d");

    ctx.fillStyle =
        "#ffffff";

    ctx.fillRect(
        0,
        0,
        256,
        256
    );

    ctx.fillStyle =
        "#111111";

    ctx.font =
        "bold 170px Arial";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.fillText(
        letter,
        128,
        128
    );

    const texture =
        new THREE.CanvasTexture(
            canvas
        );

    texture.colorSpace =
        THREE.SRGBColorSpace;

    return texture;
}


for (
    let row = 0;
    row < 4;
    row++
) {

    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const isMarked =
            i === 0;

        const letter =
            puzzleSet
                .bookshelfLetters[row];

        const book =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.5,
                    0.8,
                    0.4
                ),
                new THREE.MeshStandardMaterial({
                    color:
                        bookColors[
                            i %
                            bookColors.length
                        ]
                })
            );

        book.position.set(
            -0.45,
            1.0 + row * 1.2,
            -1.65 + i * 0.52
        );

        bookshelf.add(book);


        if (isMarked) {

            const letterPlane =
                new THREE.Mesh(
                    new THREE.PlaneGeometry(
                        0.32,
                        0.5
                    ),
                    new THREE.MeshBasicMaterial({
                        map:
                            createLetterTexture(
                                letter
                            ),
                        side:
                            THREE.DoubleSide
                    })
                );

            letterPlane.position.set(
                -0.72,
                1.0 + row * 1.2,
                -1.65 + i * 0.52
            );

            letterPlane.rotation.y =
                -Math.PI / 2;

            bookshelf.add(
                letterPlane
            );
        }
    }
}


/* =====================================================
   BOOKSHELF NOTE
===================================================== */

const shelfNoteCanvas =
    document.createElement(
        "canvas"
    );

shelfNoteCanvas.width = 700;
shelfNoteCanvas.height = 180;

const shelfNoteContext =
    shelfNoteCanvas.getContext(
        "2d"
    );

shelfNoteContext.fillStyle =
    "#fff8dc";

shelfNoteContext.fillRect(
    0,
    0,
    700,
    180
);

shelfNoteContext.fillStyle =
    "#222222";

shelfNoteContext.font =
    "bold 30px Arial";

shelfNoteContext.textAlign =
    "center";

shelfNoteContext.fillText(
    "LOGIC: ALPHABET POSITION",
    350,
    65
);

shelfNoteContext.font =
    "bold 34px Arial";

shelfNoteContext.fillText(
    puzzleSet.bookshelfLetters.join(
        "   "
    ),
    350,
    125
);

const shelfNoteTexture =
    new THREE.CanvasTexture(
        shelfNoteCanvas
    );

shelfNoteTexture.colorSpace =
    THREE.SRGBColorSpace;


const shelfNote =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            3.0,
            0.75
        ),
        new THREE.MeshBasicMaterial({
            map: shelfNoteTexture,
            side: THREE.DoubleSide
        })
    );

shelfNote.position.set(
    -0.65,
    5.7,
    0
);

shelfNote.rotation.y =
    -Math.PI / 2;

bookshelf.add(
    shelfNote
);


/* =====================================================
   DRAWER
===================================================== */

const drawerCabinet =
    new THREE.Group();

drawerCabinet.position.set(
    -5.5,
    0,
    -9.65
);

scene.add(
    drawerCabinet
);


const cabinetBody =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            3.5,
            4.2,
            1.2
        ),
        woodMaterial
    );

cabinetBody.position.y = 2.1;

drawerCabinet.add(
    cabinetBody
);


for (
    let i = 0;
    i < 3;
    i++
) {

    const drawer =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.9,
                0.9,
                0.18
            ),
            darkWoodMaterial
        );

    drawer.position.set(
        0,
        1.0 + i * 1.25,
        0.65
    );

    drawerCabinet.add(
        drawer
    );


    const handle =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.55,
                0.12,
                0.15
            ),
            metalMaterial
        );

    handle.position.set(
        0,
        1.0 + i * 1.25,
        0.82
    );

    drawerCabinet.add(
        handle
    );
}


/* =====================================================
   COMPUTER
===================================================== */

const computer =
    new THREE.Group();

computer.position.set(
    5.2,
    0,
    -8.8
);

scene.add(
    computer
);


const computerDesk =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            4.5,
            0.35,
            1.7
        ),
        woodMaterial
    );

computerDesk.position.set(
    0,
    2.15,
    0
);

computer.add(
    computerDesk
);


const deskFront =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            4.3,
            1.1,
            0.2
        ),
        darkWoodMaterial
    );

deskFront.position.set(
    0,
    1.6,
    0.7
);

computer.add(
    deskFront
);


for (
    const x of [-1.8, 1.8]
) {

    const leg =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.35,
                2.15,
                0.35
            ),
            darkWoodMaterial
        );

    leg.position.set(
        x,
        1.05,
        0
    );

    computer.add(
        leg
    );
}


/* =====================================================
   MONITOR
===================================================== */

const monitor =
    new THREE.Group();

monitor.position.set(
    0,
    2.95,
    -0.05
);

computer.add(
    monitor
);


const monitorBody =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            2.6,
            1.65,
            0.25
        ),
        blackMaterial
    );

monitor.add(
    monitorBody
);


const screenMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x21a9ff,
        emissive: 0x0755aa,
        emissiveIntensity: 1
    });


const monitorScreen =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            2.15,
            1.15,
            0.04
        ),
        screenMaterial
    );

monitorScreen.position.set(
    0,
    0,
    0.15
);

monitor.add(
    monitorScreen
);


for (
    let i = 0;
    i < 4;
    i++
) {

    const screenLine =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.3 -
                    i * 0.15,
                0.04,
                0.02
            ),
            whiteMaterial
        );

    screenLine.position.set(
        0,
        0.35 -
            i * 0.18,
        0.18
    );

    monitor.add(
        screenLine
    );
}


const monitorStand =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.3,
            0.7,
            0.3
        ),
        blackMaterial
    );

monitorStand.position.set(
    0,
    -1,
    0
);

monitor.add(
    monitorStand
);


const monitorBase =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            1,
            0.1,
            0.55
        ),
        blackMaterial
    );

monitorBase.position.set(
    0,
    -1.35,
    0
);

monitor.add(
    monitorBase
);


/* =====================================================
   KEYBOARD
===================================================== */

const keyboard =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            1.8,
            0.08,
            0.65
        ),
        blackMaterial
    );

keyboard.position.set(
    0,
    2.4,
    0.5
);

computer.add(
    keyboard
);


/* =====================================================
   COMPUTER CHAIR
===================================================== */

const chair =
    new THREE.Group();

chair.position.set(
    5.2,
    0,
    -6.5
);

scene.add(
    chair
);


const chairSeat =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            1.6,
            0.35,
            1.6
        ),
        blackMaterial
    );

chairSeat.position.y = 1.5;

chair.add(
    chairSeat
);


const chairBack =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            1.6,
            2.5,
            0.35
        ),
        blackMaterial
    );

chairBack.position.set(
    0,
    2.8,
    0.6
);

chair.add(
    chairBack
);


for (
    const x of [-0.72, 0.72]
) {

    const side =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.12,
                2.2,
                0.3
            ),
            redMaterial
        );

    side.position.set(
        x,
        2.8,
        0.4
    );

    chair.add(
        side
    );
}


const chairPole =
    new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.12,
            0.16,
            1.5,
            16
        ),
        metalMaterial
    );

chairPole.position.y =
    0.75;

chair.add(
    chairPole
);


const chairBase =
    new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.75,
            0.75,
            0.12,
            16
        ),
        metalMaterial
    );

chairBase.position.y =
    0.08;

chair.add(
    chairBase
);


/* =====================================================
   WINDOW
===================================================== */

const windowGroup =
    new THREE.Group();

windowGroup.position.set(
    9.78,
    4.2,
    4
);

scene.add(
    windowGroup
);


const windowFrame =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.25,
            3.6,
            5
        ),
        darkWoodMaterial
    );

windowGroup.add(
    windowFrame
);


const windowGlass =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.05,
            3,
            4.3
        ),
        new THREE.MeshStandardMaterial({
            color: 0x70c8ed,
            transparent: true,
            opacity: 0.75,
            emissive: 0x164c70,
            emissiveIntensity: 0.2
        })
    );

windowGlass.position.x =
    -0.16;

windowGroup.add(
    windowGlass
);


const windowVertical =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.08,
            3.2,
            0.12
        ),
        darkWoodMaterial
    );

windowVertical.position.x =
    -0.2;

windowGroup.add(
    windowVertical
);


const windowHorizontal =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.08,
            0.12,
            4.5
        ),
        darkWoodMaterial
    );

windowHorizontal.position.x =
    -0.2;

windowGroup.add(
    windowHorizontal
);


/* =====================================================
   EXIT DOOR
===================================================== */

const exitDoor =
    new THREE.Group();

exitDoor.position.set(
    0,
    0,
    9.65
);

scene.add(
    exitDoor
);


const doorFrameMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x3a2416,
        roughness: 0.6
    });


const doorLeftFrame =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.3,
            6,
            0.35
        ),
        doorFrameMaterial
    );

doorLeftFrame.position.set(
    -1.65,
    3,
    0
);

exitDoor.add(
    doorLeftFrame
);


const doorRightFrame =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.3,
            6,
            0.35
        ),
        doorFrameMaterial
    );

doorRightFrame.position.set(
    1.65,
    3,
    0
);

exitDoor.add(
    doorRightFrame
);


const doorTopFrame =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            3.6,
            0.3,
            0.35
        ),
        doorFrameMaterial
    );

doorTopFrame.position.set(
    0,
    6,
    0
);

exitDoor.add(
    doorTopFrame
);


const door =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            3,
            5.6,
            0.25
        ),
        new THREE.MeshStandardMaterial({
            color: 0x70482f,
            roughness: 0.65
        })
    );

door.position.set(
    0,
    2.8,
    0
);

exitDoor.add(
    door
);


for (
    const y of [1.3, 3.5]
) {

    const panel =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.3,
                1.6,
                0.08
            ),
            darkWoodMaterial
        );

    panel.position.set(
        0,
        y,
        0.17
    );

    exitDoor.add(
        panel
    );
}


const doorHandle =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            0.15,
            16,
            16
        ),
        new THREE.MeshStandardMaterial({
            color: 0xd6b24c,
            metalness: 0.9,
            roughness: 0.2
        })
    );

doorHandle.position.set(
    0.9,
    2.8,
    0.25
);

exitDoor.add(
    doorHandle
);


/* =====================================================
   EXIT BOARD
===================================================== */

const exitBoard =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            3.2,
            0.9,
            0.16
        ),
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.5
        })
    );

exitBoard.position.set(
    0,
    6.55,
    -0.25
);

exitDoor.add(
    exitBoard
);


/* =====================================================
   EXIT TEXT
===================================================== */

const exitCanvas =
    document.createElement(
        "canvas"
    );

exitCanvas.width = 512;
exitCanvas.height = 180;

const exitContext =
    exitCanvas.getContext(
        "2d"
    );

exitContext.fillStyle =
    "#ff0000";

exitContext.font =
    "bold 105px Arial";

exitContext.textAlign =
    "center";

exitContext.textBaseline =
    "middle";

exitContext.fillText(
    "EXIT",
    256,
    90
);

const exitTexture =
    new THREE.CanvasTexture(
        exitCanvas
    );

exitTexture.colorSpace =
    THREE.SRGBColorSpace;


const exitTextMaterial =
    new THREE.MeshBasicMaterial({
        map: exitTexture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
    });


const exitText =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            2.8,
            0.8
        ),
        exitTextMaterial
    );

exitText.position.set(
    0,
    6.55,
    -0.36
);

exitText.rotation.y =
    Math.PI;

exitText.renderOrder = 10;

exitDoor.add(
    exitText
);


/* =====================================================
   CLOCK
===================================================== */

const clock =
    new THREE.Group();

clock.position.set(
    -6.8,
    4.9,
    9.45
);

scene.add(
    clock
);


const clockCanvas =
    document.createElement(
        "canvas"
    );

clockCanvas.width = 1024;
clockCanvas.height = 1024;

const clockContext =
    clockCanvas.getContext(
        "2d"
    );


function drawClock() {

    const ctx =
        clockContext;

    const centerX = 512;
    const centerY = 512;

    const outerRadius = 480;
    const faceRadius = 405;

    ctx.clearRect(
        0,
        0,
        1024,
        1024
    );


    /* OUTER CLOCK */

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        outerRadius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#3d2416";

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        455,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#79502f";

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        430,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#b77b48";

    ctx.fill();


    /* FACE */

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        faceRadius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#fff2d0";

    ctx.fill();


    /* TICKS */

    for (
        let i = 0;
        i < 60;
        i++
    ) {

        const angle =
            i *
            Math.PI /
            30;

        const outer = 375;

        const inner =
            i % 5 === 0
                ? 342
                : 360;

        const x1 =
            centerX +
            Math.sin(angle) *
            outer;

        const y1 =
            centerY -
            Math.cos(angle) *
            outer;

        const x2 =
            centerX +
            Math.sin(angle) *
            inner;

        const y2 =
            centerY -
            Math.cos(angle) *
            inner;

        ctx.beginPath();

        ctx.moveTo(
            x1,
            y1
        );

        ctx.lineTo(
            x2,
            y2
        );

        ctx.strokeStyle =
            "#24160e";

        ctx.lineWidth =
            i % 5 === 0
                ? 10
                : 4;

        ctx.stroke();
    }


    /* NUMBERS */

    ctx.fillStyle =
        "#1e130c";

    ctx.font =
        "bold 68px Arial";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    const numberRadius =
        295;


    for (
        let number = 1;
        number <= 12;
        number++
    ) {

        const angle =
            number *
            Math.PI /
            6 -
            Math.PI / 2;

        const x =
            centerX +
            Math.cos(angle) *
            numberRadius;

        const y =
            centerY +
            Math.sin(angle) *
            numberRadius;

        ctx.fillText(
            String(number),
            x,
            y
        );
    }


    /* RANDOM MARKED NUMBERS */

    for (
        const number of
        puzzleSet.clockMarkedNumbers
    ) {

        const angle =
            number *
            Math.PI /
            6 -
            Math.PI / 2;

        const x =
            centerX +
            Math.cos(angle) *
            numberRadius;

        const y =
            centerY +
            Math.sin(angle) *
            numberRadius;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            50,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle =
            "#c62828";

        ctx.lineWidth =
            8;

        ctx.stroke();
    }


    /* CLOCK INSTRUCTION */

    ctx.fillStyle =
        "#70452b";

    ctx.font =
        "bold 27px Arial";

    ctx.fillText(
        "READ CLOCKWISE",
        centerX,
        centerY - 105
    );


    ctx.font =
        "bold 22px Arial";

    ctx.fillText(
        `START: ${puzzleSet.keyNext}`,
        centerX,
        centerY + 100
    );


    /* REAL CLOCK HANDS */

    const now =
        new Date();

    const seconds =
        now.getSeconds();

    const minutes =
        now.getMinutes();

    const hours =
        now.getHours() % 12;


    const hourAngle =
        (
            hours +
            minutes / 60
        ) *
        Math.PI /
        6;


    drawClockHand(
        ctx,
        centerX,
        centerY,
        hourAngle,
        165,
        23,
        "#1e130c"
    );


    const minuteAngle =
        (
            minutes +
            seconds / 60
        ) *
        Math.PI /
        30;


    drawClockHand(
        ctx,
        centerX,
        centerY,
        minuteAngle,
        245,
        14,
        "#1e130c"
    );


    const secondAngle =
        seconds *
        Math.PI /
        30;


    drawClockHand(
        ctx,
        centerX,
        centerY,
        secondAngle,
        285,
        6,
        "#c62828"
    );


    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        20,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#1e130c";

    ctx.fill();
}


function drawClockHand(
    ctx,
    centerX,
    centerY,
    angle,
    length,
    width,
    color
) {

    const endX =
        centerX +
        Math.sin(angle) *
        length;

    const endY =
        centerY -
        Math.cos(angle) *
        length;

    ctx.beginPath();

    ctx.moveTo(
        centerX,
        centerY
    );

    ctx.lineTo(
        endX,
        endY
    );

    ctx.strokeStyle =
        color;

    ctx.lineWidth =
        width;

    ctx.lineCap =
        "round";

    ctx.stroke();
}


drawClock();


const clockTexture =
    new THREE.CanvasTexture(
        clockCanvas
    );

clockTexture.colorSpace =
    THREE.SRGBColorSpace;

clockTexture.minFilter =
    THREE.LinearFilter;

clockTexture.magFilter =
    THREE.LinearFilter;

clockTexture.generateMipmaps =
    false;


const clockMaterial =
    new THREE.MeshBasicMaterial({
        map: clockTexture,
        side: THREE.DoubleSide,
        transparent: false,
        depthWrite: false
    });


const clockImage =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            3.5,
            3.5
        ),
        clockMaterial
    );

clockImage.position.set(
    0,
    0,
    0.35
);

clockImage.rotation.y =
    Math.PI;

clockImage.renderOrder =
    999;

clock.add(
    clockImage
);


setInterval(
    () => {
        drawClock();

        clockTexture.needsUpdate =
            true;
    },
    1000
);


/* =====================================================
   KEY
===================================================== */

const key =
    new THREE.Group();

key.position.set(
    -5.5,
    0.45,
    3.5
);

key.visible = false;

scene.add(
    key
);


const keyGold =
    new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.9,
        roughness: 0.2
    });


const keyRing =
    new THREE.Mesh(
        new THREE.TorusGeometry(
            0.25,
            0.07,
            12,
            24
        ),
        keyGold
    );

key.add(
    keyRing
);


const keyStick =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.7,
            0.08,
            0.08
        ),
        keyGold
    );

keyStick.position.x =
    0.38;

key.add(
    keyStick
);


for (
    let i = 0;
    i < 2;
    i++
) {

    const tooth =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.12,
                0.16,
                0.08
            ),
            keyGold
        );

    tooth.position.set(
        0.55 + i * 0.18,
        -0.04,
        0
    );

    key.add(
        tooth
    );
}


/* =====================================================
   INTERACTABLES
===================================================== */

const interactables = [

    {
        object: painting,
        name: "painting"
    },

    {
        object: bookshelf,
        name: "bookshelf"
    },

    {
        object: drawerCabinet,
        name: "drawer"
    },

    {
        object: computer,
        name: "computer"
    },

    {
        object: key,
        name: "key"
    },

    {
        object: clock,
        name: "clock"
    },

    {
        object: exitDoor,
        name: "exitDoor"
    }
];


/* =====================================================
   MODAL
===================================================== */

const modal =
    document.getElementById(
        "modal"
    );

const modalBody =
    document.getElementById(
        "modal-body"
    );

const closeModal =
    document.getElementById(
        "close-modal"
    );


function openModal(html) {

    if (
        !modal ||
        !modalBody
    ) {
        return;
    }

    modalBody.innerHTML =
        html;

    modal.style.display =
        "flex";
}


if (closeModal) {

    closeModal.onclick =
        () => {

            modal.style.display =
                "none";
        };
}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(message) {

    openModal(`
        <h2>🔎 Mystery Clue</h2>

        <div class="clue-box">
            ${message}
        </div>

        <button
            id="message-close"
            class="puzzle-button"
        >
            Continue
        </button>
    `);


    const button =
        document.getElementById(
            "message-close"
        );


    if (button) {

        button.onclick =
            () => {

                modal.style.display =
                    "none";
            };
    }
}


/* =====================================================
   MISSION UI
===================================================== */

const missionsButton =
    document.getElementById(
        "missions-button"
    );

const missionsPanel =
    document.getElementById(
        "missions-panel"
    );

const missionsClose =
    document.getElementById(
        "missions-close"
    );


const missionHintButton =
    document.getElementById(
        "mission-hint-button"
    );

const missionClueButton =
    document.getElementById(
        "mission-clue-button"
    );

const currentMission =
    document.getElementById(
        "current-mission"
    );

const missionHelpText =
    document.getElementById(
        "mission-help-text"
    );


/* =====================================================
   OPEN MISSIONS
===================================================== */

if (
    missionsButton &&
    missionsPanel
) {

    missionsButton.onclick =
        () => {

            missionsPanel.style.display =
                "block";

            updateMissionUI(
                false
            );
        };
}


/* =====================================================
   CLOSE MISSIONS
===================================================== */

if (
    missionsClose &&
    missionsPanel
) {

    missionsClose.onclick =
        () => {

            missionsPanel.style.display =
                "none";
        };
}


/* =====================================================
   UPDATE MISSION UI
===================================================== */

function updateMissionUI(
    resetHelp = false
) {

    const mission =
        missionData[
            gameState.activeMission - 1
        ];


    if (
        currentMission &&
        mission
    ) {

        currentMission.innerHTML =
            `
            Current Mission:
            <strong>
                ${gameState.activeMission}.
                ${mission.title}
            </strong>
            `;
    }


    for (
        let i = 1;
        i <= 6;
        i++
    ) {

        const missionElement =
            document.getElementById(
                `mission-${i}`
            );


        if (!missionElement) {
            continue;
        }


        const check =
            missionElement.querySelector(
                ".mission-check"
            );


        const title =
            missionElement.querySelector(
                ".mission-title"
            );


        if (
            gameState.completedMissions[
                i - 1
            ]
        ) {

            missionElement.classList.add(
                "completed"
            );

            missionElement.classList.remove(
                "locked"
            );


            if (check) {

                check.textContent =
                    "☑";
            }


            if (title) {

                title.textContent =
                    missionData[
                        i - 1
                    ].title;
            }

        }

        else if (
            i >
            gameState.activeMission
        ) {

            missionElement.classList.add(
                "locked"
            );


            missionElement.classList.remove(
                "completed"
            );


            if (check) {

                check.textContent =
                    "🔒";
            }


            if (title) {

                title.textContent =
                    missionData[
                        i - 1
                    ].title;
            }

        }

        else {

            missionElement.classList.remove(
                "locked"
            );

            missionElement.classList.remove(
                "completed"
            );


            if (check) {

                check.textContent =
                    "☐";
            }


            if (title) {

                title.textContent =
                    missionData[
                        i - 1
                    ].title;
            }
        }
    }


    if (
        resetHelp &&
        missionHelpText
    ) {

        missionHelpText.innerHTML =
            "Use HINT or CLUE to investigate this mission.";
    }
}


/* =====================================================
   HINT BUTTON
===================================================== */

if (
    missionHintButton
) {

    missionHintButton.onclick =
        () => {

            showMissionHint(
                gameState.activeMission
            );
        };
}


/* =====================================================
   CLUE BUTTON
===================================================== */

if (
    missionClueButton
) {

    missionClueButton.onclick =
        () => {

            showMissionClue(
                gameState.activeMission
            );
        };
}


/* =====================================================
   INITIAL MISSION DISPLAY
===================================================== */

updateMissionUI(
    true
);


/* =====================================================
   HINT SYSTEM
===================================================== */

function showMissionHint(
    missionNumber
) {

    const index =
        missionNumber - 1;


    if (
        missionNumber >
        gameState.activeMission
    ) {

        missionHelpText.innerHTML =
            "🔒 Complete the previous mission first.";

        return;
    }


    if (
        gameState.hints <= 0
    ) {

        missionHelpText.innerHTML =
            "❌ You have no hints remaining.";

        return;
    }


    const hints =
        missionData[index].hints;


    if (
        gameState.hintIndex[index] >=
        hints.length
    ) {

        missionHelpText.innerHTML =
            "💡 You have used all hints for this mission.";

        return;
    }


    const hint =
        hints[
            gameState.hintIndex[index]
        ];


    gameState.hintIndex[index]++;

    gameState.hints--;


    missionHelpText.innerHTML =
        `
        <strong>💡 Hint:</strong>
        <br>
        ${hint}
        `;


    updateCounters();
}


/* =====================================================
   CLUE SYSTEM
===================================================== */

function showMissionClue(
    missionNumber
) {

    const index =
        missionNumber - 1;


    if (
        missionNumber >
        gameState.activeMission
    ) {

        missionHelpText.innerHTML =
            "🔒 Complete the previous mission first.";

        return;
    }


    const clues =
        missionData[index].clues;


    if (
        gameState.clueIndex[index] >=
        clues.length
    ) {

        missionHelpText.innerHTML =
            "🔎 You have seen all clues for this mission.";

        return;
    }


    const clue =
        clues[
            gameState.clueIndex[index]
        ];


    gameState.clueIndex[index]++;

    gameState.clues++;


    missionHelpText.innerHTML =
        `
        <strong>🔎 Clue:</strong>
        <br>
        ${clue}
        `;


    updateCounters();
}


/* =====================================================
   COMPLETE MISSION
===================================================== */

function completeMission(
    number
) {

    const index =
        number - 1;


    if (
        gameState.completedMissions[index]
    ) {
        return;
    }


    gameState.completedMissions[index] =
        true;


    if (
        number < 6
    ) {

        gameState.activeMission =
            number + 1;
    }


    updateCounters();

    updateMissionUI(true);
}


/* =====================================================
   COUNTERS
===================================================== */

function updateCounters() {

    const clues =
        document.getElementById(
            "clues-found"
        );

    const puzzles =
        document.getElementById(
            "puzzles-solved"
        );

    const hints =
        document.getElementById(
            "hints-left"
        );


    if (clues) {
        clues.textContent =
            gameState.clues;
    }

    if (puzzles) {
        puzzles.textContent =
            gameState.puzzles;
    }

    if (hints) {
        hints.textContent =
            gameState.hints;
    }
}


/* =====================================================
   PAINTING PUZZLE
===================================================== */

function showPainting() {

    if (gameState.paintingStep === 0) {

        const image =
            paintingCanvas.toDataURL("image/png");

        openModal(`
            <style>

                .slide-puzzle {
                    width: 330px;
                    height: 330px;
                    margin: 20px auto;
                    padding: 5px;

                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-template-rows: repeat(3, 1fr);
                    gap: 5px;

                    background: #111827;
                    border-radius: 14px;
                }

                .slide-tile {
                    border: none;
                    border-radius: 8px;

                    background-image: url('${image}');
                    background-size: 300% 300%;
                    background-repeat: no-repeat;

                    cursor: pointer;

                    transition: transform 0.12s ease;
                }

                .slide-tile:hover {
                    transform: scale(0.96);
                }

                .slide-tile.blank {
                    background: #1f2937;
                    cursor: default;
                }

                .puzzle-title {
                    text-align: center;
                    font-size: 25px;
                    font-weight: 800;
                    margin-bottom: 5px;
                }

                .puzzle-subtitle {
                    text-align: center;
                    color: #64748b;
                    margin-bottom: 12px;
                }

                .puzzle-moves {
                    text-align: center;
                    font-weight: 700;
                    margin: 10px;
                }

                .puzzle-code {
                    margin-top: 18px;
                    padding: 18px;
                    border-radius: 12px;

                    background: #ecfdf5;
                    border: 2px solid #22c55e;

                    text-align: center;
                }

                .access-code {
                    margin: 10px 0;

                    font-size: 34px;
                    font-weight: 900;
                    letter-spacing: 8px;

                    color: #166534;
                }

            </style>

            <h2 class="puzzle-title">
                🧩 Painting Puzzle
            </h2>

            <p class="puzzle-subtitle">
                Arrange the pieces to restore the painting.
            </p>

            <div
                id="slide-puzzle"
                class="slide-puzzle">
            </div>

            <div class="puzzle-moves">
                Moves:
                <span id="slide-moves">0</span>
            </div>

            <div id="puzzle-result"></div>
        `);

        const puzzle =
            document.getElementById(
                "slide-puzzle"
            );

        const movesElement =
            document.getElementById(
                "slide-moves"
            );

        const result =
            document.getElementById(
                "puzzle-result"
            );

        let tiles = [
            0, 1, 2,
            3, 4, 5,
            6, 7, 8
        ];

        let moves = 0;


        function isAdjacent(a, b) {

            const rowA =
                Math.floor(a / 3);

            const colA =
                a % 3;

            const rowB =
                Math.floor(b / 3);

            const colB =
                b % 3;

            return (
                Math.abs(rowA - rowB) +
                Math.abs(colA - colB)
            ) === 1;
        }


        function shufflePuzzle() {

            let blank = 8;

            for (let i = 0; i < 100; i++) {

                const possible = [];

                for (let j = 0; j < 9; j++) {

                    if (
                        j !== blank &&
                        isAdjacent(j, blank)
                    ) {
                        possible.push(j);
                    }
                }

                const selected =
                    possible[
                        Math.floor(
                            Math.random() *
                            possible.length
                        )
                    ];

                [
                    tiles[selected],
                    tiles[blank]
                ] = [
                    tiles[blank],
                    tiles[selected]
                ];

                blank = selected;
            }
        }


        function renderPuzzle() {

            puzzle.innerHTML = "";

            tiles.forEach(
                (tileNumber, position) => {

                    const button =
                        document.createElement(
                            "button"
                        );

                    button.className =
                        "slide-tile";


                    if (tileNumber === 8) {

                        button.classList.add(
                            "blank"
                        );

                    } else {

                        const row =
                            Math.floor(
                                tileNumber / 3
                            );

                        const col =
                            tileNumber % 3;

                        button.style.backgroundPosition =
                            `${col * 50}% ${row * 50}%`;

                        button.onclick =
                            () => moveTile(
                                position
                            );
                    }

                    puzzle.appendChild(
                        button
                    );
                }
            );
        }


        function moveTile(position) {

            const blank =
                tiles.indexOf(8);

            if (
                !isAdjacent(
                    position,
                    blank
                )
            ) {
                return;
            }

            [
                tiles[position],
                tiles[blank]
            ] = [
                tiles[blank],
                tiles[position]
            ];

            moves++;

            movesElement.textContent =
                moves;

            renderPuzzle();

            checkSolved();
        }


        function checkSolved() {

            const solved =
                tiles.every(
                    (value, index) =>
                        value === index
                );

            if (!solved) {
                return;
            }


            gameState.paintingStep = 1;

            gameState.puzzles++;


            result.innerHTML = `

                <div class="puzzle-code">

                    <strong>
                        🎉 PUZZLE SOLVED!
                    </strong>

                    <br><br>

                    ACCESS CODE

                    <div class="access-code">
                        ${puzzleSet.paintingCode}
                    </div>

                    <p>
                        🔓 Bookshelf access unlocked.
                    </p>

                    <p>
                        Use this code at the bookshelf.
                    </p>

                </div>

            `;

            completeMission(1);
        }


        shufflePuzzle();

        renderPuzzle();
    }

    else {

        openModal(`

            <h2>
                🧩 Painting Puzzle
            </h2>

            <div class="clue-box">
                🔓 Painting already solved.
            </div>

            <p>
                Access code:
            </p>

            <div class="clue-box">
                <strong>
                    ${puzzleSet.paintingCode}
                </strong>
            </div>

            <p>
                Go to the bookshelf.
            </p>

        `);
    }
}

/* =====================================================
   BOOKSHELF PUZZLE
===================================================== */

function showBookshelf() {

    if (
        gameState.paintingStep === 0
    ) {

        showMessage(
            "🔒 First solve the painting puzzle."
        );

        return;
    }


    if (
        gameState.bookshelfAccessGranted !== true
    ) {

        openModal(`

            <h2>
                🔐 Bookshelf Locked
            </h2>

            <p>
                The painting gave you an access code.
            </p>

            <p>
                Enter the code to unlock the bookshelf.
            </p>

            <input
                id="access-code-input"
                class="puzzle-input"
                placeholder="Enter access code"
                maxlength="4"
            >

            <button
                id="access-code-submit"
                class="puzzle-button"
            >
                🔓 Unlock Bookshelf
            </button>

            <div
                id="access-code-result"
                class="puzzle-result">
            </div>

        `);


        document
            .getElementById(
                "access-code-submit"
            )
            .onclick = function () {

                const answer =
                    document
                    .getElementById(
                        "access-code-input"
                    )
                    .value
                    .trim();


                const result =
                    document
                    .getElementById(
                        "access-code-result"
                    );


                if (
                    answer ===
                    String(
                        puzzleSet.paintingCode
                    )
                ) {

                    gameState.bookshelfAccessGranted =
                        true;


                    result.innerHTML = `

                        <div class="puzzle-code">

                            <strong>
                                ✅ ACCESS GRANTED!
                            </strong>

                            <br><br>

                            📚 Bookshelf unlocked.

                            <br><br>

                            <button
                                class="puzzle-button"
                                id="continue-bookshelf"
                            >
                                Continue
                            </button>

                        </div>

                    `;


                    document
                        .getElementById(
                            "continue-bookshelf"
                        )
                        .onclick = function () {

                            showBookshelf();

                        };

                }

                else {

                    result.innerHTML = `

                        <span style="color:#dc2626;">
                            ❌ Incorrect access code.
                        </span>

                        <br><br>

                        Check the code shown
                        after solving the painting.

                    `;
                }
            };

        return;
    }


    if (
        gameState.bookshelfStep === 0
    ) {

        openModal(`

            <h2>
                📚 Mystery Bookshelf
            </h2>

            <p>
                Four books have been marked.
            </p>

            <div class="clue-box">

                ${puzzleSet.bookshelfLetters.join(
                    "   "
                )}

            </div>

            <p>
                🔤
                <strong>
                    LOGIC: ALPHABET POSITION
                </strong>
            </p>

            <p>
                A = 1, B = 2, C = 3...
            </p>

            <input
                id="puzzle-answer"
                class="puzzle-input"
                placeholder="Enter password"
                type="text"
                maxlength="20"
                autocomplete="off"
            >

            <button
                id="submit-puzzle"
                class="puzzle-button"
            >
                Submit
            </button>

            <div
                id="puzzle-result"
                class="puzzle-result">
            </div>

        `);


        document
            .getElementById(
                "submit-puzzle"
            )
            .onclick = function () {

                const answer =
                    document
                    .getElementById(
                        "puzzle-answer"
                    )
                    .value
                    .trim();


                const result =
                    document
                    .getElementById(
                        "puzzle-result"
                    );


                if (
                    answer ===
                    puzzleSet.bookshelfCode
                ) {

                    gameState.bookshelfStep =
                        1;

                    gameState.puzzles++;


                    result.innerHTML = `

                        ✅
                        <strong>
                            Bookshelf solved!
                        </strong>

                        <br><br>

                        ${puzzleSet.bookshelfLetters
                            .map(
                                (letter, index) =>
                                    `${letter} → ${puzzleSet.bookshelfNumbers[index]}`
                            )
                            .join("<br>")}

                        <br><br>

                        <strong>
                            ${puzzleSet.bookshelfCode}
                        </strong>

                        <br><br>

                        📄 A strange note falls out.

                        <br><br>

                        <strong>
                            ${puzzleSet.drawerRomans.join(
                                " - "
                            )}
                        </strong>

                        <br><br>

                        The drawer contains the next clue.

                    `;


                    completeMission(2);

                }

                else {

                    result.innerHTML = `

                        ❌ Wrong.

                        <br><br>

                        Convert each marked letter
                        into its alphabet position.

                    `;
                }
            };

        return;
    }


    openModal(`

        <h2>
            📄 Bookshelf Note
        </h2>

        <div class="clue-box">

            ${puzzleSet.drawerRomans.join(
                " - "
            )}

        </div>

        <p>
            Convert the Roman numerals into numbers.
        </p>

    `);
}

/* =====================================================
   DRAWER PUZZLE
===================================================== */

function showDrawer() {

    if (
        gameState.activeMission < 3
    ) {

        showMessage(
            "🔒 Solve the bookshelf first."
        );

        return;
    }


    if (
        gameState.drawerStep === 0
    ) {

        openModal(`

            <h2>🔐 Locked Drawer</h2>

            <p>
                The bookshelf revealed:
            </p>

            <div class="clue-box">
                ${puzzleSet.drawerRomans.join(
                    " - "
                )}
            </div>

            <p>
                🔎 Convert every Roman numeral.
            </p>

            <p>
                The order matters.
            </p>

            <input
                id="puzzle-answer"
                class="puzzle-input"
                placeholder="Enter drawer code"
                maxlength="4"
            >

            <button
                id="submit-puzzle"
                class="puzzle-button"
            >
                Unlock
            </button>

            <div
                id="puzzle-result"
                class="puzzle-result"
            ></div>
        `);


        document
            .getElementById(
                "submit-puzzle"
            )
            .onclick =
            () => {

                const answer =
                    document
                    .getElementById(
                        "puzzle-answer"
                    )
                    .value
                    .trim();


                const result =
                    document
                    .getElementById(
                        "puzzle-result"
                    );


                if (
                    answer ===
                    puzzleSet.drawerCode
                ) {

                    gameState.drawerStep =
                        1;

                    gameState.puzzles++;


                    result.innerHTML =
                        `
                        ✅ Drawer unlocked!

                        <br><br>

                        ${puzzleSet.drawerRomans
                            .map(
                                (roman, index) =>
                                    `${roman} → ${puzzleSet.drawerNumbers[index]}`
                            )
                            .join("<br>")}

                        <br><br>

                        Inside is a strange four-line message:

                        <br><br>

                        <div class="clue-box">

                        ${puzzleSet.selectedWords[0]} the hidden terminal.<br>
                        ${puzzleSet.selectedWords[1]} the security panel.<br>
                        ${puzzleSet.selectedWords[2]} the access code.<br>
                        ${puzzleSet.selectedWords[3]} the final instruction.

                        </div>

                        <br>

                        🔎 Take the first letter of every line.
                        `;


                    completeMission(3);

                } else {

                    result.innerHTML =
                        `
                        ❌ Wrong.

                        <br><br>

                        Convert the Roman numerals carefully.
                        `;
                }
            };

        return;
    }


    openModal(`

        <h2>📄 Drawer Note</h2>

        <div class="clue-box">

            ${puzzleSet.selectedWords[0]} the hidden terminal.<br>
            ${puzzleSet.selectedWords[1]} the security panel.<br>
            ${puzzleSet.selectedWords[2]} the access code.<br>
            ${puzzleSet.selectedWords[3]} the final instruction.

        </div>

        <p>
            Take the first letter of each line.
        </p>

    `);
}


/* =====================================================
   COMPUTER PUZZLE
===================================================== */

function showComputer() {

    if (
        gameState.activeMission < 4
    ) {

        showMessage(
            "🔒 Unlock the drawer first."
        );

        return;
    }


    const hiddenMessage =
        puzzleSet.selectedWords
            .map(
                word =>
                    `${word} the hidden system.`
            );


    if (
        gameState.computerStep === 0
    ) {

        openModal(`

            <h2>🖥️ Laboratory Computer</h2>

            <p>
                The drawer gave you a hidden message.
            </p>

            <div class="clue-box">

                ${hiddenMessage[0]}<br>
                ${hiddenMessage[1]}<br>
                ${hiddenMessage[2]}<br>
                ${hiddenMessage[3]}

            </div>

            <p>
                Take the first letter of every line.
            </p>

            <input
                id="puzzle-answer"
                class="puzzle-input"
                placeholder="Enter password"
            >

            <button
                id="submit-puzzle"
                class="puzzle-button"
            >
                Login
            </button>

            <div
                id="puzzle-result"
                class="puzzle-result"
            ></div>

        `);


        document
            .getElementById(
                "submit-puzzle"
            )
            .onclick =
            () => {

                const answer =
                    document
                    .getElementById(
                        "puzzle-answer"
                    )
                    .value
                    .trim()
                    .toUpperCase();


                const result =
                    document
                    .getElementById(
                        "puzzle-result"
                    );


                if (
                    answer ===
                    puzzleSet.computerPassword
                ) {

                    gameState.computerStep =
                        1;


                    result.innerHTML =
                        `
                        ✅ LOGIN ACCEPTED!

                        <br><br>

                        Password:

                        <strong>
                            ${puzzleSet.computerPassword}
                        </strong>

                        <br><br>

                        The computer has unlocked
                        another mathematical puzzle.

                        <br><br>

                        <strong>
                            ${puzzleSet.mathExpression}
                        </strong>
                        `;

                } else {

                    result.innerHTML =
                        `
                        ❌ Incorrect password.

                        <br><br>

                        Look at the first letter
                        of every line.
                        `;
                }
            };

        return;
    }


    if (
        gameState.computerStep === 1
    ) {

        openModal(`

            <h2>🖥️ Security Calculation</h2>

            <p>
                LOGIN ACCEPTED
            </p>

            <div class="clue-box">

                🧮 LOGIC: OPERATOR PRECEDENCE

                <br><br>

                Solve:

                <br><br>

                <strong>
                    ${puzzleSet.mathExpression}
                </strong>

            </div>

            <input
                id="puzzle-answer"
                class="puzzle-input"
                placeholder="Enter answer"
            >

            <button
                id="submit-puzzle"
                class="puzzle-button"
            >
                Submit
            </button>

            <div
                id="puzzle-result"
                class="puzzle-result"
            ></div>

        `);


        document
            .getElementById(
                "submit-puzzle"
            )
            .onclick =
            () => {

                const answer =
                    document
                    .getElementById(
                        "puzzle-answer"
                    )
                    .value
                    .trim();


                const result =
                    document
                    .getElementById(
                        "puzzle-result"
                    );


                if (
                    answer ===
                    String(
                        puzzleSet.mathAnswer
                    )
                ) {

                    gameState.computerStep =
                        2;

                    gameState.keyFound =
                        true;

                    gameState.puzzles++;

                    key.visible =
                        true;


                    result.innerHTML =
                        `
                        ✅ Computer hacked!

                        <br><br>

                        ${puzzleSet.mathExpression}
                        =
                        ${puzzleSet.mathAnswer}

                        <br><br>

                        The computer displays:

                        <div class="clue-box">

                        KEY LOCATION:

                        <br><br>

                        UNDER THE PAINTING TABLE

                        </div>

                        <br>

                        Find the key.
                        `;


                    completeMission(4);

                } else {

                    result.innerHTML =
                        `
                        ❌ Wrong answer.

                        <br><br>

                        Remember operator precedence:
                        multiplication is performed before
                        addition or subtraction.
                        `;
                }
            };

        return;
    }


    openModal(`

        <h2>🖥️ Computer</h2>

        <div class="clue-box">
            KEY LOCATION:
            <br><br>
            UNDER THE PAINTING TABLE
        </div>

        <p>
            Find and inspect the key.
        </p>

    `);
}


/* =====================================================
   KEY INTERACTION
===================================================== */

function showKey() {

    if (
        !gameState.keyFound
    ) {

        showMessage(
            "🔒 The key has not appeared yet."
        );

        return;
    }


    if (
        !gameState.keyInspected
    ) {

        gameState.keyInspected =
            true;


        openModal(`

            <h2>🔑 Laboratory Key</h2>

            <p>
                You found the key underneath
                the painting table.
            </p>

            <div class="clue-box">

                ${puzzleSet.keyRomanSequence.join(
                    " → "
                )}
                →
                ?

            </div>

            <p>
                🧮
                <strong>
                    LOGIC: NUMBER PATTERN
                </strong>
            </p>

            <p>
                Find the rule used by the sequence.
            </p>

            <p>
                The next number is:
                <strong>
                    ${puzzleSet.keyNextRoman}
                </strong>
            </p>

            <p>
                Use
                <strong>
                    ${puzzleSet.keyNext}
                </strong>
                as the starting number on the clock.
            </p>

        `);


        completeMission(5);

        return;
    }


    openModal(`

        <h2>🔑 Key Clue</h2>

        <div class="clue-box">

            ${puzzleSet.keyRomanSequence.join(
                " → "
            )}
            →
            ${puzzleSet.keyNextRoman}

        </div>

        <p>
            Starting number:
            <strong>
                ${puzzleSet.keyNext}
            </strong>
        </p>

        <p>
            Find that number on the clock
            and follow the marked numbers clockwise.
        </p>

    `);
}


/* =====================================================
   CLOCK INTERACTION
===================================================== */

function showClock() {

    if (
        gameState.activeMission < 6
    ) {

        showMessage(
            "🔒 Find and inspect the key first."
        );

        return;
    }


    if (
        !gameState.clockChecked
    ) {

        openModal(`

            <h2>🕒 Wall Clock</h2>

            <p>
                The key gave you the starting number.
            </p>

            <div class="clue-box">

                KEY START:

                <br><br>

                <strong>
                    ${puzzleSet.keyNext}
                </strong>

                <br><br>

                MARKED NUMBERS:

                <br><br>

                ${puzzleSet.clockMarkedNumbers.join(
                    "   "
                )}

            </div>

            <p>
                Find the marked numbers on the clock.
            </p>

            <p>
                Begin at
                <strong>
                    ${puzzleSet.keyNext}
                </strong>
                and read clockwise.
            </p>

            <input
                id="puzzle-answer"
                class="puzzle-input"
                placeholder="Enter clock code"
                maxlength="10"
            >

            <button
                id="submit-puzzle"
                class="puzzle-button"
            >
                Check
            </button>

            <div
                id="puzzle-result"
                class="puzzle-result"
            ></div>

        `);


        document
            .getElementById(
                "submit-puzzle"
            )
            .onclick =
            () => {

                const answer =
                    document
                    .getElementById(
                        "puzzle-answer"
                    )
                    .value
                    .trim();


                const result =
                    document
                    .getElementById(
                        "puzzle-result"
                    );


                if (
                    answer ===
                    puzzleSet.clockCode
                ) {

                    gameState.clockChecked =
                        true;

                    gameState.clues++;


                    result.innerHTML =
                        `
                        ✅ Clock puzzle solved!

                        <br><br>

                        Clockwise order:

                        <div class="clue-box">

                        ${puzzleSet.clockMarkedNumbers.join(
                            " → "
                        )}

                        </div>

                        <br>

                        <strong>
                            FINAL CODE:
                            ${puzzleSet.clockCode}
                        </strong>

                        <br><br>

                        Go to the exit door.
                        `;


                    updateCounters();

                } else {

                    result.innerHTML =
                        `
                        ❌ Wrong clock code.

                        <br><br>

                        Start at
                        <strong>
                            ${puzzleSet.keyNext}
                        </strong>
                        and follow the red marked numbers clockwise.
                        `;
                }
            };

        return;
    }


    openModal(`

        <h2>🕒 Final Clock Clue</h2>

        <div class="clue-box">

            ${puzzleSet.clockMarkedNumbers.join(
                " → "
            )}

        </div>

        <p>
            Final code:
            <strong>
                ${puzzleSet.clockCode}
            </strong>
        </p>

    `);
}


/* =====================================================
   EXIT
===================================================== */

function showExit() {

    if (
        gameState.activeMission < 6
    ) {

        showMessage(
            "🔒 Complete the previous missions first."
        );

        return;
    }


    if (
        !gameState.clockChecked
    ) {

        showMessage(
            "🕒 Solve the wall clock first."
        );

        return;
    }


    openModal(`

        <h2>🚪 Laboratory Exit</h2>

        <p>
            The clock revealed the final pattern.
        </p>

        <div class="clue-box">

            ${puzzleSet.clockMarkedNumbers.join(
                " → "
            )}

        </div>

        <p>
            Enter the final security code.
        </p>

        <input
            id="puzzle-answer"
            class="puzzle-input"
            placeholder="Enter final code"
            maxlength="20"
        >

        <button
            id="submit-puzzle"
            class="puzzle-button"
        >
            Escape
        </button>

        <div
            id="puzzle-result"
            class="puzzle-result"
        ></div>

    `);


    document
        .getElementById(
            "submit-puzzle"
        )
        .onclick =
        () => {

            const answer =
                document
                .getElementById(
                    "puzzle-answer"
                )
                .value
                .trim();


            const result =
                document
                .getElementById(
                    "puzzle-result"
                );


            if (
                answer ===
                puzzleSet.clockCode
            ) {

                gameState.escaped =
                    true;


                completeMission(6);


                result.innerHTML =
                    `
                    🎉 ESCAPE SUCCESSFUL!

                    <br><br>

                    You solved every randomized puzzle.

                    <br><br>

                    Final code:
                    <strong>
                        ${puzzleSet.clockCode}
                    </strong>
                    `;


                setTimeout(
                    () => {

                        const form =
                            document.createElement(
                                "form"
                            );

                        form.method =
                            "POST";

                        form.action =
                            "/result";


                        const scoreInput =
                            document.createElement(
                                "input"
                            );

                        scoreInput.name =
                            "score";

                        scoreInput.value =
                            1000 +
                            gameState.puzzles *
                            100;

                        form.appendChild(
                            scoreInput
                        );


                        const timeInput =
                            document.createElement(
                                "input"
                            );

                        timeInput.name =
                            "time_remaining";

                        timeInput.value =
                            timeLeft;

                        form.appendChild(
                            timeInput
                        );


                        const hintsInput =
                            document.createElement(
                                "input"
                            );

                        hintsInput.name =
                            "hints_used";

                        hintsInput.value =
                            3 -
                            gameState.hints;

                        form.appendChild(
                            hintsInput
                        );


                        document.body.appendChild(
                            form
                        );

                        form.submit();

                    },
                    1500
                );

            } else {

                result.innerHTML =
                    `
                    ❌ Wrong final code.

                    <br><br>

                    Follow the clock pattern again.
                    `;
            }
        };
}


/* =====================================================
   INTERACTION
===================================================== */

function updateInteractionPrompt() {

    const prompt =
        document.getElementById("interaction-prompt");

    if (!prompt) return;

    const object =
        getNearestInteractable();

    if (!object) {

        prompt.style.display = "none";

        return;
    }

    if (
        window.innerWidth <= 768 ||
        window.matchMedia("(pointer: coarse)").matches
    ) {

        prompt.textContent =
            "Tap to Explore";

    } else {

        prompt.textContent =
            "Press E to Explore";
    }

    prompt.style.display = "block";
}


function interact(objectName) {

    if (objectName === "painting") {

        showPainting();

    } else if (objectName === "bookshelf") {

        showBookshelf();

    } else if (objectName === "drawer") {

        showDrawer();

    } else if (objectName === "computer") {

        showComputer();

    } else if (objectName === "key") {

        showKey();

    } else if (objectName === "clock") {

        showClock();

    } else if (objectName === "exitDoor") {

        showExit();
    }
}


/* =====================================================
   PC E KEY
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        const activeElement =
            document.activeElement;

        if (
            activeElement &&
            (
                activeElement.tagName === "INPUT" ||
                activeElement.tagName === "TEXTAREA"
            )
        ) {
            return;
        }

        if (
            event.key.toLowerCase() === "e" &&
            !event.repeat
        ) {

            const object =
                getNearestInteractable();

            if (object) {

                interact(object.name);
            }
        }
    }
);

/* =====================================================
   MOBILE TAP + LOOK
===================================================== */

(function setupMobileTapAndLook() {

    const mobileLookZone = document.getElementById("look-zone");

    if (!mobileLookZone) {
        return;
    }

    let mobileLooking = false;
    let mobileLastX = 0;
    let mobileLastY = 0;
    let mobileTapMoved = false;

    mobileLookZone.addEventListener(
        "pointerdown",
        function (event) {

            event.preventDefault();

            mobileLooking = true;
            mobileTapMoved = false;

            mobileLastX = event.clientX;
            mobileLastY = event.clientY;

            mobileLookZone.setPointerCapture(
                event.pointerId
            );
        }
    );

    mobileLookZone.addEventListener(
        "pointermove",
        function (event) {

            if (!mobileLooking) {
                return;
            }

            event.preventDefault();

            const deltaX =
                event.clientX - mobileLastX;

            const deltaY =
                event.clientY - mobileLastY;

            if (
                Math.abs(deltaX) > 8 ||
                Math.abs(deltaY) > 8
            ) {
                mobileTapMoved = true;
            }

            yaw -= deltaX * 0.008;

            pitch -= deltaY * 0.008;

            pitch = Math.max(
                -1.4,
                Math.min(
                    1.4,
                    pitch
                )
            );

            mobileLastX = event.clientX;
            mobileLastY = event.clientY;
        }
    );

    mobileLookZone.addEventListener(
        "pointerup",
        function (event) {

            event.preventDefault();

            mobileLooking = false;

            if (!mobileTapMoved) {
                checkInteraction();
            }
        }
    );

    mobileLookZone.addEventListener(
        "pointercancel",
        function () {

            mobileLooking = false;
        }
    );

})();

/* =====================================================
   RAYCASTING
===================================================== */

const raycaster =
    new THREE.Raycaster();

const center =
    new THREE.Vector2(
        0,
        0
    );


function checkInteraction() {

    raycaster.setFromCamera(
        center,
        camera
    );


    const objects = [];


    for (
        const item of interactables
    ) {

        item.object.traverse(
            child => {

                if (
                    child.isMesh &&
                    child.visible
                ) {

                    child.userData.parentObject =
                        item.name;

                    objects.push(
                        child
                    );
                }
            }
        );
    }


    const hits =
        raycaster.intersectObjects(
            objects,
            false
        );


    if (
        hits.length === 0
    ) {
        return;
    }


    const hitPoint =
        hits[0]
        .object
        .getWorldPosition(
            new THREE.Vector3()
        );


    const distance =
        player.position.distanceTo(
            hitPoint
        );


    if (
        distance > 6
    ) {
        return;
    }


    const name =
        hits[0]
        .object
        .userData
        .parentObject;


    interact(
        name
    );
}


/* =====================================================
   KEYBOARD
===================================================== */

const keys = {};


document.addEventListener(
    "keydown",
    event => {

        keys[
            event.key.toLowerCase()
        ] = true;


        if (
            event.key.toLowerCase() ===
            "e"
        ) {

            checkInteraction();
        }
    }
);


document.addEventListener(
    "keyup",
    event => {

        keys[
            event.key.toLowerCase()
        ] = false;
    }
);


/* =====================================================
   MOUSE LOOK
===================================================== */

let yaw = 0;
let pitch = 0;


document.addEventListener(
    "mousemove",
    event => {

        if (
            document.pointerLockElement !==
            renderer.domElement
        ) {
            return;
        }


        yaw -=
            event.movementX *
            0.002;


        pitch -=
            event.movementY *
            0.002;


        pitch =
            Math.max(
                -1.4,
                Math.min(
                    1.4,
                    pitch
                )
            );
    }
);


renderer.domElement.addEventListener(
    "click",
    () => {

        renderer.domElement.requestPointerLock();
    }
);


/* =====================================================
   MOVEMENT
===================================================== */

function movePlayer() {

    const speed = 0.09;

    const direction =
        new THREE.Vector3();


    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        direction.z -= 1;
    }


    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        direction.z += 1;
    }


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        direction.x -= 1;
    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        direction.x += 1;
    }


    if (
        direction.length() > 0
    ) {

        direction.normalize();


        direction.applyAxisAngle(
            new THREE.Vector3(
                0,
                1,
                0
            ),
            yaw
        );


        player.position.add(
            direction.multiplyScalar(
                speed
            )
        );
    }


    player.position.x =
        THREE.MathUtils.clamp(
            player.position.x,
            -8.7,
            8.7
        );


    player.position.z =
        THREE.MathUtils.clamp(
            player.position.z,
            -8.7,
            8.7
        );
}


/* =====================================================
   CAMERA
===================================================== */

function updateCamera() {

    camera.rotation.order =
        "YXZ";

    camera.rotation.y =
        yaw;

    camera.rotation.x =
        pitch;
}


/* =====================================================
   MOBILE TOUCH CONTROLS
===================================================== */

const joystickZone =
    document.getElementById("joystick-zone");

const joystickKnob =
    document.getElementById("joystick-knob");

let joystickActive = false;
let joystickStartX = 0;
let joystickStartY = 0;

const joystickMax = 55;

function resetJoystick() {

    joystickActive = false;

    if (joystickKnob) {
        joystickKnob.style.transform =
            "translate(-50%, -50%)";
    }

    keys["w"] = false;
    keys["s"] = false;
    keys["a"] = false;
    keys["d"] = false;
}

function updateJoystick(x, y) {

    let dx = x - joystickStartX;
    let dy = y - joystickStartY;

    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    if (distance > joystickMax) {

        const scale =
            joystickMax / distance;

        dx *= scale;
        dy *= scale;
    }

    if (joystickKnob) {

        joystickKnob.style.transform =
            `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    }

    keys["a"] = dx < -15;
    keys["d"] = dx > 15;

    keys["w"] = dy < -15;
    keys["s"] = dy > 15;
}

if (joystickZone) {

    joystickZone.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            joystickActive = true;

            const rect =
                joystickZone.getBoundingClientRect();

            joystickStartX =
                rect.left +
                rect.width / 2;

            joystickStartY =
                rect.top +
                rect.height / 2;

            joystickZone.setPointerCapture(
                event.pointerId
            );

            updateJoystick(
                event.clientX,
                event.clientY
            );
        }
    );

    joystickZone.addEventListener(
        "pointermove",
        function(event) {

            if (!joystickActive) {
                return;
            }

            event.preventDefault();

            updateJoystick(
                event.clientX,
                event.clientY
            );
        }
    );

    joystickZone.addEventListener(
        "pointerup",
        function(event) {

            event.preventDefault();

            resetJoystick();
        }
    );

    joystickZone.addEventListener(
        "pointercancel",
        function() {

            resetJoystick();
        }
    );

    joystickZone.addEventListener(
        "pointerup",
        function(event) {
            event.preventDefault();
            resetJoystick();
        }
    );

    joystickZone.addEventListener(
        "pointercancel",
        function() {
            resetJoystick();
        }
    );
}


/* =====================================================
   MOBILE ARROW BUTTONS
===================================================== */

function bindMovementButton(id, key) {

    const button =
        document.getElementById(id);

    if (!button) {
        return;
    }

    button.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            keys[key] = true;
        }
    );

    button.addEventListener(
        "pointerup",
        function(event) {

            event.preventDefault();

            keys[key] = false;
        }
    );

    button.addEventListener(
        "pointercancel",
        function() {

            keys[key] = false;
        }
    );

    button.addEventListener(
        "pointerleave",
        function() {

            keys[key] = false;
        }
    );
}

bindMovementButton(
    "move-up",
    "w"
);

bindMovementButton(
    "move-down",
    "s"
);

bindMovementButton(
    "move-left",
    "a"
);

bindMovementButton(
    "move-right",
    "d"
);


/* =====================================================
   MOBILE LOOK + TAP TO INTERACT
===================================================== */

const lookZone =
    document.getElementById("look-zone");

let looking = false;

let lastLookX = 0;
let lastLookY = 0;

let mobileTapMoved = false;


if (lookZone) {

    lookZone.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            looking = true;

            mobileTapMoved = false;

            lastLookX =
                event.clientX;

            lastLookY =
                event.clientY;

            lookZone.setPointerCapture(
                event.pointerId
            );
        }
    );


    lookZone.addEventListener(
        "pointermove",
        function(event) {

            if (!looking) {
                return;
            }

            event.preventDefault();

            const deltaX =
                event.clientX - lastLookX;

            const deltaY =
                event.clientY - lastLookY;


            if (
                Math.abs(deltaX) > 8 ||
                Math.abs(deltaY) > 8
            ) {

                mobileTapMoved = true;
            }


            yaw -=
                deltaX * 0.008;

            pitch -=
                deltaY * 0.008;


            pitch =
                Math.max(
                    -1.4,
                    Math.min(
                        1.4,
                        pitch
                    )
                );


            lastLookX =
                event.clientX;

            lastLookY =
                event.clientY;
        }
    );


    lookZone.addEventListener(
        "pointerup",
        function(event) {

            event.preventDefault();

            looking = false;


            /*
             * If finger only tapped,
             * interact with the object
             * currently under the crosshair.
             */

            if (!mobileTapMoved) {

                checkInteraction();
            }
        }
    );


    lookZone.addEventListener(
        "pointercancel",
        function() {

            looking = false;
        }
    );
}


/* =====================================================
   TIMER
===================================================== */

let timeLeft =
    15 * 60;

const timerElement =
    document.getElementById(
        "timer"
    );

let timer;


function updateTimer() {

    const minutes =
        Math.floor(
            timeLeft / 60
        );

    const seconds =
        timeLeft % 60;


    if (timerElement) {

        timerElement.textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }


    if (
        timeLeft <= 0
    ) {

        clearInterval(
            timer
        );

        alert(
            "⏰ Time's up!"
        );

        return;
    }


    timeLeft--;
}


timer =
    setInterval(
        updateTimer,
        1000
    );

updateTimer();


/* =====================================================
   RESIZE
===================================================== */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);


/* =====================================================
   START
===================================================== */

updateCounters();

updateMissionUI(true);


/* =====================================================
   DEBUG
   Remove this section for production.
===================================================== */

console.log(
    "RANDOM PUZZLE SET:",
    puzzleSet
);


/* =====================================================
   ANIMATION
===================================================== */

function animate() {

    requestAnimationFrame(
        animate
    );

    movePlayer();

    updateCamera();

    renderer.render(
        scene,
        camera
    );
}

animate();