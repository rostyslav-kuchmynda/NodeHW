const fs = require('fs');

const uuid = require('uuid');
const Joi = require('@hapi/joi');

const todosObj = JSON.parse(fs.readFileSync('./data/todos.json'))

const schema = Joi.object().keys({
    todo: Joi.string().trim().required(),
    done: Joi.boolean().required()
})

exports.getTodos = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: todosObj.length,
        data: {
            todosObj
        }
    });
}

exports.addTodo = (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 'fail',
            data: {
                error
            }
        });
    }

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

exports.toggleDoneStat = (req, res) => {
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

exports.removeTodo = (req, res) => {
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