const { default: aqp } = require("api-query-params");
const TaskModel = require("../models/task");
const ProjectModel = require("../models/project");
const ObjectId = require("../services/SqlConnection").Types.ObjectId;


module.exports = {
    createTasks: async (req, res) => {
        const taskArr = req.body;
        if (taskArr && Array.isArray(taskArr)) {
            const result = []
            for (const task of taskArr) {
                try {
                    const createResult = await TaskModel.create(task)
                    result.push(createResult)
                } catch (err) {
                    console.log(err)
                    result.push({
                        error: {
                            code: 400,
                            message: "Wrong application JSON format!"
                        }
                    })
                }
            }
            res.status(201).json(result)
            return;
        }
        res.status(400).json({
            error: {
                code: 400,
                message: "Wrong application JSON format!"
            }
        })
    },

    getTasks: async (req, res) => {
        const { filter, skip, limit, population } = aqp(req.query);
        const qr = TaskModel.find(filter ?? {})
        skip && qr.skip(skip)
        limit && qr.limit(limit)
        population && qr.populate(population)
        try {
            const result = await qr.exec()
            res.status(200).json(result)
        } catch (err) {
            console.log(err)
            res.status(500).json({
                error: {
                    code: 500,
                    message: "Database error!",
                    dataSent: aqp(req.query)
                }
            })
        }
    },

    deleteTasks: async (req, res) => {
        const taskIdArr = req.body;
        if (taskIdArr && Array.isArray(taskIdArr)) {
            const result = []
            for (const taskId of taskIdArr) {
                try {
                    const deleteResult = await TaskModel.delete({ _id: taskId })
                    result.push(deleteResult)
                } catch (err) {
                    console.log(err)
                    result.push({
                        error: {
                            code: 400,
                            message: "Wrong application JSON format!"
                        }
                    })
                }
            }
            res.status(200).json(result)
            return;
        }
        res.status(400).json({
            error: {
                code: 400,
                message: "Wrong application JSON format!"
            }
        })
    },

    updateTasks: async (req, res) => {
        const requestArr = req.body;
        if (requestArr && Array.isArray(requestArr)) {
            const result = []
            for (const request of requestArr) {
                const { type, taskId, name, description, userId, projectId } = request;
                let task = null;
                try {
                    task = (await TaskModel.find({ _id: new ObjectId(taskId) }))?.pop()
                } catch (err) {
                    console.log(err)
                }
                if (task == null) {
                    result.push({
                        error: {
                            code: 404,
                            message: "Task is not found!"
                        }
                    })
                    continue;
                }
                switch (type) {
                    case "UPDATE_TASK":
                        name && (task.name = name)
                        description && (task.description = description)
                        break;

                    case "ADD_USER":
                        try {
                            userId && (task.user_id = new ObjectId(userId))
                        } catch (err) {
                            console.log(err)
                            result.push({
                                error: {
                                    code: 400,
                                    message: "Wrong Mongo's ObjectId format!"
                                }
                            })
                            continue;
                        }
                        break;

                    case "ADD_PROJECT":
                        try {
                            const project = (await ProjectModel.find({ _id: projectId })).pop()
                            project.tasks.some(tId => tId.toString() === taskId) || project.tasks.push(taskId)
                            await project.save()
                        } catch (err) {
                            console.log(err)
                            result.push({
                                error: {
                                    code: 404,
                                    message: "Project is not found!"
                                }
                            })
                            continue;
                        }
                        try {
                            projectId && (task.project_id = new ObjectId(projectId))
                        } catch (err) {
                            console.log(err)
                            result.push({
                                error: {
                                    code: 400,
                                    message: "Wrong Mongo's ObjectId format!"
                                }
                            })
                            continue;
                        }
                        break;

                    case "REMOVE_PROJECT":
                        try {
                            const project = (await ProjectModel.find({ _id: projectId })).pop()
                            project.tasks = project.tasks.filter(tId => tId.toString() !== taskId)
                            await project.save()
                        } catch (err) {
                            console.log(err)
                            result.push({
                                error: {
                                    code: 404,
                                    message: "Project is not found!"
                                }
                            })
                            continue;
                        }
                        try {
                            projectId && (task.project_id = null)
                        } catch (err) {
                            console.log(err)
                            result.push({
                                error: {
                                    code: 400,
                                    message: "Wrong Mongo's ObjectId format!"
                                }
                            })
                            continue;
                        }
                        break;

                    default:
                        continue;
                }
                const saveResult = await task.save()
                result.push(saveResult)
            }
            res.status(200).json(result)
            return;
        }
        res.status(400).json({
            error: {
                code: 400,
                message: "Wrong application JSON format!"
            }
        })
    }

}


