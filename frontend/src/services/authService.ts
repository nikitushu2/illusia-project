// Auth service for token management

const TOKEN_KEY = 'auth_token';

const authService = {
  // Store token in localStorage
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Get token from localStorage
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Remove token from localStorage
  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Check if token exists
  isLoggedIn: (): boolean => {
    return !!authService.getToken();
  }
};

export default authService; 