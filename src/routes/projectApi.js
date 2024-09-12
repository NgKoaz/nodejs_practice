const express = require('express')
const { createProject, getProjects, deleteProjects, updateProjects } = require('../controllers/project.controller')
const { createUser, getUsers, updateUsers, deleteUsers } = require('../controllers/user.controller')
const { createTasks, getTasks, deleteTasks, updateTasks } = require('../controllers/task.controller')
const router = express.Router()

router
    .route("/projects")
    .get(getProjects)
    .post(createProject)
    .put(updateProjects)
    .delete(deleteProjects)

router
    .route("/users-project")
    .get(getUsers)
    .post(createUser)
    .put(updateUsers)
    .delete(deleteUsers)

router
    .route("/tasks")
    .get(getTasks)
    .post(createTasks)
    .put(updateTasks)
    .delete(deleteTasks)


module.exports = router