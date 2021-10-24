import $ from 'jquery';
import can from '../can.full';
import postal from 'postal';

let channel = postal.channel("ajax");

export default function (ajaxOptions) {
	let $ajaxPromise = $.ajax(ajaxOptions);
	let resultPromise = can.Deferred();
	$ajaxPromise
		.done(can.proxy(resultPromise.resolve, resultPromise))
		.fail(function (error) {
			try {
				let errorResponse = JSON.parse(error.responseText);
				let errorModel = { errorStatus: error.status, error: errorResponse };
				resultPromise.reject(errorModel);
			}
			catch (e) {
				if (error.responseText !== undefined && error.responseText !== null) {
					let errorModel = { errorStatus: error.status, error: error.responseText };
					resultPromise.reject(errorModel);
				}
				else {
					let errorModel = { errorStatus: error.status };
					resultPromise.reject(errorModel);
				}
			}
		});
	return resultPromise.promise().fail(function (error) {
		channel.publish("http.error." + error.errorStatus, {
			ajaxOptions: ajaxOptions,
			error: error
		});
	});
}
