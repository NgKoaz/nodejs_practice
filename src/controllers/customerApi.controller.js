const customerModel = require('../models/customer')
const mongoose = require('mongoose')
const aqp = require('api-query-params')
const { saveFile } = require('../services/file')
const Joi = require('joi')
const ProjectModel = require('../models/project')
const ObjectId = require("../services/SqlConnection").Schema.Types.ObjectId


const customerValidator = Joi.object({
    name: Joi.string(),
    address: Joi.string(),
    phone: Joi.string(),
    email: Joi.string().email(),
    image: Joi.link(),
    description: Joi.string(),
})


module.exports = {
    uploadImage: async (req, res) => {
        if (!req.files || !req.files?.image || Object.keys(req.files).length <= 0) {
            res.send('No file upload!');
            return;
        }
        const image = req.files.image;

        if (Array.isArray(image)) {
            const imgNameArr = []
            for (const i of image) {
                const result = await saveFile(i);
                if (result) {
                    imgNameArr.push(result)
                } else {
                    res.status(500).json({
                        error: result
                    });
                    return;
                }
            }
            res.status(201).json({
                data: imgNameArr
            })
        } else {
            const result = await saveFile(image);
            if (result) {
                res.status(201).json({
                    data: [result]
                });
            } else {
                res.status(500).json({
                    error: result
                });
            }
        }
    },

    getCustomers: async (req, res) => {
        const { filter, skip, limit } = aqp(req.query);
        const qr = (filter && Object.keys(filter).length > 0) ? customerModel.find(filter) : customerModel.find()
        if (skip != null && limit != null) {
            try {
                const result = await qr.limit(limit).skip(skip).exec();
                res.status(200).json(result)
            } catch (err) {
                res.status(400).json({
                    error: err
                })
            }
            return;
        }
        try {
            const result = await qr.exec()
            res.status(200).json(result)
        } catch (err) {
            res.status(400).json({
                error: err
            })
        }
    },

    createCustomers: async (req, res) => {
        if (Array.isArray(req.body)) {
            try {
                const result = await customerModel.create(req.body)
                res.status(201).json(result)
            } catch (err) {
                res.status(400).json({
                    error: err
                })
            }
            return;
        }
        res.status(400).json({
            error: {
                message: "Wrong format!",
            }
        })
    },

    updateCustomer: async (req, res) => {
        const { customerId } = req.params;
        if (customerId == null) {
            res.status(400).json({
                error: {
                    message: "Customer Id is not found!"
                }
            })
            return;
        }
        if (req.body && Object.keys(req.body).length > 0) {
            try {
                const result = await customerModel.updateOne({ _id: customerId }, req.body)
                res.status(201).json(result)
            } catch (err) {
                res.status(400).json({
                    error: err
                })
            }
            return;
        }
        res.status(400).json({
            error: {
                code: 400,
                message: "Body is null!"
            }
        })
    },

    updateCustomers: async (req, res) => {
        if (req.body && Array.isArray(req.body)) {
            const result = []
            const uReqArr = req.body
            for (const uReq of uReqArr) {
                const { customerId, type, projectId } = uReq;
                let customer = null;
                try {
                    customer = (await customerModel.find({ _id: customerId })).pop()
                } catch (err) {
                    console.log(err)
                    result.push({
                        error: {
                            code: 400,
                            message: "Maybe, Customer Id is not found!"
                        }
                    })
                    continue;
                }
                switch (type) {
                    case "UPDATE_CUSTOMER":
                        let validateResult = null;
                        try {
                            validateResult = await customerValidator.validateAsync({
                                name: uReq.name,
                                address: uReq.address,
                                phone: uReq.phone,
                                email: uReq.email,
                                image: uReq.image,
                                description: uReq.description,
                            })
                            customer.name = validateResult.name ?? customer.name
                            customer.address = validateResult.address ?? customer.address
                            customer.phone = validateResult.phone ?? customer.phone
                            customer.email = validateResult.email ?? customer.email
                            customer.image = validateResult.image ?? customer.image
                            customer.description = validateResult.description ?? customer.description
                            const projects = await ProjectModel.find({ _id: { $in: customer.projects } })
                            projects && projects.forEach(p => {
                                p.customer = {
                                    name: customer.name,
                                    address: customer.address,
                                    phone: customer.phone,
                                    email: customer.email,
                                }
                                p.save()
                            });
                            const saveResult = await customer.save()
                            result.push(saveResult)
                        } catch (err) {
                            console.log(err)
                            result.push(err)
                        }

                        break;

                    case "ADD_PROJECT":
                        try {
                            new ObjectId(projectId)
                            const project = (await ProjectModel.find({ _id: projectId }))?.pop()
                            if (project == null) {
                                result.push({
                                    error: {
                                        code: 400,
                                        message: "Project ID is not found!"
                                    }
                                })
                                continue;
                            }
                            // if (project?.customer && Object.values(project?.customer).length > 0 && Object.values(project?.customer).every(o => o !== null)) {
                            //     result.push({
                            //         error: {
                            //             code: 400,
                            //             message: "Project ID is already owned by someone!"
                            //         }
                            //     })
                            //     continue;
                            // }
                            if (customer?.projects?.length) {
                                customer.projects = [project]
                            } else {
                                if (customer.projects.some(pId => pId.toString() === projectId)) continue;
                                customer.projects.push(project)
                            }
                            project.customer = {
                                name: customer.name,
                                address: customer.address,
                                phone: customer.phone,
                                email: customer.email,
                            }
                            await project.save()
                            const saveResult = await customer.save()
                            result.push(saveResult)
                        } catch (err) {
                            console.log(err)
                            result.push({
                                error: {
                                    code: 400,
                                    message: "Project ID may not in true form of MongoDb!"
                                }
                            })
                        }
                        break;

                    case "REMOVE_PROJECT":
                        try {
                            const project = (await ProjectModel.find({ _id: projectId }))?.pop()
                            if (project == null) {
                                result.push({
                                    error: {
                                        code: 400,
                                        message: "Project ID is not found!"
                                    }
                                })
                                continue;
                            }
                            if (customer?.projects?.length &&
                                (customer.projects.length == 0 ||
                                    customer.projects.every(pId => pId.toString() !== projectId))
                            ) {
                                result.push({
                                    error: {
                                        code: 400,
                                        message: "Customer doesn't have this project!"
                                    }
                                })
                                continue;
                            }
                            customer.projects = customer.projects.filter(pId => pId.toString() !== projectId)
                            project.customer = null
                            await project.save()
                            const saveResult = await customer.save()
                            result.push(saveResult)
                        } catch (err) {
                            console.log(err)
                            result.push({
                                error: {
                                    code: 400,
                                    message: "Project ID may not in true form of MongoDb!"
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

    deleteCustomers: async (req, res) => {
        if (req.body && Array.isArray(req.body)) {
            const idArr = req.body.map(id => new mongoose.Types.ObjectId(id));
            try {
                const result = await customerModel.delete({ _id: { $in: idArr } }).exec()
                res.status(200).json(result)
            } catch (err) {
                res.status(400).json({
                    error: err
                })
            }
            return;
        }
        res.status(400).json({
            error: "Send an array customer id instead!"
        })
    },

    deleteCustomer: async (req, res) => {
        const { customerId } = req.params;
        try {
            const id = new mongoose.Types.ObjectId(customerId);
            const result = await customerModel.deleteById(id).exec()
            res.status(200).json(result)
        } catch (err) {
            res.status(400).json({
                error: "Id is wrong format!"
            })
        }
    },
}
