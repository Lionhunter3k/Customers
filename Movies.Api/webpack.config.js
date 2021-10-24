const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = function (env) {

	env = env || {};
	const isProd = env.NODE_ENV === 'production';

	const contentConfig = {
		mode: env.NODE_ENV || 'development',
		entry: {
			'styles': [
				path.resolve("./static/v1/DevContent/app.less"),
				path.resolve("./static/v1/DevContent/loading.less")
			]
		},
		output: {
			path: path.join(__dirname, '/static/v1/DistContent/'),
			publicPath: '/v1/DistContent',
			filename: isProd ? '[name].[hash:6].min.css' : '[name].css'
		},
		devtool: 'eval-source-map',
		resolve: {
			alias: {},
			modules: [],
			extensions: ['.css', '.less']
		},
		plugins: [
			// Copy css/images file(s) to dist
			//new CopyWebpackPlugin([{
			//	from: basePath + 'src/images',
			//	to: basePath + 'dist/images/'
			//}]),
			// Bundling of entry files
			//new ExtractTextPlugin(env === 'build' ? '[name].[hash:6].min.css' : '[name].css'),
			//new HtmlWebpackPlugin({
			//	template: isProd ? path.join(__dirname, '/static/v1/index.webpack.html') : path.join(__dirname, '/static/v1/index.debug.webpack.html')
			//})
		],
		module: {
			rules: [
				{
					test: /\.(css|less)$/, use: [{
						loader: 'file-loader',
						options: {
							name: isProd ? '[name].min.css' : '[name].css',
						},
					}, "extract-loader", 'css-loader', 'less-loader']
				},
				{ test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' },
				{ test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' },
				//{
				//	test: /\.(css|less)$/,
				//	use: ExtractTextPlugin.extract({
				//		use: [
				//			{
				//				loader: 'css-loader',
				//				options: {
				//					// ExtractTextPlugin tries to process url like in backgroun-image, url(), etc. We need to stop that behavior so we need this option
				//					url: false
				//				}
				//			},
				//			{
				//				loader: 'less-loader',
				//				options: {
				//					sourceMap: true
				//				}
				//			}]
				//	})
				//}
			]
		}
	};

	// Alter config for prod environment
	if (isProd) {
		contentConfig.devtool = 'source-map';
		contentConfig.plugins = contentConfig.plugins.concat([
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify('production')
				},
			}),
			new ManifestPlugin({
				fileName: path.join(__dirname, '/static/v1/DistContent/manifest.json')
			}),
			new OptimizeCSSAssetsPlugin({
				cssProcessorOptions: {
					safe: true
				}
			})
		]);
		//contentConfig.optimization = {
		//	minimizer: [
		//		new OptimizeCSSAssetsPlugin({})
		//	]
		//}
	}

	const scriptsConfig = {
		mode: env.NODE_ENV || 'development',
		entry: "./static/v1/DevScripts/index.es6.js",//["babel-polyfill","./static/v1/DevScripts/index.es6.js"],
		output: {
			path: path.join(__dirname, '/static/v1/DistScripts/'),
			publicPath: '/v1/DistScripts',
			filename: isProd ? '[name].[hash:6].min.js' : '[name].js'
		},
		devtool: 'eval-source-map',
		resolve: {
			//modules: ['static/v1/DevScripts', 'node_modules'],
			extensions: ['.js', '.es6.js'],
			alias: {
				//'select2': basePath + 'node_modules/select2/dist/js/select2.full.min',
				enumerable: './static/v1/DevScripts/linq',
				//babel_polyfill: 'polyfill',
				//promise_done_polyfill: 'promises-done-polyfill',
				//lodash: "lodash/lodash",
				can$: "can/dist/cjs/can",
				//jquery: "jquery/dist/jquery",
				'jquery': path.join(__dirname, '/node_modules/jquery/dist/jquery.js'),
				//stache: "stache",
				//text: "text/text",
				//bootstrap: "bootstrap/dist/js/bootstrap",
				//underscore: 'underscore/underscore',
				//moment: "moment/moment",
				parsleyjs: "parsleyjs/src/parsley",
				//postal: "postal.js/lib/postal",
				bootpag: 'bootpag/lib/jquery.bootpag',
				//postal: "postal.js/lib/postal"
			}
		},
		plugins: [
			//new webpack.optimize.SideEffectsFlagPlugin()
			//new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
			//OR
			//new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
			//new webpack.optimize.UglifyJsPlugin({minimize: true})//by default, already registered
			new webpack.ProvidePlugin({// '$' and 'jQuery' can be used without being referenced
				$: "jquery",
				jQuery: "jquery",
				'window.jQuery': 'jquery' // <------------------ added this
			})
		],
		//target: ['web', 'es5'],
		module: {
			rules: [
				{
					test: /babel-polyfill/,
					sideEffects: true,
				},
				{
					test: /\.(js|es6.js)$/,
					exclude: /node_modules/,
					use: [
						{
							loader: "babel-loader",
							options: {
								presets: [['es2015', { modules: false }], "es2016", "es2017"],
								plugins: [require('./property-babel')],
								sourceMaps: true
							},
						}
					]
				},
				{
					test: /\.stache$/,
					exclude: /node_modules/,
					loader: "can-stache-loader"
				},
				//{
				//	test: /babel/,
				//	use: ['imports-loader?@babel/polyfill']
				//},
				//{ test: /babel/, loader: 'imports?@babel/polyfill' },
				//{ test: /bootpag/, loader: 'imports-loader?jquery' },
				{
					test: /bootpag/,
					loader: "imports-loader",
					options: {
						imports: [
							"default jquery jQuery",
							//"named can Map",
							//"named can can_bubble Bubble",
							//"namespace can can_full",
							//"side-effects bootstrap",
							//{
							//	syntax: "default",
							//	moduleName: "jquery",
							//	name: "$",
							//},
						],
					}
				},
				{
					test: /bootstrap/,
					loader: "imports-loader",
					options: {
						imports: [
							"default jquery jQuery",
							//"named can Map",
							//"named can can_bubble Bubble",
							//"namespace can can_full",
							//"side-effects bootstrap",
							//{
							//	syntax: "default",
							//	moduleName: "jquery",
							//	name: "$",
							//},
						],
					}
				},
				{
					test: /enumerable/,
					use: [
						{
							loader: "imports-loader",
							options: {
								imports: [
									"default jquery $"
								],
							}
						},
						{
							loader: "exports-loader",
							options: {
								//type: "commonjs", //default is 'module'
								exports: [
									{
										syntax: "default",
										name: "Enumerable",
									},
									//{ syntax: "named", name: "jquery", alias: "$" },
									//{ syntax: "named", name: "jquery" },
									//"Enumerable",
									//"named jquery $",
									//"single Enumerable",//only for type: 'commonjs'
									//"multiple jquery $", //only for type: 'commonjs'
									//"multiple jquery jQuery", //only for type: 'commonjs'
								]
							}
						}
					]
				},
				//{
				//	test: /jquery/,
				//	loader: "expose-loader",// sets on the global this the '$' and 'jQuery' fields, must be required or ProvidePlugin'ed
				//	options: {
				//		exposes: ["$", "jQuery"],
				//	},
				//},
				//{
				//	test: /underscore/,
				//	loader: "expose-loader",
				//	options: {
				//		exposes: [
				//			"_.map|map",
				//			{
				//				globalName: "_.reduce",
				//				moduleLocalName: "reduce",
				//			},
				//			{
				//				globalName: ["_", "filter"],
				//				moduleLocalName: "filter",
				//			},
				//		],
				//	},
				//},
				//{ test: /underscore/, use: ['exports-loader?_', 'imports-loader?jquery'] },
				//{
				//	test: /underscore/,
				//	use: [
				//		{
				//			loader: "imports-loader",
				//			options: {
				//				imports: [
				//					"default jquery $"
				//				],
				//			}
				//		},
				//		{
				//			loader: "exports-loader",
				//			options: {
				//				//type: "commonjs", //default is 'module'
				//				exports: [
				//					{
				//						syntax: "default",
				//						name: "_",
				//					},
				//					//{ syntax: "named", name: "jquery", alias: "$" },
				//					//{ syntax: "named", name: "jquery" },
				//					//"Enumerable",
				//					//"named jquery $",
				//					//"single Enumerable",//only for type: 'commonjs'
				//					//"multiple jquery $", //only for type: 'commonjs'
				//					//"multiple jquery jQuery", //only for type: 'commonjs'
				//				]
				//			}
				//		}
				//	]
				//},
				//{
				//	test: require.resolve('./node_modules/parsleyjs/dist/parsley.js'),
				//	use: [
				//		{
				//			loader: "imports-loader",
				//			options: {
				//				imports: [
				//					"default jquery $"
				//				],
				//			}
				//		},
				//		{
				//			loader: "exports-loader",
				//			options: {
				//				//type: "commonjs", //default is 'module'
				//				exports: [
				//					{
				//						syntax: "default",
				//						name: "parsley",
				//					},
				//					//{ syntax: "named", name: "jquery", alias: "$" },
				//					//{ syntax: "named", name: "jquery" },
				//					//"Enumerable",
				//					//"named jquery $",
				//					//"single Enumerable",//only for type: 'commonjs'
				//					//"multiple jquery $", //only for type: 'commonjs'
				//					//"multiple jquery jQuery", //only for type: 'commonjs'
				//				]
				//			}
				//		}
				//	]
				//},
				//{ test: /jquery/, loader: 'expose-loader?$' },
				//{ test: /select2/, loader: 'expose-loader?select2!imports-loader?jQuery' },
			],
			//loaders: [ //obsolote, became 'rules'
			//	{ test: /babel/, loader: 'imports?@babel/polyfill' },
			//	{ test: /bootpag/, loader: 'imports?jquery' },
			//	{ test: /bootstrap/, loader: 'imports?jquery' },
			//	{ test: /enumerable/, loader: 'imports?jquery' },
			//	{ test: /underscore/, loader: 'exports?_!imports?jquery' }
			//]
		}
	}

	// Alter config for prod environment
	if (isProd) {
		scriptsConfig.devtool = 'source-map';
		scriptsConfig.plugins = scriptsConfig.plugins.concat([
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify('production')
				},
			}),
			// File to generated to read hash later on
			new ManifestPlugin({
				fileName: path.join(__dirname, '/static/v1/DistScripts/manifest.json')
			}),
		]);
		scriptsConfig.optimization = {
			minimizer: [
				new UglifyJsPlugin({
					sourceMap: true,
					//cache: true,
					//parallel: true,
					//uglifyOptions: {
					//	safari10: true,
					//	output: {
					//		ascii_only: true,
					//		comments: false,
					//		webkit: true,
					//	},
					//	compress: {
					//		pure_getters: true,
					//		passes: 3,
					//		inline: 3,
					//	}
					//}
				})
			]
		}
	}

	return [
		contentConfig,
		scriptsConfig
	];
};