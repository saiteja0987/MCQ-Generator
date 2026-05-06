(function () {
    const API_BASE = '/api/auth';
    const TOKEN_KEY = 'mcqToken';
    const CURRENT_USER_KEY = 'mcqCurrentUser';

    function getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    function setSession(token, user) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }

    async function signup({ name, email, password }) {
        const response = await fetch(`${API_BASE}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();

        if (!response.ok) {
            return { ok: false, message: data.detail || 'Sign up failed.' };
        }

        setSession(data.token, data.user);
        return { ok: true, user: data.user };
    }

    async function login({ email, password }) {
        const response = await fetch(`${API_BASE}/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (!response.ok) {
            return { ok: false, message: data.detail || 'Sign in failed.' };
        }

        setSession(data.token, data.user);
        return { ok: true, user: data.user };
    }

    function getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
        } catch (_err) {
            return null;
        }
    }

    function logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(CURRENT_USER_KEY);
    }

    function requireAuth(redirectPath) {
        const token = getToken();
        const user = getCurrentUser();
        if (token && user) return user;

        window.location.href = redirectPath || 'signin.html';
        return null;
    }

    window.MCQAuth = {
        signup,
        login,
        logout,
        getToken,
        getCurrentUser,
        requireAuth
    };
})();
