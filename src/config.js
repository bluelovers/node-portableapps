/**
 * Created by user on 2017/7/26/026.
 */

'use strict';

const upperCamelCase = require('./uppercamelcase');
const filter = require('./filter');

module.exports.config = function (input = {}, extend = {})
{
	let data = {
		pkg: require('../package.json'),
		pa: require('./portableapps/format'),
	};

	Object.assign(data, extend);

	data.app = Object.assign({
		name: 'App-Name',
		name_id: undefined,

		version: '3.5.0.0',
		version_name: '3.5 Development Test 1',
	}, data.app, filter.object(input));

	data.app.description = data.app.description || `${data.app.name} is a ___`;
	data.app.name_id = upperCamelCase(data.app.name_id || data.app.name);
	data.app.exe = data.app.exe || data.app.name_id + '.exe';
	data.app.exe64 = data.app.exe64 || data.app.name_id + '64.exe';
	data.app.dir = data.app.dir || 'bin' || data.app.name_id;

	data.app.home = data.app.home || `PortableApps.com/${data.app.name_id}Portable`;
	data.app.site = data.app.site || data.app.home;

	data.app.donate = data.app.donate || 'portableapps.com/donate';

	return data;
};

