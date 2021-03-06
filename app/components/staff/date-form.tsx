import { useRouter } from "next/router";
/*
 * @Script: date-form.tsx
 * @Author: Eamon Heffernan
 * @Email: eamonrheffernan@gmail.com
 * @Created At: 2021-07-27 01:20:44
 * @Last Modified By: Eamon Heffernan
 * @Last Modified At: 2021-08-01 18:33:19
 * @Description: Form for submitting dates.
 */

import { useState } from "react";

import { parseDateString, request } from "../../pages/_app";
import styles from "../../styles/form-page.module.css";
import FormLayout from "../forms/form-layout";

export default function DateForm({ children, pageName }) {
	const [dayComplete, setDayComplete] = useState(false);
	const [date, setDate] = useState("");
	const [start, setStart] = useState("");
	const [end, setEnd] = useState("");
	const [breaks, setBreaks] = useState([]);

	const router = useRouter();

	const setCurrentBreak = (key, value) => {
		const breaksCopy = [...breaks];
		breaksCopy[breaksCopy.length - 1][key] = value;
		setBreaks(breaksCopy);
	};
	/**
	 * Save day to state and ask if the user
	 * would like to add a break.
	 */
	const submitDay = (event) => {
		try {
			event.preventDefault();
			if (confirm("Would you like to add a break?")) {
				setDayComplete(true);
				setBreaks([{}]);
			} else {
				post(event);
			}
			if (start === "" || end === "") {
				setDayComplete(false);
				alert("An error occurred while saving your dates, please try again.");
			}
		} catch (error) {
			setDayComplete(false);
			console.error(error);
		}
	};

	/**
	 * Save break and ask the user if they
	 * would like another break.
	 */
	const submitBreak = (event) => {
		event.preventDefault();
		if (confirm("Would you like to add another break?")) {
			event.currentTarget.reset();
			setBreaks([...breaks, {}]);
		} else {
			post(event);
		}
	};

	/**
	 * Post to the submit day endpoint with state.
	 */
	const post = async (event) => {
		try {
			event.preventDefault();
			const res = await request("/api/staff/submitDay", "POST", {
				day: {
					start: parseDateString(date, start),
					end: parseDateString(date, end),
					breaks,
				},
			});

			const result = await res.json();

			alert(result.message);
			if (res.ok) {
				request("/api/users/signOut", "POST");
				router.push("/");
			} else {
				router.reload();
			}
		} catch (err) {
			console.error(err);
			alert("Unknown error occurred");
			router.reload();
		}
	};

	return (
		<>
			{!dayComplete && (
				<FormLayout
					pageName={pageName}
					onSubmit={submitDay}
					bottomBox={children}
				>
					<div className={styles["input"]}>
						<label htmlFor='date' className={styles["input-label"]}>
							Date:{" "}
						</label>
						<input
							onInput={(e) => setDate(e.currentTarget.value)}
							type='date'
							required
							className={styles["input-field"]}
						/>
					</div>
					<div className={styles["input"]}>
						<label htmlFor='start' className={styles["input-label"]}>
							Start:{" "}
						</label>
						<input
							onChange={(e) => setStart(e.currentTarget.value)}
							type='time'
							required
							className={styles["input-field"]}
						/>
					</div>
					<div className={styles["input"]}>
						<label htmlFor='end' className={styles["input-label"]}>
							End:{" "}
						</label>
						<input
							onInput={(e) => setEnd(e.currentTarget.value)}
							type='time'
							required
							className={styles["input-field"]}
						/>
					</div>
				</FormLayout>
			)}
			{dayComplete && (
				<FormLayout
					pageName={pageName}
					onSubmit={submitBreak}
					bottomBox={children}
				>
					<div className={styles["input"]}>
						<label htmlFor='start' className={styles["input-label"]}>
							Start:{" "}
						</label>
						<input
							onChange={(e) =>
								setCurrentBreak(
									"start",
									parseDateString(date, e.currentTarget.value)
								)
							}
							type='time'
							required
							className={styles["input-field"]}
						/>
					</div>
					<div className={styles["input"]}>
						<label htmlFor='end' className={styles["input-label"]}>
							End:{" "}
						</label>
						<input
							onInput={(e) =>
								setCurrentBreak(
									"end",
									parseDateString(date, e.currentTarget.value)
								)
							}
							type='time'
							required
							className={styles["input-field"]}
						/>
					</div>
				</FormLayout>
			)}
		</>
	);
}
