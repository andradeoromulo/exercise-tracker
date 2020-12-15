const router = require("express").Router();
const userController = require("../controllers/userController");

// Register a new user
router.post(
    "/new-user", 
    userController.validate("post_new_user"),
    userController.post_new_user);

// Return all users
router.get("/users", userController.get_users);

// Add exercices to an existing user
router.post(
    "/add",
    userController.validate("post_add"), 
    userController.post_add);

// Return a user`s exercise log
router.get(
    "/log", 
    userController.validate("get_log"),
    userController.get_log);

// Error handler
router.use((err, req, res, next) => {
    res.json({
        "error": err.message
    });
});

module.exports = router;
