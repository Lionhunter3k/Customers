require.config({
    baseUrl: '/v1/Scripts'
});
require(['require-config'], function () {
	require(['app', 'promise_done_polyfill'], function (appCtor) {
        new appCtor.default('#wrapper');
    });
});