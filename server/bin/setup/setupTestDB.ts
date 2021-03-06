/*
 * @Script: setupTestDB.ts
 * @Author: Eamon Heffernan
 * @Email: eamonrheffernan@gmail.com
 * @Created At: 2021-08-01 09:11:31
 * @Last Modified By: Eamon Heffernan
 * @Last Modified At: 2021-08-01 18:13:39
 * @Description: Sets up the database with test users.
 */

import logger from "../../logger";
import { initMongoConnection } from "../../model/db";
import { IUser, User } from "../../model/user";
import { hashString } from "../../routes/users/hasher";

const main = async () => {
	// Connect to mongo.
	await initMongoConnection();

	// Create 4 users.
	// Information sourced from https://www.fakenamegenerator.com/gen-random-au-au.php

	const admin: IUser = new User();
	admin.email = "seantregurtha@teleworm.us";
	admin.name = "Sean Tregurtha";
	admin.dob = new Date("1960-08-29Z");
	admin.hash = hashString("ooChieB4Egh");
	admin.admin = true;
	admin.accountCreated = true;
	admin.days = [];
	logger("Added Admin to the database");

	const user1: IUser = new User();
	user1.email = "gabriellecaron@rhyta.com";
	user1.name = "Gabrielle Caron";
	user1.dob = new Date("1947-06-24Z");
	user1.hash = hashString("deiPh0piqu");
	user1.admin = false;
	user1.accountCreated = true;
	user1.days = [];
	logger("Added User1 to the database");

	const user2: IUser = new User();
	user2.email = "georgiatonkin@jourrapide.com";
	user2.name = "Georgia Tonkin";
	user2.dob = new Date("1983-02-22Z");
	user2.hash = hashString("pa0Ei6iejah");
	user2.admin = false;
	user2.accountCreated = true;
	user2.days = [];
	logger("Added User2 to the database");

	const user3: IUser = new User();
	user3.email = "laylapryor@jourrapide.com";
	user3.name = "Layla Pryor";
	user3.dob = new Date("1948-07-02Z");
	user3.hash = hashString("pu1aet0Xei");
	user3.admin = false;
	user3.accountCreated = true;
	user3.days = [];
	logger("Added User2 to the database");

	// Wait for all to save.
	await Promise.all([admin.save(), user1.save(), user2.save(), user3.save()]);
	logger("Saved database with test information.");
	// Stop the process.
	process.kill(process.pid, "SIGTERM");
};
main();
