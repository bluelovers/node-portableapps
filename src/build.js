/**
 * Created by user on 2017/7/27/027.
 */

'use strict';

const ejs = require('ejs');
const Promise = require("bluebird");
const { fs, winattr } = require('./fs');
const globby = require('globby');
const path = require('path');
const filter = require('./filter');

const upperCamelCase = require('./uppercamelcase');

module.exports.config = function (input = {}, extend = {})
{
	return require('./config').config(input, extend);
};

module.exports.options = function (options = {}, data = {})
{
	options = Object.assign({

		tpl_name: 'default',

		cwd: null,
		cwd_base: path.join(__dirname, '..'),

		source_dir: null,
		target_dir: null,

		target_dir_base: 'test/temp',
		source_dir_base: 'tpl',

	}, filter.object(options));

	let out = upperCamelCase((data.app.name_id || options.tpl_name) + 'Portable');

	if (!options.cwd)
	{
		options.cwd = process.cwd();
	}

	if (!options.source_dir)
	{
		options.source_dir = path.join(options.source_dir_base, options.tpl_name);
	}

	if (!fs.existsSync(options.source_dir))
	{
		options.source_dir = path.join(options.cwd_base, options.source_dir);
	}

	if (options.cwd.indexOf(options.cwd_base) != -1 || options.cwd.indexOf(path.join(__dirname, '..')) != -1)
	{
		options.cwd = options.cwd_base;
	}

	if (options.target_dir)
	{
		if (!path.isAbsolute(options.target_dir))
		{
			options.target_dir = path.join(options.cwd, options.target_dir);
		}

		if (options.target_dir.indexOf(options.cwd_base) != -1 || options.target_dir.indexOf(path.join(__dirname, '..')) != -1)
		{
			options.target_dir = null;
		}

		//console.log(options.target_dir);
	}

	if (!options.target_dir)
	{
		options.target_dir = path.join(options.target_dir_base);
	}

	if (!fs.existsSync(options.target_dir))
	{
		options.target_dir = path.join(options.cwd_base, options.target_dir);
	}

	options.target_dir = path.join(options.target_dir, out);

	return options;
};

module.exports.build = async (options, data) =>
{
	console.time(data.pkg.name);

	data = module.exports.config(options.app, data);
	options = module.exports.options(options, data);

	console.log(options);
	console.log(data);

	let source_dir = options.source_dir;
	let target_dir = options.target_dir;

	let source = path.join(source_dir);
	let target = path.join(target_dir);

	console.log([source, target, process.cwd()]);

	if (fs.existsSync(target))
	{
		throw `target already exists`;
	}

	console.log('start...');

	return await globby(['**'], {
		cwd: source,
	})
		.then(async (ls) =>
		{
			if (!ls.length)
			{
				console.error('error');
				throw new Error();

				return 1;
			}

			//await fs.emptyDir(target);
			//console.warn(`[clear] ${target}`);

			let fs_options = {
				preserveTimestamps: true,
			};

			for (let filename of ls)
			{
				let file_src = path.join(source, filename);

				let stat = await fs.stat(file_src);
				let attr = await winattr.get(file_src);

				let file = path.join(target, filename);

				let ext = filename.split('.').pop();

				await fs.copy(file_src, file, fs_options);

				if (stat.isFile())
				{
					let basename = path.basename(filename);
					let basename_new = `${data.app.name_id}Portable.ini`;

					if (basename == 'AppNamePortable.ini' && basename != basename_new)
					{
						let file_new = path.join(target, path.dirname(filename), basename_new);
						//console.log([basename, basename_new, file]);

						await fs.move(file, file_new, fs_options);
						console.info(`[rename] ${file} => ${file_new}`);

						file = file_new;
					}

					if (['ini', 'html', 'htm', 'txt'].includes(ext))
					{
						let tpl = await fs.readFile(file_src);

						let tpl_render = ejs.render(tpl.toString(), data, {});

						if (tpl != tpl_render)
						{
							console.info(`[render] ${file}`);

							//console.log(777, tpl)
							//console.log(888, tpl_render);

							await fs.writeFile(file, tpl_render);
						}
					}
				}

				let basename = path.basename(file);

				if (basename.match(/^ShedkoFolderico.+\.ico$/) || basename == 'desktop.ini')
				{
					attr.hidden = true;
					attr.system = true;
				}

				await winattr.set(file, attr);
			}

			console.log(`end.`);
			console.timeEnd(data.pkg.name);

			return 0;
		})
		.catch((e) =>
		{
			console.error(e);
			console.timeEnd(data.pkg.name);
		})
	;
};
