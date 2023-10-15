#!/usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
class Todo {
    title;
    completed;
    constructor(title, completed = false) {
        this.title = title;
        this.completed = completed;
    }
}
function printTodos(todos) {
    console.clear();
    console.log(chalk.bold.yellow('Your Todos:\n'));
    if (todos.length === 0) {
        console.log(chalk.gray('No todos yet.'));
    }
    else {
        todos.forEach((todo, index) => {
            const status = todo.completed ? chalk.green('✔') : chalk.red('✖');
            console.log(`${index + 1}. [${status}] ${todo.title}`);
        });
    }
    console.log('\n');
}
function markTodoComplete(todo) {
    return new Todo(todo.title, true);
}
const todos = loadTodos();
function loadTodos() {
    try {
        const data = fs.readFileSync('todos.json', 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        return [];
    }
}
function saveTodos() {
    const data = JSON.stringify(todos, null, 2);
    fs.writeFileSync('todos.json', data, 'utf8');
}
function addTodo() {
    inquirer
        .prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter a new todo:',
        },
    ])
        .then((answers) => {
        const newTodo = new Todo(answers.title);
        todos.push(newTodo);
        printTodos(todos);
        saveTodos();
        askForAction();
    });
}
function completeTodo() {
    inquirer
        .prompt([
        {
            type: 'input',
            name: 'index',
            message: 'Enter the index of the completed todo:',
        },
    ])
        .then((answers) => {
        const index = parseInt(answers.index) - 1;
        if (index >= 0 && index < todos.length) {
            todos[index] = markTodoComplete(todos[index]);
            saveTodos();
        }
        else {
            console.log(chalk.red('Invalid index.'));
        }
        printTodos(todos);
        askForAction();
    });
}
function removeTodo() {
    inquirer
        .prompt([
        {
            type: 'input',
            name: 'index',
            message: 'Enter the index of the todo to remove:',
        },
    ])
        .then((answers) => {
        const index = parseInt(answers.index) - 1;
        if (index >= 0 && index < todos.length) {
            todos.splice(index, 1);
            saveTodos();
        }
        else {
            console.log(chalk.red('Invalid index.'));
        }
        printTodos(todos);
        askForAction();
    });
}
function viewCompletedTodos() {
    const completed = todos.filter((todo) => todo.completed);
    printTodos(completed);
    askForAction();
}
function exitHandler() {
    console.log(chalk.bold.yellow('Saving your todos...'));
    saveTodos();
    console.log(chalk.bold.yellow('Goodbye!'));
    process.exit();
}
process.on('exit', exitHandler);
function askForAction() {
    inquirer
        .prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Choose an action:',
            choices: ['Add Todo', 'Complete Todo', 'Remove Todo', 'View Completed Todos', 'Quit'],
        },
    ])
        .then((answers) => {
        const { action } = answers;
        switch (action) {
            case 'Add Todo':
                addTodo();
                break;
            case 'Complete Todo':
                completeTodo();
                break;
            case 'Remove Todo':
                removeTodo();
                break;
            case 'View Completed Todos':
                viewCompletedTodos();
                break;
            case 'Quit':
                // exitHandler();
                break;
        }
    });
}
console.log(chalk.bold.cyan('Welcome to your Todo App!\n'));
printTodos(todos); // Display todos loaded from JSON
askForAction();
