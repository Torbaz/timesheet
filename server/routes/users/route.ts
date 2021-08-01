/*
 * @Script: route.ts
 * @Author: Eamon Heffernan
 * @Email: eamonrheffernan@gmail.com
 * @Created At: 2021-06-16 12:44:09
 * @Last Modified By: Eamon Heffernan
 * @Last Modified At: 2021-08-01 13:54:20
 * @Description: Handles the route for /api/users.
 */

import express from "express";

import { DataType, validateInput } from "../../dataValidation/validateInput";
import { clearSessionKey, saveSessionKey } from "./cookieHandler";
import { authenticate } from "./middleware";
import { AllowedGroups, forgotPassword, resetPassword, signIn, signOut, signUp } from "./userHandler";

const router = express.Router();

module.exports = router;

router.get("/", authenticate(AllowedGroups.Both), async (req, res) => {
	return res.returnCode(200, "", { admin: res.locals.user.admin });
});

router.post(
	"/signUp",
	authenticate(AllowedGroups.Admin),
	validateInput([
		{ name: "email", level: "Format", format: "Name" },
		{ name: "name", level: "Format", format: "Name" },
		{ name: "dob", level: "Reasonability", validDataType: "DateOfBirth" },
	]),
	async (req, res) => {
		const response = await signUp(req.body.name, req.body.email, req.body.dob);
		if ("user" in response) {
			return res.returnCode(200, "User created", response.user.sendableUser());
		} else if ("error" in response) {
			return res.returnCode(400, response.error);
		}
		throw "An unknown error has occurred";
	}
);

router.post(
	"/signIn",
	validateInput([
		{ name: "email", level: "Format", format: "Email" },
		{ name: "password", level: "Type", dataType: DataType.String },
	]),
	async (req, res) => {
		// Validate existence and type here
		const response = await signIn(req.body.email, req.body.password);
		if ("user" in response) {
			saveSessionKey(res, response.sessionKey);
			return res.returnCode(200, "Signed in", response.user.sendableUser());
		} else if ("error" in response) {
			return res.returnCode(400, response.error);
		}
		throw "An unknown error has occurred";
	}
);

router.post(
	"/forgotPassword",
	validateInput([{ name: "email", level: "Format", format: "Email" }]),
	async (req, res) => {
		if (await forgotPassword(req.body.email)) {
			return res.returnCode(200, "Email sent.");
		}
		return res.returnCode(400, "Email not found");
	}
);

router.post(
	"/resetPassword",
	validateInput([
		{ name: "key", level: "Type", dataType: DataType.String },
		{ name: "password", level: "Format", format: "Password" },
	]),
	async (req, res) => {
		if (await resetPassword(req.body.key, req.body.password)) {
			return res.returnCode(200, "Password set.");
		}
		return res.returnCode(400, "Key not found or expired");
	}
);

router.post("/signOut", authenticate(AllowedGroups.Both), (req, res) => {
	signOut(res.locals.user);
	clearSessionKey(res);
	return res.returnCode(200, "Signed out.");
});
