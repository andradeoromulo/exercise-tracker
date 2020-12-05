const router = require("express").Router();
const userController = require("../controllers/userController");
const user = require("../models/user");

// Register a new user
router.post("/new-user", userController.post_new_user);

// Return all users
router.get("/users", userController.get_users);

// Add exercices to an existing user
router.post("/add", userController.post_add);

// Return a user`s exercise log
router.get("/log", userController.get_log);

module.exports = router;
