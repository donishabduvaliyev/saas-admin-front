import { create } from "zustand";



const useAuthStore = create((set) => ({

    user: null,
    token: null,
    loading: false,
    error: null,

    login: async (phone, password) => {
        try {
            set({ loading: true, error: null });
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phone, password }),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Backend error response:", errorData);
                throw new Error(errorData.msg || "Login failed");
            }
            const data = await response.json();
            set({ user: data.user, token: data.token, loading: false });
            localStorage.setItem("token", data.token);
            console.log("Login successful:", data); 
            
            return true;



        } catch (error) {
            console.error("Login failed", error);
            set({ loading: false, error: error.message });
            return false;

        }
    },
    logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null })
    },

    restoreSession: async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await fetch("http://localhost:5000/api/auth/", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Session restore failed");
            const data = await res.json();
            set({ user: data.phone, token });
        } catch {
            set({ user: null, token: null });
        }
    },

}))


export default useAuthStore;