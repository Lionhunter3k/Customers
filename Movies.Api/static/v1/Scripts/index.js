require.config({
    baseUrl: '/v1/Scripts'
});
require(['require-config'], function () {
    require(['app'], function (appCtor) {
        new appCtor.default('#wrapper');
    });
});