let cluesFound = 0;
let puzzlesSolved = 0;
let hintsUsed = 0;
let hintsLeft = 3;

let paintingSolved = false;
let booksSolved = false;
let drawerSolved = false;
let computerSolved = false;
let keySolved = false;
let clockSolved = false;

let puzzleData = null;

let paintingAttempts = 0;
let bookshelfAttempts = 0;
let drawerAttempts = 0;
let computerAttempts = 0;
let keyAttempts = 0;
let clockAttempts = 0;


/* =====================================================
   LOAD RANDOM PUZZLE
===================================================== */

async function loadPuzzle() {

    try {

        const response =
            await fetch("/api/puzzle");

        if (!response.ok) {
            throw new Error("Puzzle API failed");
        }

        puzzleData =
            await response.json();

        console.log("Random puzzle loaded:", puzzleData);

    } catch (error) {

        console.error(
            "Unable to load puzzle:",
            error
        );

        showModal(`
            <h2>⚠️ Puzzle Loading Error</h2>

            <p>
                The mystery could not load correctly.
            </p>

            <p>
                Please refresh the game.
            </p>
        `);
    }
}


/* =====================================================
   MODAL
===================================================== */

function showModal(content) {

    const modal =
        document.getElementById("modal");

    const body =
        document.getElementById("modal-body");

    if (!modal || !body) {
        return;
    }

    body.innerHTML = content;

    modal.style.display = "flex";
}


function closeModal() {

    const modal =
        document.getElementById("modal");

    if (modal) {
        modal.style.display = "none";
    }
}


/* =====================================================
   PROGRESS
===================================================== */

function updateProgress() {

    const clues =
        document.getElementById("clues-found");

    const puzzles =
        document.getElementById("puzzles-solved");

    const hints =
        document.getElementById("hints-left");

    if (clues) {
        clues.textContent = cluesFound;
    }

    if (puzzles) {
        puzzles.textContent = puzzlesSolved;
    }

    if (hints) {
        hints.textContent = hintsLeft;
    }
}


/* =====================================================
   MISSION UPDATE
===================================================== */

function updateMission(number, completed) {

    const mission =
        document.getElementById(
            `mission-${number}`
        );

    if (!mission) {
        return;
    }

    const check =
        mission.querySelector(
            ".mission-check"
        );

    if (completed) {

        mission.classList.add("completed");

        if (check) {
            check.textContent = "☑";
        }

    } else {

        mission.classList.remove("completed");

        if (check) {
            check.textContent = "☐";
        }
    }
}


function setCurrentMission(title, text) {

    const current =
        document.getElementById(
            "current-mission"
        );

    const help =
        document.getElementById(
            "mission-help-text"
        );

    if (current) {

        current.innerHTML =
            `Current Mission:
             <strong>${title}</strong>`;
    }

    if (help) {
        help.textContent = text;
    }
}


/* =====================================================
   PAINTING
===================================================== */

function openPainting() {

    if (!puzzleData) {
        showModal(`
            <h2>⏳ Loading Mystery</h2>
            <p>Please wait a moment.</p>
        `);
        return;
    }


    if (paintingSolved) {

        showModal(`
            <h2>🖼️ Nature Painting</h2>

            <p>
                You already investigated this painting.
            </p>

            <p>
                The clue has been collected.
            </p>
        `);

        return;
    }


    showModal(`

        <h2>🖼️ Nature Painting</h2>

        <p>
            A strange landscape is painted here.
        </p>

        <p>
            Count the objects carefully.
        </p>

        <h3>
            LOGIC: COUNT THE SCENE
        </h3>

        <p>
            COUNT IN THIS ORDER:
        </p>

        <h3>
            CLOUDS → TREES → SUN → MOUNTAINS
        </h3>

        <input
            id="painting-answer"
            type="text"
            inputmode="numeric"
            maxlength="4"
            placeholder="Enter four counts"
            autocomplete="off"
        >

        <button
            onclick="checkPainting()"
        >
            Submit
        </button>

    `);
}


