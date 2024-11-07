const sequelize = require("sequelize")
const { Validator } = require("node-input-validator")
const path = require('path')
const helper = require("../middleWare/helper")
const { fileUpload } = require("../middleWare/helper")
const db = require("../models")
const session = require("express-session")
const bcrypt = require("bcrypt")
const saltRound = 10

module.exports = {
    signup: async (req, res) => {
        try {

            const password = await bcrypt.hash(req.body.password, saltRound)
            if (req.files && req.files.image.name) {
                const image = req.files.image;
                if (image) req.body.image = await fileUpload(image, "userImage");
            }

            const data = await db.users.create({
                role: req.body.role,
                name: req.body.name,
                email: req.body.email,
                password: password,
                image: req.body.image,
                phone: req.body.phone,
                address: req.body.address,
                gender: req.body.gender,
                description: req.body.description,
                otp: req.body.otp,
                social_id: req.body.social_id,
                social_type: req.body.social_type

            })
            return res.json({
                success: true,
                status: 200,
                message: "signup successfully",
                body: data
            })
        } catch (error) {
            console.log(error, "error");

        }
    },

    getUser: async (req, res) => {
        try {
            if (!req.session.users) {
                res.redirect("/loginPage")
            }
            const Data = await db.users.findAll({ where: { role: 1 } })
            if (Data) {
                Data.sort((a, b) => b.createdAt - a.createdAt);

                const msg = req.flash("msg");
                res.render("users/user.ejs", {
                    session: req.session.users,
                    msg,
                    error: req.flash("error"),
                    Data,
                    title: 'user'
                })
            }
        } catch (error) {
            console.log(error, "error");

        }
    },

    userView: async (req, res) => {
        try {
            if (!req.session.users) {
                return res.redirect("/loginPage")
            }
            let Data = await db.users.findOne({ where: { id: req.params.id } })
            const msg = req.flash("msg");
            res.render("users/userView", {
                session: req.session.users,
                Data,
                msg,
                error: req.flash("error"),
                title: "user"
            })
        } catch (error) {
            req.flash('error', error.message)
            console.log(error, "error");
        }
    },



}