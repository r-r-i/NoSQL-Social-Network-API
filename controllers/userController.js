const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');
module.exports = {

// GET all users
    getUsers(req, res) {
        User.find()
            .then(async (users) => {
                const userObj = {
                    users,
                    thoughts: await Thought.find()
                }
            })
    },

// GET a single user by its _id and populated thought and friend data

// POST a new user

// PUT to update a user by its _id

// DELETE to remove user by its _id
deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
        .then((student) => 
            !student 
                ? res.status(404).json({ message: "No user with that ID"})
                : Thought.findOneAndUpdate(
                    { reactions: req.params.userId },
                    { $pull: { reactions: req.params.userId } },
                    { new: true }
                )
        )
        .then((thought) => 
            !thought
                ? res.status(404).json({ message: 'User deleted, but no thoughts found'})
                : res.json({ message: 'User successfully deleted '})
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            })

}

// /api/users/:userId/friends/:friendId
    // POST to add a new friend to a user's friend list
    // DELETE to remove a friend from a user's friend list

};