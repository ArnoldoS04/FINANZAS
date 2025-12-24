// utils/authFetch.js
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

// Crea una instancia de Axios
const authFetch = axios.create({
  baseURL: API_URL,
  withCredentials: true, // importante para enviar la cookie del refreshToken
});

// Interceptor para añadir el token en cada request
authFetch.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar expiración de token
authFetch.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si token expiró, intenta renovar con refreshToken
    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(`${API_URL}/auth/refresh`, null, {
          withCredentials: true,
        });

        const newToken = res.data.accessToken;
        localStorage.setItem("token", newToken);
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        return authFetch(originalRequest); // Reintenta la petición original
      } catch (refreshError) {
        console.error("No se pudo refrescar el token", refreshError);
        localStorage.removeItem("token");
        // window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default authFetch;
