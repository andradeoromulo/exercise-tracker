const User = require("../models/user");
const mongoose = require("mongoose");
const { body, query, validationResult } = require("express-validator")

// Register a new user
exports.post_new_user = function(req, res, next) {

    const errors = validationResult(req).array();

    if(errors.length != 0)
        return res.status(400).json({ error: errors[0].msg });
    
    const usernameInput = req.body.username;

    User.findOne({ username: usernameInput })
        .then(existingUser => {
            // Checking if this user existis already
            if(existingUser) 
                return next(new Error("username already taken"));

            // Case username is available, the new user is created
            return User.create({ username: usernameInput, count: 0 });
        })
        .then(newUser => {
            res.status(201).json(newUser)
        })
        .catch(err => {
            next(err);
        });
        
};

// Return all users
exports.get_users = function(req, res, next) {

    User.find({}, "username")
        .then(users => res.json(users))
        .catch(err => next(err));

};

// Add exercices to an existing user
exports.post_add = function(req, res, next) {

    const errors = validationResult(req).array();

    if(errors.length != 0)
        return res.status(400).json({ error: errors[0].msg });

    const userIdInput = req.body.userId;
    const descriptionInput = req.body.description;
    const durationInput = req.body.duration;
    let dateInput = req.body.date;

    if(!dateInput)
        dateInput = new Date().toISOString();

    User.findOneAndUpdate(
        {
            _id: userIdInput
        },
        {
            $push: {
                log: {
                    description: descriptionInput,
                    duration: durationInput,
                    date: dateInput
                }
            }
        },
        {
            new: true
        })
        .then(updatedUser => {

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                description: updatedUser.log[updatedUser.log.length-1].description,
                duration: updatedUser.log[updatedUser.log.length-1].duration,
                date: updatedUser.log[updatedUser.log.length-1].date
            });

        })
        .catch(err => {
            next(err);
        });

};

// Return a user`s exercise log
exports.get_log = function(req, res, next) {

    const errors = validationResult(req).array();

    if(errors.length != 0)
        return res.status(400).json({ error: errors[0].msg });

    const userIdInput = req.query.userId.toString();
    let from = req.query.from;
    let to = req.query.to;
    let limit = req.query.limit;

    if(from) {
        from = new Date(from);

        if(to)
            to = new Date(to);
        else 
            to = new Date()

    } else {
        from = new Date(0);
        to = new Date("2999-12-31");
    }

    if(!limit || limit == 0)
        limit = 9999;
    else 
        limit = parseInt(limit);

    User.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(userIdInput)
            }
        },
        {
            $project: {
                _id: 1,
                username: 1,
                log: { 
                    $slice: [
                        {
                            $filter: { 
                                input: "$log", 
                                as: "log", 
                                cond: { 
                                    $and: [
                                        { $gte: [ "$$log.date", from ] },
                                        { $lte: [ "$$log.date", to ] }
                                    ]
                                } 
                            }
                        }, 
                        limit
                    ]
                }
            }
        }
        ])
        .then((log) => {

            log[0].count = log[0].log.length;
            
            res.json(log);
        })
        .catch(err => {
            next(err);
        });
       
}

// Validating params sent via body or query
exports.validate = (method) => {

    switch(method) {
        case "post_new_user":
            return [
                body("username")
                    .exists({ checkFalsy: true }).withMessage("username is required")
                    .trim()
                    .isLength({ min: 3, max: 20 }).withMessage("username must have between 3 and 20 characters")
                    .isAlphanumeric().withMessage("username can only have alphanumeric characters")
            ];
        case "post_add":
            return [
                body("userId")
                    .exists({ checkFalsy: true }).withMessage("userId is required")
                    .trim()
                    .isLength({ min: 12, max: 24 }).withMessage('userId must have 12 or 24 characters')
                    .isAlphanumeric().withMessage("username can only have alphanumeric characters"),
                body("description")
                    .exists({ checkFalsy: true }).withMessage("description is required")
                    .trim()
                    .isLength({ min: 3, max: 50 }).withMessage('description must have between 3 and 50 characters')
                    .isAscii().withMessage('description must contain only valid ASCII characters'),
                body("duration")
                    .exists({ checkFalsy: true }).withMessage("duration is required")
                    .trim()
                    .isLength({ min: 1, max: 9999 }).withMessage('duration must have between 1 and 9999 characters')
                    .isNumeric().withMessage('duration must be a number'),
                body("date")
                    .optional({ checkFalsy: true })
                    .trim()    
                    .isISO8601()
                    .withMessage('invalid date format')
                    .isAfter(new Date(0).toJSON())
                    .isBefore(new Date('2999-12-31').toJSON())
                    .withMessage("invalid date format")
            ];
        case "get_log":
            return [
                query("userId")
                    .exists({ checkFalsy: true }).withMessage("userId is required")
                    .trim()
                    .isLength({ min: 12, max: 24 }).withMessage('userId must have 12 or 24 characters')
                    .isAlphanumeric().withMessage("username can only have alphanumeric characters"),
                query("from")
                    .optional()
                    .trim()    
                    .isISO8601()
                    .withMessage('invalid date format')
                    .isAfter(new Date(0).toJSON())
                    .isBefore(new Date('2999-12-31').toJSON())
                    .withMessage("invalid date format"),
                query("to")
                    .optional()
                    .trim()    
                    .isISO8601()
                    .withMessage('invalid date format')
                    .isAfter(new Date(0).toJSON())
                    .isBefore(new Date('2999-12-31').toJSON())
                    .withMessage("invalid date format"),
                query("limit")
                    .optional()
                    .trim()
                    .isNumeric({ no_symbols: true }).withMessage('limit must a number')
            ];
        default:
            return [];
    }

}
