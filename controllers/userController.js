const { ObjectId } = require('mongoose').Types;
const { User, Thought, } = require('../models');
module.exports = {

// NEED TO FIGURE OUT HOW TO USE MONGOOSE '.populate' method!

// Get all users
getUsers(req, res) {
User.find()
    .select("-__V")
    .then((users) => res.json(users))
    .catch((err) => res.status(500).json(err));
},

// GET a single user by its _id and populated thought and friend data
getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
    .select('-__V')
    .then((user) => 
        !user
        ? res.status(404).json({ message: 'No user with this ID'})
        : res.json(user));
},

// POST a new user
createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
},

// PUT to update a user by its _id
updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },


// Delete a user
deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and thoughs deleted!' }))
      .catch((err) => res.status(500).json(err));
  },



// /api/users/:userId/friends/:friendId

    // POST to add a new friend to a user's friend list
addFriend(req, res) {
  console.log('You are adding a friend');
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $addToSet: { friends: req.params.friendId } },
    { runValidators: true, new: true }
  )
    .then((user) =>
      !user
        ? res
            .status(404)
            .json({ message: 'No user found with that ID' })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
},
// DELETE to remove a friend from a user's friend list
deleteFriend(req, res) {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $pull: { friends: req.params.friendId } },
    { runValidators: true, new: true }
  )
    .then((user) =>
      !user
        ? res
            .status(404)
            .json({ message: 'No user found with that ID' })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
},

};


