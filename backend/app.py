from flask import Flask,render_template,request,redirect,url_for,session,jsonify
import sqlite3
import random
import os

BASE_DIR=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

app=Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR,"templates"),
    static_folder=os.path.join(BASE_DIR,"static")
)

app.secret_key="mystery-room-secret"
DATABASE=os.path.join(BASE_DIR,"mystery.db")
PUZZLE_DATABASE={}

def get_db():
    conn=sqlite3.connect(DATABASE)
    conn.row_factory=sqlite3.Row
    return conn

def create_database():
    conn=get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS scores(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_name TEXT NOT NULL,
            score INTEGER NOT NULL,
            time_remaining INTEGER NOT NULL,
            hints_used INTEGER NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def create_puzzle():
    numbers=random.sample(range(1,10),4)
    sun,clouds,trees,mountains=numbers

    letters=[
        chr(64+sun),
        chr(64+clouds),
        chr(64+trees),
        chr(64+mountains)
    ]

    key_start=random.randint(1,4)

    key_sequence=[
        key_start,
        key_start+2,
        key_start+4,
        key_start+6
    ]

    key_next=key_start+8

    clock_numbers=[key_next]

    while len(clock_numbers)<4:
        number=random.randint(1,12)

        if number not in clock_numbers:
            clock_numbers.append(number)

    random.shuffle(clock_numbers)

    return{
        "sun":sun,
        "clouds":clouds,
        "trees":trees,
        "mountains":mountains,
        "letters":letters,
        "painting_code":"".join(map(str,numbers)),
        "bookshelf_code":"".join(map(str,numbers)),
        "drawer_code":"".join(map(str,numbers)),
        "computer_password":"".join(letters),
        "math_answer":sun+clouds*trees-mountains,
        "key_sequence":key_sequence,
        "key_next":key_next,
        "clock_numbers":clock_numbers,
        "clock_code":"".join(map(str,clock_numbers))
    }

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/how-to-play")
def how_to_play():
    return render_template("how-to-play.html")

@app.route("/start",methods=["POST"])
def start():
    player_name=request.form.get("player_name")

    if not player_name:
        player_name="Detective"

    session["player_name"]=player_name

    puzzle=create_puzzle()
    PUZZLE_DATABASE[player_name]=puzzle

    return redirect(url_for("game"))

@app.route("/game")
def game():
    player_name=session.get("player_name","Detective")
    return render_template("game.html",player_name=player_name)

@app.route("/api/puzzle")
def api_puzzle():
    player_name=session.get("player_name","Detective")

    if player_name not in PUZZLE_DATABASE:
        PUZZLE_DATABASE[player_name]=create_puzzle()

    return jsonify(PUZZLE_DATABASE[player_name])

@app.route("/result",methods=["POST"])
def result():
    player_name=session.get("player_name","Detective")

    score=int(request.form.get("score",0))
    time_remaining=int(request.form.get("time_remaining",0))
    hints_used=int(request.form.get("hints_used",0))

    conn=get_db()

    conn.execute(
        """
        INSERT INTO scores
        (player_name,score,time_remaining,hints_used)
        VALUES(?,?,?,?)
        """,
        (
            player_name,
            score,
            time_remaining,
            hints_used
        )
    )

    conn.commit()
    conn.close()

    return render_template(
        "result.html",
        player_name=player_name,
        score=score,
        time_remaining=time_remaining,
        hints_used=hints_used
    )

@app.route("/leaderboard")
def leaderboard():
    conn=get_db()

    scores=conn.execute(
        """
        SELECT player_name,score,time_remaining,hints_used
        FROM scores
        ORDER BY score DESC
        LIMIT 10
        """
    ).fetchall()

    conn.close()

    return render_template(
        "result.html",
        leaderboard=scores
    )

if __name__=="__main__":
    create_database()
    app.run(debug=True)