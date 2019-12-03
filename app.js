const express = require('express');
const app = express();
const helmet = require('helmet');
const bodyParser = require('body-parser');
const fs = require('fs');
const uuid = require('uuid');
const Joi = require('@hapi/joi');


const PORT = 3000;


app.use(helmet());
app.use(bodyParser.json());

const todosObj = JSON.parse(fs.readFileSync('./data/todos.json'))

app.use('/todos', (req, res, next) => {
    if (req.headers.authorization === 'qwerty') {
        console.log('Auth Successful');
        next();
    } else {
        console.log('Auth Failed');
        next({ status: 403, error: 'Auth Failed' });
    }
});

const schema = Joi.object().keys({
    todo: Joi.string().trim().required(),
    done: Joi.boolean().required()
})

function getTodos(req, res) {
    res.status(200).json({
        status: 'success',
        results: todosObj.length,
        data: {
            todosObj
        }
    });
}

function addTodo(req, res) {
    const newId = uuid.v4();
    const newTodo = Object.assign({ id: newId }, req.body);

    todosObj.push(newTodo);

    const stringifyTodosObj = JSON.stringify(todosObj, null, 2);

    fs.writeFile('./data/todos.json', stringifyTodosObj, 'utf8', err => {
        if (err) throw err;
        res.status(201).json({
            status: 'success',
            results: todosObj.length,
            data: {
                todosObj
            }
        });
    })
}

function toggleDoneStat(req, res) {
    const todoId = req.params.id;

    todosObj.map(obj => {
        if (obj.id === todoId) {
            obj.done = !obj.done;

            const stringifyTodosObj = JSON.stringify(todosObj, null, 2);

            fs.writeFile('./data/todos.json', stringifyTodosObj, 'utf8', err => {
                if (err) throw err;
                res.status(200).json({
                    status: 'success',
                    results: todosObj.length,
                    data: {
                        todosObj
                    }
                });
            })
        }
    })
}

function removeTodo(req, res) {
    const todoId = req.params.id;

    const filteredData = todosObj.filter(obj => obj.id != todoId);

    const newData = JSON.stringify(filteredData, null, 2);

    fs.writeFile('./data/todos.json', newData, 'utf8', err => {
        if (err) throw err;
        res.status(200).json({
            status: 'success',
            results: filteredData.length,
            data: {
                filteredData
            }
        });
    })
}


// app.get('/todos', getTodos);
// app.post('/todos', addTodo);
// app.patch('/todos/:id', toggleDoneStat);
// app.delete('/todos/:id', removeTodo);

app
    .route('/todos')
    .get(getTodos)
    .post(addTodo);

app
    .route('/todos/:id')
    .patch(toggleDoneStat)
    .delete(removeTodo);

app.listen(PORT, (req, res) => {
    console.log('Server started');
})