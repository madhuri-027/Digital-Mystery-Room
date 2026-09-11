let cluesFound = 0;
let puzzlesSolved = 0;
let hintsUsed = 0;
let hintsLeft = 3;

let paintingSolved = false;
let booksSolved = false;
let drawerSolved = false;
let computerSolved = false;


function showModal(content) {
    document.getElementById("modal-body").innerHTML = content;
    document.getElementById("modal").style.display = "flex";
}


function closeModal() {
    document.getElementById("modal").style.display = "none";
}


function updateProgress() {
    document.getElementById("clues-found").textContent = cluesFound;
    document.getElementById("puzzles-solved").textContent = puzzlesSolved;
    document.getElementById("hints-left").textContent = hintsLeft;
}


function openPainting() {

    if (paintingSolved) {
        showModal(`
            <h2>🖼️ Painting</h2>
            <p>You already found the clue here.</p>
        `);
        return;
    }

    showModal(`
        <h2>🖼️ Old Painting</h2>

        <p>
            You move the painting and discover
            four strange numbers written behind it.
        </p>

        <h3>3 → 8 → 1 → 6</h3>

        <p>This looks like a code.</p>

        <button onclick="collectPaintingClue()">
            Collect Clue
        </button>
    `);
}


function collectPaintingClue() {

    paintingSolved = true;
    cluesFound++;

    updateProgress();

    showModal(`
        <h2>✅ Clue Found</h2>

        <p>You found the number:</p>

        <h1>3816</h1>

        <p>Maybe this code opens something.</p>
    `);
}


function openBooks() {

    if (booksSolved) {
        showModal(`
            <h2>📚 Books</h2>
            <p>You already investigated these books.</p>
        `);
        return;
    }

    showModal(`
        <h2>📚 Laboratory Books</h2>

        <p>A note inside the book says:</p>

        <h3>RED - BLUE - GREEN - YELLOW</h3>

        <p>"Take the first letter of each."</p>

        <input
            id="color-answer"
            placeholder="Enter answer"
        >

        <button onclick="checkColorPuzzle()">
            Submit
        </button>
    `);
}


function checkColorPuzzle() {

    const answer =
        document.getElementById("color-answer")
        .value
        .trim()
        .toUpperCase();

    if (answer === "RBGY") {

        booksSolved = true;

        cluesFound++;
        puzzlesSolved++;

        updateProgress();

        showModal(`
            <h2>✅ Correct!</h2>

            <p>The answer is RBGY.</p>

            <p>The note reveals another clue:</p>

            <h2>4729</h2>
        `);

    } else {

        showModal(`
            <h2>❌ Wrong Answer</h2>

            <p>
                Think about the first letter
                of each color.
            </p>
        `);
    }
}


function openDrawer() {

    showModal(`
        <h2>🔐 Locked Drawer</h2>

        <p>Enter the 4-digit code.</p>

        <input
            id="drawer-code"
            maxlength="4"
            placeholder="Enter code"
        >

        <button onclick="checkDrawerCode()">
            Unlock
        </button>
    `);
}


function checkDrawerCode() {

    const code =
        document.getElementById("drawer-code").value;

    if (code === "3816") {

        if (!drawerSolved) {

            drawerSolved = true;
            puzzlesSolved++;

            updateProgress();
        }

        showModal(`
            <h2>🔓 Drawer Unlocked!</h2>

            <p>Inside the drawer you find a note.</p>

            <h2>2 → 4 → 8 → 16 → ?</h2>

            <p>Solve the sequence.</p>

            <input
                id="sequence-answer"
                placeholder="Your answer"
            >

            <button onclick="checkSequence()">
                Submit
            </button>
        `);

    } else {

        showModal(`
            <h2>❌ Wrong Code</h2>

            <p>
                Search the room for the correct code.
            </p>
        `);
    }
}


function checkSequence() {

    const answer =
        document.getElementById("sequence-answer")
        .value
        .trim();

    if (answer === "32") {

        puzzlesSolved++;

        if (puzzlesSolved > 3) {
            puzzlesSolved = 3;
        }

        cluesFound++;

        updateProgress();

        showModal(`
            <h2>✅ Correct!</h2>

            <p>
                The sequence continues by multiplying
                each number by 2.
            </p>

            <h2>32</h2>

            <p>
                The computer may contain the final clue.
            </p>
        `);

    } else {

        showModal(`
            <h2>❌ Incorrect</h2>

            <p>
                Look carefully at the sequence.
            </p>
        `);
    }
}


function openComputer() {

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

        <p>SYSTEM LOCKED</p>

        <input
            id="username"
            placeholder="Username"
        >

        <input
            id="password"
            type="password"
            placeholder="Password"
        >

        <button onclick="loginComputer()">
            LOGIN
        </button>
    `);
}


function loginComputer() {

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    if (
        username.toLowerCase() === "detective" &&
        password === "4729"
    ) {

        computerSolved = true;

        cluesFound++;

        updateProgress();

        showModal(`
            <h2>✅ ACCESS GRANTED</h2>

            <p>Welcome, Detective.</p>

            <p>FINAL MESSAGE:</p>

            <h2>The exit door is ready.</h2>
        `);

    } else {

        showModal(`
            <h2>❌ ACCESS DENIED</h2>

            <p>
                The username is Detective.
                Find the correct password.
            </p>
        `);
    }
}


function openExit() {

    if (computerSolved && puzzlesSolved >= 3) {

        finishGame();

    } else {

        showModal(`
            <h2>🚪 Exit Locked</h2>

            <p>
                You haven't solved all the puzzles yet.
            </p>

            <p>
                Check the painting, books, drawer
                and computer.
            </p>
        `);
    }
}


function useHint() {

    if (hintsLeft <= 0) {

        showModal(`
            <h2>💡 No Hints Left</h2>
        `);

        return;
    }

    hintsLeft--;
    hintsUsed++;

    updateProgress();

    let hint = "";

    if (!paintingSolved) {

        hint = "Have you checked the painting?";

    } else if (!booksSolved) {

        hint =
            "The book asks you to use the first letter of each color.";

    } else if (!drawerSolved) {

        hint =
            "The code behind the painting can unlock the drawer.";

    } else if (!computerSolved) {

        hint =
            "The computer password is connected to the clue from the books.";

    } else {

        hint =
            "The exit door is waiting for you.";
    }

    showModal(`
        <h2>💡 Hint</h2>
        <p>${hint}</p>
    `);
}


function finishGame() {

    stopTimer();

    const timeRemaining =
        typeof timeLeft !== "undefined"
            ? timeLeft
            : 0;

    let score = timeRemaining * 10;

    score -= hintsUsed * 50;

    if (score < 0) {
        score = 0;
    }

    document.getElementById("score-input").value = score;

    document.getElementById("time-input").value =
        timeRemaining;

    document.getElementById("hints-input").value =
        hintsUsed;

    document.getElementById("result-form").submit();
}


updateProgress();