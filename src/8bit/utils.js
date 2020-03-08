/**
 * This function is responsible for extracting the error message from
 * an XMLHttpRequest object.
 * @param {object XMLHttpRequest} error 
 */
export function getErrorMessage(error) {
	let err = "An unknown server error has occurred.";
	if ( typeof(error) === "object" ) {
		if ( error.response ) {
			const errResponse = error.response;
			if ( errResponse.data ) {
				const errData = errResponse.data;
				if ( errData.details ) {
					err = errData.details;
				} else if ( errData.message ) {
					err = errData.message;
				}
			} else {
				// NOTE: this line isn't covered by the unit tests since this
				// can't be mocked: https://github.com/ctimmerm/axios-mock-adapter/issues/151
				err = errResponse.statusText;
			}
		}
	} else {
		err = error;
	}
	return err;
}