function checkPainting() {

    paintingAttempts++;


    if (!puzzleData) {
        return;
    }


    const input =
        document.getElementById(
            "painting-answer"
        );


    if (!input) {
        return;
    }


    const answer =
        input.value
            .trim()
            .replace(/\s+/g, "");


    const correct =
        String(puzzleData.clouds) +
        String(puzzleData.trees) +
        String(puzzleData.sun) +
        String(puzzleData.mountains);


    if (answer === correct) {

        paintingSolved = true;

        cluesFound++;

        puzzlesSolved++;

        updateProgress();

        updateMission(
            1,
            true
        );

        setCurrentMission(
            "Solve the bookshelf",
            "Find the bookshelf and inspect the books."
        );


        showModal(`

            <h2>✅ Painting Solved!</h2>

            <p>
                Correct!
            </p>

            <p>
                The four-count sequence was:
            </p>

            <h1>
                ${correct}
            </h1>

            <p>
                A hidden marking points toward
                the bookshelf.
            </p>

        `);

    } else {

        showModal(`

            <h2>❌ Wrong Answer</h2>

            <p>
                Count the scene again.
            </p>

            <p>
                Follow this exact order:
            </p>

            <h3>
                CLOUDS → TREES → SUN → MOUNTAINS
            </h3>

            <p>
                Attempt ${paintingAttempts}
            </p>

        `);
    }
}


/* =====================================================
   BOOKSHELF
===================================================== */

function openBooks() {

    if (!paintingSolved) {

        showModal(`

            <h2>🔒 Bookshelf Locked</h2>

            <p>
                You should investigate the painting first.
            </p>

        `);

        return;
    }


    if (booksSolved) {

        showModal(`

            <h2>📚 Bookshelf</h2>

            <p>
                You already solved this clue.
            </p>

        `);

        return;
    }


    const letters =
        puzzleData.letters;


    showModal(`

        <h2>📚 Strange Bookshelf</h2>

        <p>
            Four books contain strange symbols.
        </p>

        <p>
            The painting gave you four numbers.
        </p>

        <p>
            Convert those numbers into letters.
        </p>

        <p>
            Use:
            <strong>
                1 = A, 2 = B, 3 = C ...
            </strong>
        </p>

        <p>
            Enter the four letters in order.
        </p>

        <input
            id="books-answer"
            type="text"
            maxlength="4"
            placeholder="Enter letters"
            autocomplete="off"
        >

        <button
            onclick="checkBooks()"
        >
            Submit
        </button>

    `);
}


function checkBooks() {

    bookshelfAttempts++;


    const input =
        document.getElementById(
            "books-answer"
        );


    if (!input) {
        return;
    }


    const answer =
        input.value
            .trim()
            .toUpperCase();


    const correct =
        puzzleData.letters.join("");


    if (answer === correct) {

        booksSolved = true;

        cluesFound++;

        puzzlesSolved++;

        updateProgress();

        updateMission(
            2,
            true
        );

        setCurrentMission(
            "Unlock the drawer",
            "Use the clue from the painting to investigate the locked drawer."
        );


        showModal(`

            <h2>✅ Bookshelf Solved!</h2>

            <p>
                Correct.
            </p>

            <h2>
                ${correct}
            </h2>

            <p>
                The books reveal a connection
                to the locked drawer.
            </p>

        `);

    } else {

        showModal(`

            <h2>❌ Wrong Answer</h2>

            <p>
                Convert the four painting numbers
                into letters.
            </p>

            <p>
                Remember:
                1 = A, 2 = B, 3 = C ...
            </p>

        `);
    }
}


/* =====================================================
   DRAWER
===================================================== */

function openDrawer() {

    if (!booksSolved) {

        showModal(`

            <h2>🔒 Drawer Locked</h2>

            <p>
                The drawer requires the clue
                from the previous investigation.
            </p>

        `);

        return;
    }


    if (drawerSolved) {

        showModal(`

            <h2>🔓 Drawer</h2>

            <p>
                The drawer is already unlocked.
            </p>

        `);

        return;
    }


    showModal(`

        <h2>🔐 Locked Drawer</h2>

        <p>
            A four-digit lock is attached.
        </p>

        <p>
            The painting contained the
            original number sequence.
        </p>

        <input
            id="drawer-code"
            type="text"
            inputmode="numeric"
            maxlength="4"
            placeholder="Enter four digits"
            autocomplete="off"
        >

        <button
            onclick="checkDrawerCode()"
        >
            Unlock
        </button>

    `);
}


