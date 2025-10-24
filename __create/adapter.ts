import type {
	AdapterUser,
	VerificationToken,
	Adapter,
	AdapterSession,
} from '@auth/core/adapters';
import type { ProviderType } from '@auth/core/providers';
import type { Pool } from '@neondatabase/serverless';

interface NeonUser extends AdapterUser {
	accounts: {
		provider: string;
		provider_account_id: string;
		password?: string;
	}[];
}

interface NeonAdapter extends Adapter {
	createUser(data: AdapterUser): Promise<AdapterUser>;
	getUser(userId: string): Promise<AdapterUser | null>;
	getUserByEmail(email: string): Promise<NeonUser | null>;
	getUserByAccount(data: {
		provider: string;
		providerAccountId: string;
	}): Promise<AdapterUser | null>;
	linkAccount(data: {
		userId: string;
		provider: string;
		providerAccountId: string;
		type: ProviderType;
		access_token?: string | null;
		expires_at?: number | null;
		refresh_token?: string | null;
		id_token?: string | null;
		scope?: string | null;
		session_state?: string | null;
		token_type?: string | null;
		extraData?: Record<string, unknown>;
	}): Promise<void>;
}

export default function NeonAdapter(client: Pool): NeonAdapter {
	return {
		async createVerificationToken(
			verificationToken: VerificationToken
		): Promise<VerificationToken> {
			const { identifier, expires, token } = verificationToken;
			const sql = `
        INSERT INTO auth_verification_token ( identifier, expires, token )
        VALUES ($1, $2, $3)
        `;
			await client.query(sql, [identifier, expires, token]);
			return verificationToken;
		},
		async useVerificationToken({
			identifier,
			token,
		}: {
			identifier: string;
			token: string;
		}): Promise<VerificationToken | null> {
			const sql = `delete from auth_verification_token
      where identifier = $1 and token = $2
      RETURNING identifier, expires, token `;
			const result = await client.query(sql, [identifier, token]);
			return result.rowCount !== 0 ? result.rows[0] : null;
		},

		async createUser(user: Omit<AdapterUser, 'id'>) {
			const { name, email, emailVerified, image } = user;
			const sql = `
        INSERT INTO auth_users (name, email, "emailVerified", image)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, "emailVerified", image`;
			const result = await client.query(sql, [
				name,
				email,
				emailVerified,
				image,
			]);
			return result.rows[0];
		},
		async getUser(id: string) {
			const sql = 'select * from auth_users where id = $1';
			try {
				const result = await client.query(sql, [id]);
				return result.rowCount === 0 ? null : result.rows[0];
			} catch {
				return null;
			}
		},
		async getUserByEmail(email) {
			const sql = 'select * from auth_users where email = $1';
			const result = await client.query(sql, [email]);
			if (result.rowCount === 0) {
				return null;
			}
			const userData = result.rows[0];
			const accountsData = await client.query(
				'select * from auth_accounts where "providerAccountId" = $1',
				[userData.id]
			);
			return {
				...userData,
				accounts: accountsData.rows,
			};
		},
		async getUserByAccount({
			providerAccountId,
			provider,
		}): Promise<AdapterUser | null> {
			const sql = `
          select u.* from auth_users u join auth_accounts a on u.id = a."userId"
          where
          a.provider = $1
          and
          a."providerAccountId" = $2`;

			const result = await client.query(sql, [provider, providerAccountId]);
			return result.rowCount !== 0 ? result.rows[0] : null;
		},
		async updateUser(user: Partial<AdapterUser>): Promise<AdapterUser> {
			const fetchSql = 'select * from auth_users where id = $1';
			const query1 = await client.query(fetchSql, [user.id]);
			const oldUser = query1.rows[0];

			const newUser = {
				...oldUser,
				...user,
			};

			const { id, name, email, emailVerified, image } = newUser;
			const updateSql = `
        UPDATE auth_users set
        name = $2, email = $3, "emailVerified" = $4, image = $5
        where id = $1
        RETURNING name, id, email, "emailVerified", image
      `;
			const query2 = await client.query(updateSql, [
				id,
				name,
				email,
				emailVerified,
				image,
			]);
			return query2.rows[0];
		},
		async linkAccount(account) {
			const sql = `
      insert into auth_accounts
      (
        "userId",
        provider,
        type,
        "providerAccountId",
        access_token,
        expires_at,
        refresh_token,
        id_token,
        scope,
        session_state,
        token_type,
        password
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      returning
        id,
        "userId",
        provider,
        type,
        "providerAccountId",
        access_token,
        expires_at,
        refresh_token,
        id_token,
        scope,
        session_state,
        token_type,
        password
      `;

			const params = [
				account.userId,
				account.provider,
				account.type,
				account.providerAccountId,
				account.access_token,
				account.expires_at,
				account.refresh_token,
				account.id_token,
				account.scope,
				account.session_state,
				account.token_type,
				account.extraData?.password,
			];

			const result = await client.query(sql, params);
			return result.rows[0];
		},
		async createSession({ sessionToken, userId, expires }) {
			if (userId === undefined) {
				throw Error('userId is undef in createSession');
			}
			const sql = `insert into auth_sessions ("userId", expires, "sessionToken")
      values ($1, $2, $3)
      RETURNING id, "sessionToken", "userId", expires`;

			const result = await client.query(sql, [userId, expires, sessionToken]);
			return result.rows[0];
		},

		async getSessionAndUser(sessionToken: string | undefined): Promise<{
			session: AdapterSession;
			user: AdapterUser;
		} | null> {
			if (sessionToken === undefined) {
				return null;
			}
			const result1 = await client.query(
				`select * from auth_sessions where "sessionToken" = $1`,
				[sessionToken]
			);
			if (result1.rowCount === 0) {
				return null;
			}
			const session: AdapterSession = result1.rows[0];

			const result2 = await client.query(
				'select * from auth_users where id = $1',
				[session.userId]
			);
			if (result2.rowCount === 0) {
				return null;
			}
			const user = result2.rows[0];
			return {
				session,
				user,
			};
		},
		async updateSession(
			session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>
		): Promise<AdapterSession | null | undefined> {
			const { sessionToken } = session;
			const result1 = await client.query(
				`select * from auth_sessions where "sessionToken" = $1`,
				[sessionToken]
			);
			if (result1.rowCount === 0) {
				return null;
			}
			const originalSession: AdapterSession = result1.rows[0];

			const newSession: AdapterSession = {
				...originalSession,
				...session,
			};
			const sql = `
        UPDATE auth_sessions set
        expires = $2
        where "sessionToken" = $1
        `;
			const result = await client.query(sql, [
				newSession.sessionToken,
				newSession.expires,
			]);
			return result.rows[0];
		},
		async deleteSession(sessionToken) {
			const sql = `delete from auth_sessions where "sessionToken" = $1`;
			await client.query(sql, [sessionToken]);
		},
		async unlinkAccount(partialAccount) {
			const { provider, providerAccountId } = partialAccount;
			const sql = `delete from auth_accounts where "providerAccountId" = $1 and provider = $2`;
			await client.query(sql, [providerAccountId, provider]);
		},
		async deleteUser(userId: string) {
			await client.query('delete from auth_users where id = $1', [userId]);
			await client.query('delete from auth_sessions where "userId" = $1', [
				userId,
			]);
			await client.query('delete from auth_accounts where "userId" = $1', [
				userId,
			]);
		},
	};
}
