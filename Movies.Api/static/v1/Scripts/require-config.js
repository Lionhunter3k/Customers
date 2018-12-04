require.config({
    es6: {
        fileExtension: '.js' // put in .jsx for JSX transformation
    },
    babel: {
        presets: ["es2017"],
        plugins: ['transform-es2015-modules-amd']
    },
    // For the shorter plugin prefix (e.g. `mustache!file.mustache`).
    paths: {
        enumerable: 'linq',
        es6: 'requirejs-babel-plugin/es6',
        babel: 'babel-standalone/babel',
        babel_polyfill: 'polyfill',
        promise_done_polyfill: 'promises-done-polyfill',
        lodash: "lodash/lodash",
        can: "canjs/amd/can",
        jquery: "jquery/dist/jquery",
        stache: "stache",
        text: "text/text",
        bootstrap: "bootstrap/dist/js/bootstrap",
        underscore: 'underscore/underscore',
        moment: "moment/moment",
        parsley: "parsleyjs/dist/parsley",
        postal: "postal.js/lib/postal",
        bootpag: 'bootpag/lib/jquery.bootpag'
    },
    // So that the template library is included in the build. You don't need
    // this if you explicitly load the template library elsewhere in your app.
    shim: {
        babel: {
            deps: ['babel_polyfill', 'promise_done_polyfill']
        },
        stache: ["can"],
        bootpag: ["jquery"],
        bootstrap: ["jquery"],
        enumerable: {
            deps: ['jquery'],
            exports: 'Enumerable'
        },
        underscore: {
            exports: '_',
            deps: ['jquery']
        }
    }
});
