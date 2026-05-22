# Crochet Tracker

A app to keep track of my crochet projects. You can add projects, update their status, leave notes, and filter by where they're at.

## Live App
https://crochet-tracker-84nn8bjw8-cunymerlins-projects.vercel.app/

## Stack
- React (frontend) — Vercel
- Express + Node (backend) — Render
- PostgreSQL via Neon (database)

## Features
- Add a project with name, yarn color, pattern, status, and notes
- Edit or delete any project
- Filter by status: In Progress, Done, or Frogged

## How to Run Locally
1. Clone the repo
2. In the `server` folder, run `npm install` and add a `.env` file with your `DATABASE_URL`
3. Start the backend: `node index.js`
4. In the `client` folder, run `npm install` then `npm start`

## About
Built for my Immersive Engineering Lab final. I wanted to make something I'd actually use — I'm part of the Lehman Crochet Club so this felt like a natural fit. Used Claude AI to help with debugging and code structure along the way.

**Created by Esmerlin — CUNY Lehman, Computer Information Systems**