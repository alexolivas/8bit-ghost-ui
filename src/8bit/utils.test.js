import React from "react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { getErrorMessage } from "./utils";

describe("Test getErrorMessage utility function", () => {
	it("should return the same message if returns a string", () => {
		const errorResponse = "A string returns a string";
		expect(getErrorMessage(errorResponse)).toEqual(errorResponse);
	});

	const cases = [
		[300, "message", "This is a 300 response"],
		[400, "message", "The request is invalid"],
		[500, "message", "The server was unable to handle this request"],
		[300, "details", "This is a 300 response"],
		[400, "details", "The request is invalid"],
		[500, "details", "The server was unable to handle this request"],
	];
	it.each(cases)("should extract error from %p response at %p key", (statusCode, responseKey, expectedResponse) => {
		const mock = new MockAdapter(axios);
		mock.onGet("/some-endpoint/").reply(statusCode, {
			[responseKey]: expectedResponse,
		});
		axios.get("/some-endpoint/")
			.then(() => {
				fail("Test should never go in this block");
			})
			.catch((error) => {
				expect(getErrorMessage(error)).toEqual(expectedResponse);
			});
	});
	it("should extract error from response not using 'details' or 'message'", () => {
		const mock = new MockAdapter(axios);
		mock.onGet("/some-endpoint/").reply(404, {
			"unknownKey": "Some kind of error",
		});
		axios.get("/some-endpoint/")
			.then(() => {
				fail("Test should never go in this block");
			})
			.catch((error) => {
				// Since this key is unknown to the bluvector platform, return the
				// default error message
				const errorResponse = "An unknown server error has occurred.";
				expect(getErrorMessage(error)).toEqual(errorResponse);
			});
	});
	it("should extract error from network timeout", () => {
		const mock = new MockAdapter(axios);
		mock.onGet("/some-endpoint/").timeout();
		axios.get("/some-endpoint/")
			.then(() => {
				fail("Test should never go in this block");
			})
			.catch((error) => {
				const errorResponse = "An unknown server error has occurred.";
				expect(getErrorMessage(error)).toEqual(errorResponse);
			});
	});
	it("should extract error from network error", () => {
		const mock = new MockAdapter(axios);
		mock.onGet("/some-endpoint/").networkError();
		axios.get("/some-endpoint/")
			.then(() => {
				fail("Test should never go in this block");
			})
			.catch((error) => {
				const errorResponse = "An unknown server error has occurred.";
				expect(getErrorMessage(error)).toEqual(errorResponse);
			});
	});
});
