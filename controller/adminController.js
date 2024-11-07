const sequelize = require("sequelize")
const { Validator } = require("node-input-validator")
const path = require('path')
const helper = require("../middleWare/helper")
const { fileUpload } = require("../middleWare/helper")
const db = require("../models")
const session = require("express-session")
const bcrypt = require("bcrypt")
const { raw } = require("mysql")
const { Where } = require("sequelize/lib/utils")
const { table } = require("console")
const saltRound = 10

module.exports = {

    dashboard: async (req, res) => {
        try {
            if (!req.session.users) {
                return res.redirect("/loginPage")
            }

            const msg = req.flash("msg");
            res.render("common/dashboard", {
                session: req.session.users, msg, error: req.flash("error"), title: "Dashboard",
            })
        } catch (error) {
            req.flash('error', error.message)
            console.log(error, "error");

        }
    },

    loginPage: async (req, res) => {
        try {
            const msg = req.flash("msg");
            res.render("admin/login", {
                msg,
                error: req.flash("error"),
                title: "login"
            });
        } catch (error) {
            console.error("Error in loginPage:", error);
        }
    },

    loginPost: async (req, res) => {
        try {
            let login = await db.users.findOne({ where: { email: req.body.email, role: 0 } })
            if (!login) {
                req.flash("error", "Please enter correct email")
                res.redirect('/loginPage')
            }
            else if (login.isVerified === 0) {
                req.flash("error", "Account not verified")
                res.redirect('/loginPage')
            }
            const password = await bcrypt.compare(req.body.password, login.password);
            if (!password) {
                req.flash('error', "Wrong password")
                res.redirect('/loginPage')
            } else {
                req.session.users = login
                req.flash("msg", "Login successfully")
                res.redirect("/dashboard")
            }
        } catch (error) {
            req.flash('error', error.message)
            console.log(error, "error");
        }
    },

    adminProfilePage: async (req, res) => {
        try {
            if (!req.session.users) {
                return res.redirect("/loginPage")
            }
            const msg = req.flash("msg")
            res.render("admin/adminProfile.ejs", {
                msg,
                session: req.session.users,
                error: req.flash("error"),
                title: "adminProfile"
            })
        } catch (error) {
            console.log(error, "error");

        }
    },

    getAdminProfile: async (req, res) => {
        try {
            const getProfile = await db.users.findOne({
                where: { _id: req.params.id }
            })
            return res.json({
                success: true,
                status: 200,
                message: " get profile successful",
                body: getProfile
            })

        } catch (error) {
            console.log(error, "error");

        }
    },

    editProfile: async (req, res) => {
        try {
            if (!req.session.users) {
                return res.redirect("/loginPage")
            }
            const msg = req.flash("msg")
            res.render("admin/editProfile.ejs", {
                msg,
                session: req.session.users,
                error: req.flash("error"),
                title: "editProfile"
            })
        } catch (error) {
            console.log(error, "error");

        }
    },

    updateAdminProfile: async (req, res) => {
        try {
            if (!req.session.users || !req.session.users.id) {
                return helper.failed(res, "User session not found or missing _id");
            }
            if (req.files && req.files.image.name) {
                const image = req.files.image;
                if (image) req.body.image = await fileUpload(image, "userImage");
            }

            const updateAdminProfile = await db.users.update({
                name: req.body.name,
                image: req.body.image,
                phone: req.body.phone,
                address: req.body.address,
            },
                {
                    where: { id: req.session.users.id }
                },)


            let updatedUser = await db.users.findOne({
                where: { id: req.session.users.id }
            })

            req.session.users = updatedUser
            req.flash("msg", "Profile updated sucessfully")
            res.redirect("/dashboard")
        } catch (error) {
            console.log(error, "error");

        }
    },

    changePasswordPage: async (req, res) => {
        try {
            if (!req.session.users) {
                return res.redirect("/loginPage")
            }
            const msg = req.flash("msg")
            res.render("admin/changePassword.ejs", {
                msg,
                session: req.session.users,
                error: req.flash("error"),
                title: "changePassword"

            })
        } catch (error) {
            console.log(error, "error");

        }
    },

    changePassword: async (req, res) => {
        try {
            const data = await db.users.findOne({ where: { id: req.session.users.id } })
            const decryptPassword = await bcrypt.compare(req.body.oldPassword, data.password)
            if (!decryptPassword) {
                req.flash('error', 'Old password does not match')
                res.redirect('/changePasswordPage')
            } else {
                const encryptPassword = await bcrypt.hash(req.body.newPassword, saltRound)
                data.password = encryptPassword
                data.save()
                req.flash("msg", "password updated successfully")
                res.redirect('/dashboard')
            }
        } catch (error) {
            console.log(error, "error");

        }
    },

    logout: async (req, res) => {
        try {
            delete req.session.users
            req.flash("msg", "Logout Successfully");
            res.redirect('/loginPage')
        } catch (error) {
            req.flash('error', error.message)
            console.log(error, "error");
        }
    },




}