function checkDrawerCode() {

    drawerAttempts++;


    const input =
        document.getElementById(
            "drawer-code"
        );


    if (!input) {
        return;
    }


    const code =
        input.value
            .trim()
            .replace(/\s+/g, "");


    const correct =
        puzzleData.painting_code;


    if (code === correct) {

        drawerSolved = true;

        puzzlesSolved++;

        updateProgress();

        updateMission(
            3,
            true
        );

        setCurrentMission(
            "Hack the computer",
            "The drawer contains a mathematical sequence."
        );


        showModal(`

            <h2>🔓 Drawer Unlocked!</h2>

            <p>
                Inside the drawer you find a note.
            </p>

            <h2>
                ${puzzleData.key_sequence.join(" → ")} → ?
            </h2>

            <p>
                Find the next number.
            </p>

            <input
                id="sequence-answer"
                type="text"
                inputmode="numeric"
                placeholder="Your answer"
                autocomplete="off"
            >

            <button
                onclick="checkSequence()"
            >
                Submit
            </button>

        `);

    } else {

        showModal(`

            <h2>❌ Wrong Code</h2>

            <p>
                That code does not open the drawer.
            </p>

            <p>
                Think about the information
                discovered earlier.
            </p>

        `);
    }
}


/* =====================================================
   DRAWER SEQUENCE
===================================================== */

function checkSequence() {

    const input =
        document.getElementById(
            "sequence-answer"
        );


    if (!input) {
        return;
    }


    const answer =
        input.value
            .trim();


    const sequence =
        puzzleData.key_sequence;


    const difference =
        sequence[1] -
        sequence[0];


    const expected =
        sequence[sequence.length - 1] +
        difference;


    if (
        Number(answer) === expected
    ) {

        puzzlesSolved++;

        cluesFound++;

        updateProgress();

        updateMission(
            3,
            true
        );


        showModal(`

            <h2>✅ Sequence Solved!</h2>

            <p>
                The pattern continues by adding
                ${difference}.
            </p>

            <h2>
                ${expected}
            </h2>

            <p>
                The computer is the next place
                to investigate.
            </p>

            <button
                onclick="openComputer()"
            >
                Check Computer
            </button>

        `);

    } else {

        showModal(`

            <h2>❌ Incorrect</h2>

            <p>
                Look at the difference between
                consecutive numbers.
            </p>

        `);
    }
}


/* =====================================================
   COMPUTER
===================================================== */

function openComputer() {

    if (!drawerSolved) {

        showModal(`

            <h2>🔒 Computer Locked</h2>

            <p>
                You must unlock the drawer first.
            </p>

        `);

        return;
    }


    if (computerSolved) {

        showModal(`

            <h2>💻 Computer</h2>

            <p>
                The computer is already unlocked.
            </p>

        `);

        return;
    }


    showModal(`

        <h2>💻 Laboratory Computer</h2>

        <p>
            SYSTEM LOCKED
        </p>

        <p>
            Enter the detective username
            and the password derived from
            the previous clues.
        </p>

        <input
            id="username"
            type="text"
            placeholder="Username"
            autocomplete="off"
        >

        <input
            id="password"
            type="password"
            placeholder="Password"
            autocomplete="off"
        >

        <button
            onclick="loginComputer()"
        >
            LOGIN
        </button>

    `);
}


function loginComputer() {

    computerAttempts++;


    const username =
        document.getElementById(
            "username"
        ).value
            .trim()
            .toLowerCase();


    const password =
        document.getElementById(
            "password"
        ).value
            .trim()
            .toUpperCase();


    const correctPassword =
        puzzleData.letters.join("");


    if (
        username === "detective" &&
        password === correctPassword
    ) {

        computerSolved = true;

        cluesFound++;

        puzzlesSolved++;

        updateProgress();

        updateMission(
            4,
            true
        );

        setCurrentMission(
            "Find the key",
            "The computer has revealed information about the hidden key."
        );


        showModal(`

            <h2>✅ ACCESS GRANTED</h2>

            <p>
                Welcome, Detective.
            </p>

            <p>
                The computer reveals:
            </p>

            <h3>
                The key is somewhere in the room.
            </h3>

            <p>
                Search carefully.
            </p>

        `);

    } else {

        showModal(`

            <h2>❌ ACCESS DENIED</h2>

            <p>
                Username:
                <strong>detective</strong>
            </p>

            <p>
                The password is connected
                to the bookshelf clue.
            </p>

        `);
    }
}


/* =====================================================
   KEY
===================================================== */

