// issue-tracker-frontend/src/api/client.ts

const API_BASE = "http://localhost:5000/api";

export async function apiFetch<T>(
    endpoint : string,
    options: RequestInit = {}
): Promise<T>{
    const token  =  localStorage.getItem("token");

    const res =  await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}`}),
            ...options.headers,
        },
    });

    if (res.status === 401) {
        const hasToken = localStorage.getItem("token");

        if (hasToken) {
            localStorage.clear();
            window.location.href = "/";
        }

        throw new Error("Unauthorized");
    }

    if(!res.ok){
        let message = "API Error";
        try {
            const error = await res.json();
            message = error.message;
        } catch {}
        throw new Error(message);
    }

    const text = await res.text();
    return text? JSON.parse(text) : ({} as T);

}