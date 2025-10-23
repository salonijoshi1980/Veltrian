/**
 * WARNING: This file connects this app to Create's internal auth system. Do
 * not attempt to edit it. Do not import @auth/create or @auth/create
 * anywhere else or it may break. This is an internal package.
 */
import CreateAuth from '@auth/create';
import Credentials from '@auth/core/providers/credentials';

const result = CreateAuth({
	providers: [
		Credentials({
			credentials: {
				email: {
					label: 'Email',
					type: 'email',
				},
				password: {
					label: 'Password',
					type: 'password',
				},
			},
		}),
	],
	pages: {
		signIn: '/account/signin',
		signOut: '/account/logout',
	},
});
export const { auth } = result;
