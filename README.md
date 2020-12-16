
# API Project: Exercise Tracker for FCC
[![Run on Repl.it](https://repl.it/badge/github/freeCodeCamp/boilerplate-project-timestamp)](https://exercise-tracker.andradeoromulo.repl.co)

## About
This is my project of the [Exercise Tracker challenge](https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/exercise-tracker) for the freeCodeCamp API and Microservice certification. It was built based on the boilerplate available [here](https://github.com/freeCodeCamp/boilerplate-project-exercisetracker/).

## Technologies
A little bit of what's inside the project:
- **Node.js** and **Express** to create the server and handle routes, requests and responses.
- **express-validator** to clean and validate the input data.
- **Mongoose** to persist all the data.

## Endpoints:

Endpoints | Description | Params
----------|-------------|-------------
POST `/api/exercise/new-user` | Create a new user | username* (via body)
GET `/api/exercises/users` | Return all registered users | n/a
POST `/api/exercises/add` | Add an exercise for a specific user | userId*, description*, duration*, date (via body)
GET `/api/exercises/log` | Return the log of a user's exercises | userId*, from, to, limit (via query)

#### Example output:
* `{"_id":"5fda1383bb165d0493ae9427","username":"testUser"}`
* `[{"_id":"5fda1383bb165d0493ae9427","username":"testUser","log":[{"description":"testExercise","duration":15,"date":"2020-12-16T14:04:10.761Z"}],"count":1}]`

## How to use:
Be sure to change the `uri` variable in `database.js` according to your own MongoDB server. It's also possible to just create a `.env` file and store this information there in order to keep it hidden and safe. Then, just run on terminal:
```
npm install
npm start
```

## Feedback
I'm a student and I really would like to hear case you have any tips, correction suggestions or comments about any my of projects (🤓).
