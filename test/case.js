/**
 * Created by user on 2017/7/27/027.
 */

'use strict';

const upperCamelCase = require('uppercamelcase');
const upperCamelCase2 = require('../src/uppercamelcase');

[
	'a-a a',
	'a-A a',
].forEach((v) =>
{
	let a = upperCamelCase(v);
	let a2 = upperCamelCase2(v);

	console.log('upperCamelCase', v, a, upperCamelCase(a));
	console.log('upperCamelCase2', v, a2, upperCamelCase2(a2));
})

