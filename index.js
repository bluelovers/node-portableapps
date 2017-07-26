/**
 * Created by user on 2017/7/26/026.
 */

'use strict';

const cli = require('meow')();

const build = require('./src/build');

let data = build.config({
	name: cli.input[0] || 'App-Name-Test',
});

let options = {
	target_dir: '.',
};

build.build(options, data);

//build.build();
