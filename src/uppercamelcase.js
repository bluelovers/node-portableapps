/**
 * Created by user on 2017/7/27/027.
 */

'use strict';

module.exports = function upperCamelCase(...argv)
{
	return argv.join('-')
		.replace(/(?:^|[\-\s]+)([a-z0-9])/ugi, function (...argv)
		{
			//console.log(argv);

			return argv[1].toUpperCase();
		})
		;
};
