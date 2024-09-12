const Joi = require("joi")
const UserModel = require("../models/user")
const { isIntegerString } = require("../utils/number")
const ProjectModel = require("../models/project")

const leaderValidator = Joi.object({
    username: Joi.string()
        .alphanum(),
    email: Joi.string()
        .email(),
    password: Joi.string()
        .alphanum()
})


module.exports = {
    createUser: async (req, res) => {
        const { username, email, password } = req.body
        if (username && email && password) {
            try {
                const result = await UserModel.create({
                    username, email, password
                })
                res.status(201).json({
                    data: result
                })
            } catch (err) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: "Failed at database!"
                    }
                })
            }
            return;
        }
        res.status(400).json({
            error: {
                code: 400,
                message: "One of these fields is null!"
            }
        })
    },

    getUsers: async (req, res) => {
        const { skip, limit, filter } = req.query;
        const qr = UserModel.find(filter ?? {})
        skip && isIntegerString(skip) ? qr.skip(skip) : null;
        limit && isIntegerString(limit) ? qr.limit(limit) : null;

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

    updateUsers: async (req, res) => {
        if (req.body && Array.isArray(req.body)) {
            const result = []
            const updateReqArr = req.body
            for (const uReq of updateReqArr) {
                const { type, userId, projectId } = uReq;
                switch (type) {
                    case "UPDATE_USER":
                        try {
                            const validateResult = await leaderValidator.validateAsync({
                                username: uReq.username,
                                email: uReq.email,
                                password: uReq.password,
                            })
                            let user = (await UserModel.find({ _id: userId })).pop()
                            validateResult.username && (user.username = validateResult.username)
                            validateResult.password && (user.password = validateResult.password)
                            validateResult.email && (user.email = validateResult.email)

                            await ProjectModel.updateMany({ _id: { $in: user.leader_projects ?? [] } }, {
                                leader: {
                                    username: user.username,
                                    password: user.password,
                                    email: user.email
                                }
                            })

                            const saveResult = await user.save()
                            result.push(saveResult)
                        } catch (err) {
                            console.log(err)
                            result.push({
                                error: {
                                    code: 400,
                                    message: "Project ID or User Id is not found!"
                                }
                            })
                            continue;
                        }
                        break;

                    case "ADD_PROJECT_LEADER":
                        try {
                            const user = (await UserModel.find({ _id: userId })).pop()
                            const project = (await ProjectModel.find({ _id: projectId })).pop()
                            project.leader = {
                                username: user.username,
                                email: user.email,
                                password: user.password
                            }
                            const saveResult = await project.save()
                            user.leader_projects.every(pId => pId.toString() !== projectId) && user.leader_projects.push(projectId)
                            await (user.save())
                            result.push(saveResult)
                        } catch (err) {
                            console.log(err)
                            result.push({
                                error: {
                                    code: 400,
                                    message: "Project ID or User Id is not found!"
                                }
                            })
                            continue;
                        }
                        break;

                    case "REMOVE_PROJECT_LEADER":
                        try {
                            const user = (await UserModel.find({ _id: userId })).pop()
                            const project = (await ProjectModel.find({ _id: projectId })).pop()
                            project.leader = null
                            const saveResult = await project.save()
                            user.leader_projects = user.leader_projects.filter(pId => pId.toString() !== projectId)
                            await (user.save())
                            result.push(saveResult)
                        } catch (err) {
                            console.log(err)
                            result.push({
                                error: {
                                    code: 400,
                                    message: "Project ID or User Id is not found!"
                                }
                            })
                            continue;
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

    deleteUsers: async (req, res) => {
        if (req.body && Array.isArray(req.body)) {
            // const result = []
            const idArr = req.body;

            try {
                const result = await UserModel.delete({ _id: { $in: idArr } });
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