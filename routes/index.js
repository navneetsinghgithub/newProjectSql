var express = require('express');
var router = express.Router();


const userController = require("../controller/userController")
const adminController = require("../controller/adminController")

//////////////////////////ADMIN CONTROLLER //////////////////
router.get("/dashboard", adminController.dashboard)
router.get("/loginPage", adminController.loginPage)
router.post("/loginPost", adminController.loginPost)
router.get("/adminProfilePage", adminController.adminProfilePage)
router.get("/getAdminProfile/:id", adminController.getAdminProfile)
router.get("/editProfile", adminController.editProfile)
router.post("/updateAdminProfile", adminController.updateAdminProfile)
router.get("/changePasswordPage", adminController.changePasswordPage)
router.post("/changePassword", adminController.changePassword)
router.get("/logout", adminController.logout)




///////////////////////// USER CONTROLLER ///////////////////////////
router.post("/signup", userController.signup)
router.get("/getUser", userController.getUser)
router.get("/userView/:id", userController.userView)



module.exports = router;
