import { create } from "zustand";



const useAuthStore = create((set) => ({

    user: null,
    token: null,
    loading: false,
    error: null,

    login: async (username, password) => {
        try {
            set({ loading: true, error: null });
            const response = await fetch("https://api.example.com/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Login failed");
            }
            const data = await response.json();
            set({ user: data.user, token: data.token, loading: false });
            localStorage.setItem("token", data.token);
            return true;



        } catch (error) {
            console.error("Login failed", error);
            set({ loading: false, error: error.message });
            return false;

        }
    } ,
    logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null })
    },

     restoreSession: async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("https://api.example.com/auth/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
        if (!res.ok) throw new Error("Session restore failed");
        const data = await res.json();
      set({ user: data.user, token });
    } catch {
      set({ user: null, token: null });
    }
  },

}))


export default useAuthStore;