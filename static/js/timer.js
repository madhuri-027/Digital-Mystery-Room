let timeLeft = 15 * 60;
let timerInterval;


function updateTimer() {

    const minutes = Math.floor(timeLeft / 60);

    const seconds = timeLeft % 60;

    const formattedSeconds =
        seconds.toString().padStart(2, "0");

    document.getElementById("timer").textContent =
        `TIME LEFT: ${minutes}:${formattedSeconds}`;
}


function startTimer() {

    updateTimer();

    timerInterval = setInterval(() => {

        timeLeft--;

        updateTimer();

        if (timeLeft <= 0) {

            timeLeft = 0;

            clearInterval(timerInterval);

            timeUp();
        }

    }, 1000);
}


function stopTimer() {

    clearInterval(timerInterval);
}


function timeUp() {

    stopTimer();

    document.getElementById("modal-body").innerHTML = `
        <h2>⏰ TIME'S UP!</h2>

        <p>
            The laboratory remains locked.
        </p>

        <button onclick="location.reload()">
            Try Again
        </button>
    `;

    document.getElementById("modal").style.display = "flex";
}


startTimer();