function openKey() {

    if (!computerSolved) {

        showModal(`

            <h2>🔒 Key Hidden</h2>

            <p>
                The computer must be solved first.
            </p>

        `);

        return;
    }


    if (keySolved) {

        showModal(`

            <h2>🔑 Key</h2>

            <p>
                You already collected the key.
            </p>

        `);

        return;
    }


    const sequence =
        puzzleData.key_sequence;


    showModal(`

        <h2>🔑 Strange Key</h2>

        <p>
            A number sequence is engraved
            beside the key.
        </p>

        <h3>
            ${sequence.join(" → ")} → ?
        </h3>

        <p>
            Enter the next number.
        </p>

        <input
            id="key-answer"
            type="text"
            inputmode="numeric"
            placeholder="Next number"
            autocomplete="off"
        >

        <button
            onclick="checkKey()"
        >
            Take Key
        </button>

    `);
}


function checkKey() {

    keyAttempts++;


    const input =
        document.getElementById(
            "key-answer"
        );


    if (!input) {
        return;
    }


    const answer =
        Number(
            input.value.trim()
        );


    const sequence =
        puzzleData.key_sequence;


    const difference =
        sequence[1] -
        sequence[0];


    const expected =
        sequence[sequence.length - 1] +
        difference;


    if (answer === expected) {

        keySolved = true;

        cluesFound++;

        puzzlesSolved++;

        updateProgress();

        updateMission(
            5,
            true
        );

        setCurrentMission(
            "Escape the room",
            "Use the key and complete the final clock clue."
        );


        showModal(`

            <h2>🔑 Key Found!</h2>

            <p>
                Correct.
            </p>

            <p>
                The key is now in your possession.
            </p>

            <p>
                One final clue remains.
            </p>

        `);

    } else {

        showModal(`

            <h2>❌ Wrong Number</h2>

            <p>
                Study the sequence carefully.
            </p>

        `);
    }
}


/* =====================================================
   CLOCK
===================================================== */

function openClock() {

    if (!keySolved) {

        showModal(`

            <h2>🔒 Clock Locked</h2>

            <p>
                Find the key before checking
                the final clock clue.
            </p>

        `);

        return;
    }


    if (clockSolved) {

        showModal(`

            <h2>🕐 Clock</h2>

            <p>
                The clock clue has already
                been solved.
            </p>

        `);

        return;
    }


    showModal(`

        <h2>🕐 Strange Clock</h2>

        <p>
            Four numbers are marked around
            the clock.
        </p>

        <h3>
            ${puzzleData.clock_numbers.join("  •  ")}
        </h3>

        <p>
            Enter them in the order shown.
        </p>

        <input
            id="clock-answer"
            type="text"
            inputmode="numeric"
            maxlength="8"
            placeholder="Enter clock code"
            autocomplete="off"
        >

        <button
            onclick="checkClock()"
        >
            Submit
        </button>

    `);
}


function checkClock() {

    clockAttempts++;


    const input =
        document.getElementById(
            "clock-answer"
        );


    if (!input) {
        return;
    }


    const answer =
        input.value
            .trim()
            .replace(/\s+/g, "");


    const correct =
        puzzleData.clock_code;


    if (answer === correct) {

        clockSolved = true;

        puzzlesSolved++;

        cluesFound++;

        updateProgress();


        showModal(`

            <h2>✅ Clock Solved!</h2>

            <p>
                The final mechanism is activated.
            </p>

            <p>
                The exit door is ready.
            </p>

            <button
                onclick="closeModal()"
            >
                Continue
            </button>

        `);

    } else {

        showModal(`

            <h2>❌ Wrong Clock Code</h2>

            <p>
                Enter the four clock numbers
                in the displayed order.
            </p>

        `);
    }
}


/* =====================================================
   EXIT
===================================================== */

function openExit() {

    if (
        computerSolved &&
        keySolved &&
        clockSolved
    ) {

        updateMission(
            6,
            true
        );

        finishGame();

        return;
    }


    showModal(`

        <h2>🚪 Exit Locked</h2>

        <p>
            You still have unfinished tasks.
        </p>

        <p>
            Complete the painting,
            bookshelf, drawer,
            computer, key and clock.
        </p>

    `);
}


/* =====================================================
   HINT SYSTEM
===================================================== */

