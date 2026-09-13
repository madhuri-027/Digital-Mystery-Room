from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import sqlite3
import random
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "templates"),
    static_folder=os.path.join(BASE_DIR, "static")
)

app.secret_key = "mystery-room-secret"

if os.environ.get("VERCEL"):
    DATABASE = "/tmp/mystery.db"
else:
    DATABASE = os.path.join(BASE_DIR, "mystery.db")

PUZZLE_DATABASE = {}


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def create_database():
    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS scores(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_name TEXT NOT NULL,
            score INTEGER NOT NULL,
            time_remaining INTEGER NOT NULL,
            hints_used INTEGER NOT NULL,
            room_name TEXT DEFAULT 'Laboratory'
        )
    """)

    existing_columns = [
        row["name"]
        for row in conn.execute("PRAGMA table_info(scores)").fetchall()
    ]

    if "room_name" not in existing_columns:
        conn.execute(
            "ALTER TABLE scores ADD COLUMN room_name TEXT DEFAULT 'Laboratory'"
        )

    conn.commit()
    conn.close()


def random_number():
    return random.randint(1, 9)


def create_puzzle():
    numbers = random.sample(range(1, 10), 4)

    sun = numbers[0]
    clouds = numbers[1]
    trees = numbers[2]
    mountains = numbers[3]

    letters = [
        chr(64 + sun),
        chr(64 + clouds),
        chr(64 + trees),
        chr(64 + mountains)
    ]

    key_start = random.randint(1, 4)

    key_sequence = [
        key_start,
        key_start + 2,
        key_start + 4,
        key_start + 6
    ]

    key_next = key_start + 8

    clock_numbers = [key_next]

    while len(clock_numbers) < 4:
        number = random.randint(1, 12)

        if number not in clock_numbers:
            clock_numbers.append(number)

    random.shuffle(clock_numbers)

    return {
        "sun": sun,
        "clouds": clouds,
        "trees": trees,
        "mountains": mountains,

        "letters": letters,

        "painting_code": "".join(map(str, numbers)),

        "bookshelf_code": "".join(map(str, numbers)),

        "drawer_code": "".join(map(str, numbers)),

        "computer_password": "".join(letters),

        "math_answer": sun + clouds * trees - mountains,

        "key_sequence": key_sequence,

        "key_next": key_next,

        "clock_numbers": clock_numbers,

        "clock_code": "".join(map(str, clock_numbers))
    }


@app.route("/")
def home():
    conn = get_db()

    scores = conn.execute("""
        SELECT player_name, score, time_remaining, hints_used, room_name
        FROM scores
        ORDER BY score DESC, time_remaining DESC
        LIMIT 10
    """).fetchall()

    conn.close()

    return render_template(
        "index.html",
        leaderboard=scores
    )


@app.route("/how-to-play")
def how_to_play():
    return render_template("how-to-play.html")


@app.route("/start", methods=["POST"])
def start():

    player_name = request.form.get("player_name", "").strip()

    if not player_name:
        player_name = "Detective"

    room_name = request.form.get(
        "room_name",
        "Laboratory"
    )

    allowed_rooms = [
        "Laboratory",
        "Library",
        "Detective Office"
    ]

    if room_name not in allowed_rooms:
        room_name = "Laboratory"

    mode = request.form.get(
        "mode",
        "light"
    )

    if mode not in ["light", "dark"]:
        mode = "light"

    session["player_name"] = player_name
    session["room_name"] = room_name
    session["mode"] = mode

    puzzle = create_puzzle()

    game_id = (
        player_name
        + "_"
        + str(random.randint(100000, 999999))
    )

    session["game_id"] = game_id

    PUZZLE_DATABASE[game_id] = puzzle

    return redirect(url_for("game"))


@app.route("/game")
def game():

    player_name = session.get(
        "player_name",
        "Detective"
    )

    room_name = session.get(
        "room_name",
        "Laboratory"
    )

    mode = session.get(
        "mode",
        "light"
    )

    return render_template(
        "game.html",
        player_name=player_name,
        room_name=room_name,
        mode=mode
    )


@app.route("/api/puzzle")
def api_puzzle():

    game_id = session.get("game_id")

    if not game_id:

        game_id = (
            session.get("player_name", "Detective")
            + "_"
            + str(random.randint(100000, 999999))
        )

        session["game_id"] = game_id

    if game_id not in PUZZLE_DATABASE:
        PUZZLE_DATABASE[game_id] = create_puzzle()

    return jsonify(
        PUZZLE_DATABASE[game_id]
    )


@app.route("/api/room")
def api_room():

    return jsonify({
        "room_name": session.get(
            "room_name",
            "Laboratory"
        ),
        "mode": session.get(
            "mode",
            "light"
        )
    })


@app.route("/api/leaderboard")
def api_leaderboard():

    conn = get_db()

    scores = conn.execute("""
        SELECT
            player_name,
            score,
            time_remaining,
            hints_used,
            room_name
        FROM scores
        ORDER BY score DESC, time_remaining DESC
        LIMIT 10
    """).fetchall()

    conn.close()

    leaderboard = []

    for row in scores:

        leaderboard.append({
            "player_name": row["player_name"],
            "score": row["score"],
            "time_remaining": row["time_remaining"],
            "hints_used": row["hints_used"],
            "room_name": row["room_name"]
        })

    return jsonify(leaderboard)


@app.route("/result", methods=["POST"])
def result():

    player_name = session.get(
        "player_name",
        "Detective"
    )

    room_name = session.get(
        "room_name",
        "Laboratory"
    )

    score = int(
        request.form.get(
            "score",
            0
        )
    )

    time_remaining = int(
        request.form.get(
            "time_remaining",
            0
        )
    )

    hints_used = int(
        request.form.get(
            "hints_used",
            0
        )
    )

    conn = get_db()

    conn.execute(
        """
        INSERT INTO scores
        (
            player_name,
            score,
            time_remaining,
            hints_used,
            room_name
        )
        VALUES(?,?,?,?,?)
        """,
        (
            player_name,
            score,
            time_remaining,
            hints_used,
            room_name
        )
    )

    conn.commit()
    conn.close()

    return render_template(
        "result.html",
        player_name=player_name,
        score=score,
        time_remaining=time_remaining,
        hints_used=hints_used,
        room_name=room_name
    )


@app.route("/leaderboard")
def leaderboard():

    conn = get_db()

    scores = conn.execute("""
        SELECT
            player_name,
            score,
            time_remaining,
            hints_used,
            room_name
        FROM scores
        ORDER BY score DESC, time_remaining DESC
        LIMIT 10
    """).fetchall()

    conn.close()

    return render_template(
        "result.html",
        leaderboard=scores
    )


@app.route("/change-room", methods=["POST"])
def change_room():

    room_name = request.form.get(
        "room_name",
        "Laboratory"
    )

    allowed_rooms = [
        "Laboratory",
        "Library",
        "Detective Office"
    ]

    if room_name not in allowed_rooms:
        room_name = "Laboratory"

    session["room_name"] = room_name

    return redirect(
        url_for("game")
    )


@app.route("/change-mode", methods=["POST"])
def change_mode():

    mode = request.form.get(
        "mode",
        "light"
    )

    if mode not in ["light", "dark"]:
        mode = "light"

    session["mode"] = mode

    return redirect(
        url_for("game")
    )


if __name__ == "__main__":

    create_database()

    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )
try:
    create_database()
except Exception:
    pass