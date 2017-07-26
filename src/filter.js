/**
 * Created by user on 2017/7/27/027.
 */

'use strict';

module.exports.object = function (obj)
{
	return Object.keys(obj).reduce((a, b) =>
	{
		if (typeof obj[b] != 'undefined')
		{
			a[b] = obj[b];
		}

		return a;
	}, {});
};

module.exports.array = function (obj)
{
	return obj.filter((b) =>
	{
		return (typeof b != 'undefined');
	});
};

module.exports.auto = function (obj)
{
	if (Array.isArray(obj))
	{
		return module.exports.array(obj);
	}
	else if (typeof obj == 'object')
	{
		return module.exports.object(obj);
	}

	return obj;
};
