const createView = require('../models/createView')
const homeView = require('../models/homeView')
const UserModel = require('../models/user')

const express = require('express');

const getCreatePage = (req, res) => {
    res.render("create", createView())
}

const postCreate = async (req, res) => {

    if (!req?.body) {
        res.redirect("/");
        return;
    }
    const { username, email, password } = req.body;
    try {
        // const [result, fields] = await conPool.query("INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES (NULL, ?, ?, ?);", [username, email, password])
        await UserModel.create({
            username,
            email,
            password
        })

        res.redirect("/");
    } catch (err) {
        res.render("create", createView({ username, email, password, errorMessage: "Database error!" }))
        console.log(err)
    }
}

module.exports = { getCreatePage, postCreate }