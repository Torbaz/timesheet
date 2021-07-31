import path from "path";

import "../styles/global.css";

export const fetcher = (url) =>
	fetch(url, { credentials: "include" }).then((res) => res.json());

export default function App({ Component, pageProps }) {
	return <Component {...pageProps} />;
}

export const request = async (
	url: string,
	method: string,
	body: object = undefined,
	headers: HeadersInit = {}
) => {
	const postHeaders = {
		"Content-Type": "application/json",
	};
	headers = {
		...(method === "POST" ? postHeaders : {}),
		...headers,
	};

	return fetch(url, {
		method,
		headers,
		body: body !== undefined ? JSON.stringify(body) : undefined,
		credentials: "same-origin",
	});
};

export const parseCookies = (input) => {
	let returnString = "";
	for (let key in input) {
		if (returnString !== "") {
			returnString += "; ";
		}
		returnString += `${key}=${input[key]}`;
	}
	return returnString;
};
