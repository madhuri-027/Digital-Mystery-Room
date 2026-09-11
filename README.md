# 🕵️ Digital Mystery Room

An interactive 3D mystery-room game where players explore a room, discover clues, solve connected puzzles, find the key, and escape before time runs out.

## 🎮 Live Demo

**Play the game:**
https://digital-mystery-room-inky.vercel.app/

## 📌 About the Project

Digital Mystery Room is a browser-based interactive mystery game designed to give players a first-person room exploration experience.

The player enters a mysterious room and must investigate different objects, discover hidden clues, solve puzzles in the correct sequence, unlock the required objects, find the key, and finally escape the room.

The puzzles are connected, and important values are randomized for each game session.

## ✨ Features

* 🎮 First-person 3D room exploration
* ⌨️ W/A/S/D keyboard movement
* 🖱️ Mouse-based camera control
* 🔘 On-screen movement controls
* 🔍 Interactive room objects
* 🎯 Mission system
* 💡 Multiple hints and clues
* 🔢 Connected puzzles
* 🎲 Randomized puzzle values
* ⏱️ Countdown timer
* 🗝️ Key discovery system
* 💻 Computer puzzle
* 🕐 Clock-based final puzzle
* 🚪 Escape objective
* 🏆 Score and leaderboard system
* 👤 Player name system
* 🌐 Deployed using Vercel

## 🧩 Game Flow

The puzzles follow a connected sequence:

```text
Painting
   ↓
Bookshelf
   ↓
Locked Drawer
   ↓
Computer
   ↓
Find the Key
   ↓
Clock
   ↓
Exit Door
```

Each stage provides information needed for the next stage.

## 🕹️ How to Play

1. Enter your player name.
2. Start the game.
3. Explore the room using **W/A/S/D**.
4. Look around using the mouse.
5. Approach objects and interact with them.
6. Complete the missions in order.
7. Use hints when necessary.
8. Solve the connected puzzles.
9. Find the key.
10. Complete the final clock puzzle.
11. Unlock the exit and escape.
12. Your score is calculated based on your performance.

## 🎯 Missions

The game includes the following missions:

* ☐ Find the painting
* ☐ Find the hidden paper / solve the bookshelf
* ☐ Unlock the drawer
* ☐ Check the computer
* ☐ Find the key
* ☐ Escape the room

Completed missions are marked as:

```text
☑ Mission Completed
```

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript
* Three.js

### Backend

* Python
* Flask
* SQLite

### Deployment

* GitHub
* Vercel

## 📂 Project Structure

```text
Digital-Mystery-Room/
│
├── backend/
│   └── app.py
│
├── templates/
│   ├── index.html
│   ├── how-to-play.html
│   ├── game.html
│   └── result.html
│
├── static/
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       └── three-game.js
│
├── requirements.txt
├── vercel.json
├── .gitignore
└── README.md
```

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/madhuri-027/Digital-Mystery-Room.git
```

Move into the project folder:

```bash
cd Digital-Mystery-Room
```

Create a virtual environment:

```bash
py -3.12 -m venv .venv
```

Activate it:

```powershell
.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the application:

```bash
python backend/app.py
```

Open the local application:

```text
http://127.0.0.1:5000
```

## 🔐 Backend

The Flask backend handles:

* Player sessions
* Random puzzle generation
* Puzzle data
* Score submission
* SQLite database
* Leaderboard
* Game routes and API endpoints

### API

The game retrieves randomized puzzle information through:

```text
/api/puzzle
```

## 🎲 Randomized Puzzles

Each new game can generate different puzzle values.

The generated puzzle data includes:

* Painting values
* Bookshelf values
* Drawer code
* Computer password
* Mathematical puzzle
* Key sequence
* Clock values
* Final escape code

Although the values change, the puzzles remain connected so that the player must follow the intended investigation sequence.

## 🏆 Scoring

The game records:

* Player name
* Score
* Remaining time
* Number of hints used

The leaderboard displays the highest scores.

## 🚀 Deployment

The project is deployed using **Vercel**.

Production URL:

https://digital-mystery-room-inky.vercel.app/

The source code is maintained on GitHub:

https://github.com/madhuri-027/Digital-Mystery-Room

## 🔮 Future Improvements

* Multiple mystery rooms
* More puzzle types
* Better 3D models and textures
* Sound effects and background music
* Character animations
* Difficulty levels
* Multiplayer mode
* Improved leaderboard
* More interactive objects
* Mobile optimization

## 👩‍💻 Author

**Madhuri Gugulothu**

B.Tech – Artificial Intelligence and Machine Learning

## 📄 License

This project is created for educational and project-development purposes.
