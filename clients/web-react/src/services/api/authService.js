import apiClient from './client';

class AuthService {
  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async verifyToken(token) {
    try {
      const response = await apiClient.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw new Error('Token verification failed');
    }
  }

  async refreshToken() {
    try {
      const response = await apiClient.post('/auth/refresh');
      return response.data.token;
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  }
}

export const authService = new AuthService();