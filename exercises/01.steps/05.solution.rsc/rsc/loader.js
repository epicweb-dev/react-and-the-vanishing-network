import {
	resolve as reactResolve,
	load as reactLoad,
} from 'react-server-dom-esm/node-loader'

async function textLoad(url, context, defaultLoad) {
	const result = await defaultLoad(url, context, defaultLoad)
	if (result.format === 'module') {
		if (typeof result.source === 'string') {
			return result
		}
		return {
			source: Buffer.from(result.source).toString('utf8'),
			format: 'module',
		}
	}
	return result
}

export async function load(url, context, defaultLoad) {
	const result = await reactLoad(url, context, (u, c) => {
		return textLoad(u, c, defaultLoad)
	})
	return result
}

export async function resolve(specifier, context, defaultResolve) {
	const { conditions = [] } = context
	const newContext = {
		...context,
		conditions: ['react-server', ...conditions],
	}

	return reactResolve(specifier, newContext, defaultResolve)
}