function useHint() {

    if (hintsLeft <= 0) {

        showModal(`

            <h2>💡 No Hints Left</h2>

            <p>
                You have used all three hints.
            </p>

        `);

        return;
    }


    hintsLeft--;

    hintsUsed++;

    updateProgress();


    let hint = "";


    if (!paintingSolved) {

        hint =
            "Look closely at the nature painting. Count every requested object.";

    } else if (!booksSolved) {

        hint =
            "The painting gives you numbers. Those numbers can become letters.";

    } else if (!drawerSolved) {

        hint =
            "The locked drawer uses information discovered earlier in the room.";

    } else if (!computerSolved) {

        hint =
            "The bookshelf clue helps you determine the computer password.";

    } else if (!keySolved) {

        hint =
            "The computer tells you to search the room for the key.";

    } else if (!clockSolved) {

        hint =
            "After finding the key, inspect the clock for the final code.";

    } else {

        hint =
            "The exit is ready. Use everything you have discovered.";

    }


    showModal(`

        <h2>💡 Hint</h2>

        <p>
            ${hint}
        </p>

        <p>
            Hints remaining:
            <strong>${hintsLeft}</strong>
        </p>

    `);
}


/* =====================================================
   CLUE SYSTEM
===================================================== */

function useClue() {

    let clue = "";


    if (!paintingSolved) {

        clue =
            "The painting contains four types of objects. Count them in the requested order.";

    } else if (!booksSolved) {

        clue =
            "The numbers from the painting can be converted into letters.";

    } else if (!drawerSolved) {

        clue =
            "The painting's four-digit sequence is connected to the drawer.";

    } else if (!computerSolved) {

        clue =
            "The bookshelf reveals information needed by the computer.";

    } else if (!keySolved) {

        clue =
            "The computer has directed you toward the hidden key.";

    } else if (!clockSolved) {

        clue =
            "The clock provides the final step before the exit.";

    } else {

        clue =
            "All clues have been solved. Escape through the door.";

    }


    showModal(`

        <h2>🔎 Clue</h2>

        <p>
            ${clue}
        </p>

    `);
}


/* =====================================================
   RESULT
===================================================== */

function finishGame() {

    if (
        typeof stopTimer === "function"
    ) {

        stopTimer();

    }


    const timeRemaining =
        typeof timeLeft !== "undefined"
            ? timeLeft
            : 0;


    let score =
        timeRemaining * 10;


    score -=
        hintsUsed * 50;


    score +=
        puzzlesSolved * 100;


    if (score < 0) {
        score = 0;
    }


    const scoreInput =
        document.getElementById(
            "score-input"
        );


    const timeInput =
        document.getElementById(
            "time-input"
        );


    const hintsInput =
        document.getElementById(
            "hints-input"
        );


    const resultForm =
        document.getElementById(
            "result-form"
        );


    if (
        !scoreInput ||
        !timeInput ||
        !hintsInput ||
        !resultForm
    ) {

        console.error(
            "Result form elements are missing."
        );

        showModal(`

            <h2>🎉 Mystery Solved!</h2>

            <p>
                Score: ${score}
            </p>

            <p>
                Time remaining: ${timeRemaining} seconds
            </p>

            <p>
                The result form is missing.
            </p>

        `);

        return;
    }


    scoreInput.value =
        score;


    timeInput.value =
        timeRemaining;


    hintsInput.value =
        hintsUsed;


    resultForm.submit();
}


/* =====================================================
   MODAL CLOSE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const closeButton =
            document.getElementById(
                "close-modal"
            );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeModal
            );

        }


        const modal =
            document.getElementById(
                "modal"
            );


        if (modal) {

            modal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target === modal
                    ) {

                        closeModal();

                    }

                }
            );

        }


        const hintButton =
            document.getElementById(
                "mission-hint-button"
            );


        if (hintButton) {

            hintButton.addEventListener(
                "click",
                useHint
            );

        }


        const clueButton =
            document.getElementById(
                "mission-clue-button"
            );


        if (clueButton) {

            clueButton.addEventListener(
                "click",
                useClue
            );

        }


        const missionsButton =
            document.getElementById(
                "missions-button"
            );


        const missionsPanel =
            document.getElementById(
                "missions-panel"
            );


        const closeMissions =
            document.getElementById(
                "close-missions"
            );


        if (
            missionsButton &&
            missionsPanel
        ) {

            missionsButton.addEventListener(
                "click",
                function () {

                    missionsPanel.style.display =
                        "block";

                }
            );

        }


        if (
            closeMissions &&
            missionsPanel
        ) {

            closeMissions.addEventListener(
                "click",
                function () {

                    missionsPanel.style.display =
                        "none";

                }
            );

        }


        loadPuzzle();

        updateProgress();

    }
);