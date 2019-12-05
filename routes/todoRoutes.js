const express = require('express');
const { getTodos, addTodo, toggleDoneStat, removeTodo } = require('../controllers/todoController');
const router = express.Router();


router
    .route('/')
    .get(getTodos)
    .post(addTodo);

router
    .route('/:id')
    .patch(toggleDoneStat)
    .delete(removeTodo);


module.exports = router;