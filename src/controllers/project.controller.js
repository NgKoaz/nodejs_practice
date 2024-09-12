const ProjectModel = require('../models/project')
const apg = require('api-query-params');
const { isIntegerString } = require('../utils/number');
const ObjectId = require("mongoose").Types.ObjectId
const Joi = require('joi');

const projectValidator = Joi.object({
    name: Joi.string()
        .alphanum(),
    price: Joi.number(),
    description: Joi.string()
        .alphanum(),
})

module.exports = {
    createProject: async (req, res) => {
        const { name, price, description } = req.body;
        if (name && price) {
            try {
                const result = await ProjectModel.create({ name, price, description })
                res.status(201).json({
                    data: result
                })
            } catch (err) {
                console.log(err)
                res.status(400).json({
                    error: {
                        code: 400,
                        message: "Query is failed!"
                    }
                })
            }
            return;
        }
        res.status(400).json({
            error: {
                code: 400,
                message: `'name' or 'price' is null!`
            }
        })
    },

    getProjects: async (req, res) => {
        const { skip, limit, filter, population } = apg(req.query);
        const qr = ProjectModel.find(filter ?? {})
        skip && isIntegerString(skip) && qr.skip(skip);
        limit && isIntegerString(limit) && qr.limit(limit);
        qr.populate(population)
        try {
            const result = await qr.exec()
            res.status(200).json({
                data: result
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({
                error: {
                    code: 500,
                    message: "Database got an error!"
                }
            })
        }
    },

    updateProjects: async (req, res) => {
        if (req.body && Array.isArray(req.body)) {
            const result = []
            const reqArr = req.body;
            for (const item of reqArr) {
                const { type, projectId, userIdArr, name, description, price } = item;
                let project = null;
                try {
                    project = (await ProjectModel.find({ _id: projectId }))?.pop();
                } catch (err) {
                    console.log(err)
                }
                if (project == null) {
                    result.push({
                        error: {
                            code: 400,
                            message: "ObjectId must be suit with mongoDb!"
                        }
                    })
                    continue;
                }

                let saveResult = null;
                switch (type) {
                    case "ADD_USER":
                        for (const uId of userIdArr) {
                            if (project.users.some(user => user.toString() === uId)) continue;
                            project.users.push(uId)
                        }
                        saveResult = await project.save()
                        result.push(saveResult)
                        break;

                    case "REMOVE_USER":
                        project.users = project.users.filter(user => !userIdArr.some(uId => uId === user.toString()))
                        saveResult = await project.save()
                        result.push(saveResult)
                        break;

                    case "UPDATE_PROJECT":
                        let updateResult = null;
                        try {
                            const validateResult = await projectValidator.validateAsync({ name, description, price })
                            validateResult && Object.keys(validateResult).length
                                && (updateResult = await ProjectModel.updateOne({ _id: projectId }, validateResult))
                            result.push(updateResult ?? {})
                        } catch (err) {
                            console.log(err)
                            result.push({
                                error: {
                                    code: 400,
                                    message: err
                                }
                            })
                        }
                        break;

                    default:
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

    deleteProjects: async (req, res) => {
        if (req.body && Array.isArray(req.body)) {
            // const result = []
            const idArr = req.body;
            try {
                const result = await ProjectModel.delete({ _id: { $in: idArr } });
                res.status(200).json({
                    data: result
                })
            } catch (err) {
                res.status(500).json({
                    error: {
                        code: 500,
                        message: "Failed at database!"
                    }
                })
            }
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
