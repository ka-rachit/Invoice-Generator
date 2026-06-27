export const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? "http://localhost:5000"
  : "https://h9p9b03w-5000.inc1.devtunnels.ms/";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // Signup
    LOGIN: "/api/auth/login", // Authenticate user & return JWT token
    GET_PROFILE: "/api/auth/me", // Get logged-in user details
    UPDATE_PROFILE: "/api/auth/me", // update profile details (PUT)
  },

  INVOICE: {
    CREATE: "/api/invoices/",
    GET_ALL_INVOICES: "/api/invoices/",
    GET_INVOICE_BY_ID: (id) => `/api/invoices/${id}`,
    UPDATE_INVOICE: (id) => `/api/invoices/${id}`,
    DELETE_INVOICE: (id) => `/api/invoices/${id}`,
  },

  AI: {
    PARSE_INVOICE_TEXT: '/api/ai/parse-text',
    GENERATE_REMINDER: '/api/ai/generate-reminder',
    GENERATE_WHATSAPP_REMINDER: '/api/ai/generate-whatsapp-reminder',
    GET_DASHBOARD_SUMMARY: '/api/ai/dashboard-summary'
  }
};
