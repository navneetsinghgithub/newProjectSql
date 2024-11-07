const sequelize = require("sequelize")
const { Validator } = require('node-input-validator');
const fileExtension = require('file-extension')
const path = require('path')
const util = require('util')
const fs = require('fs')
const { google } = require('googleapis');
const FCM = require("fcm-node");
const axios = require('axios');
// const fcmfile = require('./clean-slate-user-firebase-adminsdk-h5ag5-084f0dce95.json');
// const SCOPES = ['https://www.googleapis.com/auth/cloud-platform'];
// const push_projectName = "clean-slate-user";

// const jwtClient = new google.auth.JWT(
//     fcmfile.client_email,
//     null,
//     fcmfile.private_key,
//     SCOPES,
//     null
// );

module.exports = {
    fileUpload: async (file, folder = "users") => {
        let file_name_string = file.name;
        var file_name_array = file_name_string.split(".");
        var file_ext = file_name_array[1];
        var letters = "ASDFGHGH23544DFGBDSSGDFDFD"
        var result = ""
        while (result.length <2 ) {
            var rand_int = Math.floor(Math.random() * 19 + 1);
            var rand_chr = letters[rand_int];
            if (result.substr(-1, 1) != rand_chr) result += rand_chr;
        }
        var resultExt = `${result}.${file_ext}`;
        file.mv(`public/images/${folder}/${result}.${file_ext}`, function (err) {
            if (err) {
                throw err;
            }
        })
        return resultExt;

    },

    checkValidation: async (v) => {
        try {
            const matched = await v.check();
            if (!matched) {
                const errorResponse = Object.values(v.error || {})
                    .map(error => error.message)
                return errorResponse.join(",")
            }
        } catch (error) {
            console.log(error, "validation error");
            return "validation error"
        }
    },

    failed: (res, message = "") => {
        message =
            typeof message === "object"
                ? message.message
                    ? message.message
                    : ""
                : message;
        return res.status(400).json({
            success: false,
            code: 400,
            message: message,
            body: {},
        })
    },

    success: (res, message = "", body = {}) => {
        return res.status(200).json({
            success: true,
            code: 200,
            message: message,
            body: body
        })
    },

    error: (res, err, req) => {
        let code = typeof err === "object" ? (err.code ? err.code : 400) : 400;
        let message =
            typeof err === "object" ? (err.message ? err.message : "") : err;
        if (req) {
            req.flash("flashMessage", {
                color: "error",
                message,
            });
            const originalUrl = req.originalUrl.split("/")[1];
            return res.redirect(`/${originalUrl}`);
        }
        return res.status(code).json({
            success: false,
            message: message,
            code: code,
            body: {},
        });
    },


    unixTimestamp: () => {
        var time = Date.now();
        var n = time / 1000;
        return (time = Math.floor(n));
    },

    readFile: async function (path) {
        return new Promise((resolve, reject) => {
            const readFile = util.promisify(fs.readFile);
            readFile(path).then((buffer) => {
                resolve(buffer);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    save_notifaction: async function (data) {
        try {
            let save_data = await notification.create(data);
            return save_data;
        } catch (err) {
            throw err;
        }
    },

    checksession: async (req, res, next) => {
        if (req.session.users) {
            return next();
        } else {
            return res.redirect("/");
        }
    },


}