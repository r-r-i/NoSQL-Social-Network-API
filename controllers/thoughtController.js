const { User, Thought, } = require('../models');
const userController = require('./userController');

module.exports = {

// GET to get all thoughts
    getThoughts(req, res) {
        Thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },
// GET to get a single thought by its _id
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .select('-__V')
        .then((thought) => 
            !thought
            ? res.status(404).json({ message: 'No thought with this ID'})
            : res.json(thought));
    },
// POST to create a new thought
    // dont forget to push the created thought's _id to the asociated user's thoughts array field
createThought({ body }, res ){
    Thought.create(body)
    .then(({ _id }) => {
        return User.findOneAndUpdate(
            {_id: body.userId},
            {$push: {thoughts: _id }},
            {new: true }
        );
    })
    .then((user) => 
        !user
        ?res
            .status(404)
            .json({ message: "No user with that ID"})
        : res.json(user)
        )
        .catch((err) => res.status(500).json(err))
},


// PUT to update a thought by its _id
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((thought) => 
            !thought
                ? res.status(404).json({ message: "No thought with that ID"})
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },

// DELETE to remove a thought by its _id
    deleteThought(req, res) {
        Thought.findOneAndDelete({_id: req.params.thoughtId })
        .then((thought) => 
            !thought
                ? res.status(404).json({ message: 'No thought with that ID'})
                : Thought.deleteOne({ _id: req.params.thoughtId })
        )
        .then(() => res.json({ message: 'Thought deleted!'}))
        .catch((err) => res.status(500).json(err));
    },

// /api/thoughts/:thoughtId/reactions
    // POST to create a reaction stored in a single thought's reactions array field
    // DELETE to pull and remove a reaction by the reaction's reactionId value



};


