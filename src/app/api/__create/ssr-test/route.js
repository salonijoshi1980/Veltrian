import { getToken } from '@auth/core/jwt';
import React from 'react';
import path from 'node:path';
import { renderToString } from 'react-dom/server';
import routes from '../../../routes';
import { serializeError } from 'serialize-error';
import cleanStack from 'clean-stack';

function serializeClean(err) {
	// if we want to clean this more, maybe we should look at the file where it
	// is imported and above.
	err.stack = cleanStack(err.stack, {
		pathFilter: (path) => {
			// Filter out paths that are not relevant to the error
			return (
				!path.includes('node_modules') &&
				!path.includes('dist') &&
				!path.includes('__create')
			);
		},
	});

	return serializeError(err);
}
const getHTMLOrError = (component) => {
	try {
		const html = renderToString(React.createElement(component, {}));
		return { html, error: null };
	} catch (error) {
		return { html: null, error: serializeClean(error) };
	}
};
export async function GET(request) {
	const results = await Promise.allSettled(
		routes.map(async (route) => {
			let component = null;
			try {
				const response = await import(
					/* @vite-ignore */ path.join('../../../', route.file)
				);
				component = response.default;
			} catch (error) {
				console.debug('Error importing component:', route.file, error);
			}
			if (!component) {
				return null;
			}
			const rendered = getHTMLOrError(component);
			return {
				route: route.file,
				path: route.path,
				...getHTMLOrError(component),
			};
		})
	);
	const cleanedResults = results
		.filter((result) => result.status === 'fulfilled')
		.map((result) => {
			if (result.status === 'fulfilled') {
				return result.value;
			}
			return null;
		})
		.filter((result) => result !== null);
	return Response.json({ results: cleanedResults });
}
