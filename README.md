# 🌍 Footprint Logger

* Track your daily activities, estimate your CO₂ footprint, and compare with the community.

* This app is built with:

* Backend: Node.js + Express + MongoDB

* Frontend: HTML, CSS, Vanilla JavaScript

* Database: MongoDB (via Docker)

* Auth: JWT (JSON Web Tokens)

* Deployment: Docker + Docker Compose*

# 🚀 Features

* User registration & login

* Log daily activities (transport, food, energy, etc.)

* Automatic CO₂ tracking and totals

* Weekly summaries

* Community average & eco-friendly leaderboard

* Simple dashboard frontend

# 🖥️ Frontend

A simple static frontend is served from /public.
You can:

* Register / Login

* Add activities

* See your total emissions

* View community average + leaderboard

# 🛠️ Development Notes

* Uses localStorage in frontend for JWT persistence.

* MongoDB data persists via Docker volume (mongo-data).

* Leaderboard ranks users with lowest CO₂ footprint first.

To reset DB:
`docker compose down -v`

# 📦 Setup Instructions
## 1. Clone this repository and cd into the folder

`git clone https://github.com/yourusername/footprint-logger-part2.git`

`cd footprint-logger`

## 2. Install dependencies
run:
`npm install`

## 3. Set environment variables

Create a .env file in the root:

``` 
MONGO_URI=mongodb://mongo:27017/footprint
JWT_SECRET=supersecretkey
```


Note: When running with Docker, these values are already set in docker-compose.yml.

## 4. Run with Docker (recommended)

Make sure [Docker][1] and Docker Compose are installed.

[1]: https://docs.docker.com/get-started/get-docker/
`docker compose up --build`


This will:

* Start MongoDB on port 27017

* Start the API + frontend on port 4000

Open the app in your browser:

👉 [http://localhost:4000][2]

[2]: http://localhost:4000

