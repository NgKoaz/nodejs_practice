const UserModel = require("../models/user")

const getUsers = async (req, res) => {
    const userList = await UserModel.find({})
    res.status(200).json({
        data: userList
    })
}

const postUser = async (req, res) => {
    const { username, email, password } = req.body;
    if (!(username && email && password)) {
        res.status(401).json({
            error: {
                code: 1,
                message: "One of inputs is null"
            }
        })
        return;
    }
    const result = await UserModel.create({
        username, email, password
    })
    res.status(201).json({
        data: result
    })
}

const putUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    if (!(username && email && password)) {
        res.status(401).json({
            error: {
                code: 1,
                message: "One of inputs is null"
            }
        })
        return;
    }

    const result = await UserModel.updateOne({ _id: id }, { username, email, password })
    res.status(204).json({
        data: result
    })
}

const deleteUser = async (req, res) => {
    const { id } = req.params;

    const result = await UserModel.deleteOne({ _id: id })
    res.status(200).json({
        data: result
    })
}


module.exports = {
    getUsers, postUser, putUser, deleteUser
}