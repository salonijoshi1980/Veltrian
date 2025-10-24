const authActions = [
    "providers",
    "session",
    "csrf",
    "signin",
    "signout",
    "callback",
    "verify-request",
    "error",
    "webauthn-options",
]

export function isAuthAction(
    pathname: string,
): boolean {
    const base = '/api/auth'
    const a = pathname.match(new RegExp(`^${base}(.+)`))

    if (a === null) {
        return false
    }

    const actionAndProviderId = a.at(-1)

    if (!actionAndProviderId) {
        return false
    }

    const b = actionAndProviderId.replace(/^\//, "").split("/").filter(Boolean)

    if (b.length !== 1 && b.length !== 2) {
        return false
    }

    const [action] = b

    if (!authActions.includes(action)) {
        return false
    }
    return true
}