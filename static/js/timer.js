let timeLeft = 15 * 60;
let timerInterval = null;


/* =====================================================
   UPDATE TIMER
===================================================== */

function updateTimer() {

    const minutes =
        Math.floor(timeLeft / 60);

    const seconds =
        timeLeft % 60;

    const formattedSeconds =
        seconds
            .toString()
            .padStart(2, "0");


    const timer =
        document.getElementById("timer");


    if (timer) {

        timer.textContent =
            `TIME LEFT: ${minutes}:${formattedSeconds}`;

    }


    /* Warning states */

    if (timer) {

        timer.classList.remove(
            "timer-warning",
            "timer-danger"
        );


        if (timeLeft <= 60) {

            timer.classList.add(
                "timer-danger"
            );

        } else if (timeLeft <= 300) {

            timer.classList.add(
                "timer-warning"
            );

        }

    }

}


/* =====================================================
   START TIMER
===================================================== */

function startTimer() {

    stopTimer();

    updateTimer();


    timerInterval =
        setInterval(
            function () {

                if (timeLeft <= 0) {

                    timeLeft = 0;

                    updateTimer();

                    stopTimer();

                    timeUp();

                    return;
                }


                timeLeft--;

                updateTimer();

            },
            1000
        );
}


/* =====================================================
   STOP TIMER
===================================================== */

function stopTimer() {

    if (timerInterval !== null) {

        clearInterval(
            timerInterval
        );

        timerInterval = null;

    }

}


/* =====================================================
   TIME UP
===================================================== */

function timeUp() {

    stopTimer();


    const modal =
        document.getElementById(
            "modal"
        );


    const modalBody =
        document.getElementById(
            "modal-body"
        );


    if (!modal || !modalBody) {
        return;
    }


    modalBody.innerHTML = `

        <div class="time-up-screen">

            <div class="time-up-icon">
                ⏰
            </div>

            <h2>
                TIME'S UP!
            </h2>

            <p>
                The room remains locked.
            </p>

            <p>
                Your investigation has ended.
            </p>

            <button
                onclick="location.href='/'"
            >
                🏠 Return Home
            </button>

        </div>

    `;


    modal.style.display =
        "flex";
}


/* =====================================================
   START GAME TIMER
===================================================== */

startTimer();