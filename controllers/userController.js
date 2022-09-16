const { ObjectId } = require('mongoose').Types;
const { User, Thought, } = require('../models');
module.exports = {


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


// // DELETE to remove user by its _id
// deleteUser(req, res) {
//     User.findOneAndRemove({ _id: req.params.userId })
//         .then((student) => 
//             !student 
//                 ? res.status(404).json({ message: "No user with that ID"})
//                 : Thought.findOneAndUpdate(
//                     { reactions: req.params.userId },
//                     { $pull: { reactions: req.params.userId } },
//                     { new: true }
//                 )
//         )
//         .then((thought) => 
//             !thought
//                 ? res.status(404).json({ message: 'User deleted, but no thoughts found'})
//                 : res.json({ message: 'User successfully deleted '})
//             )
//             .catch((err) => {
//                 console.log(err);
//                 res.status(500).json(err);
//             })

// }

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

};

// /api/users/:userId/friends/:friendId
    // POST to add a new friend to a user's friend list
    // DELETE to remove a friend from a user's friend list
