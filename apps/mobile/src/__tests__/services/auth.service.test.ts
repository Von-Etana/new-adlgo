import { AuthService } from '../../services/auth.service';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock api and AsyncStorage
jest.mock('../../services/api', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully and store token', async () => {
      const mockResponse = {
        data: {
          token: 'mock-token',
          user: { id: 'user1', phone: '1234567890' },
        },
      };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.login('1234567890', 'password');

      expect(api.post).toHaveBeenCalledWith('/auth/login', { phone: '1234567890', password: 'password' });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('token', 'mock-token');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.data.user));
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error on login failure', async () => {
      const mockError = new Error('Invalid credentials');
      (api.post as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.login('1234567890', 'wrong')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const mockResponse = { data: { id: 'user1', phone: '1234567890' } };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const data = { phone: '1234567890', fullName: 'John Doe', password: 'password' };
      const result = await AuthService.register(data);

      expect(api.post).toHaveBeenCalledWith('/auth/register', data);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('logout', () => {
    it('should remove token and user from storage', async () => {
      await AuthService.logout();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('token');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('getUser', () => {
    it('should return user from storage', async () => {
      const mockUser = { id: 'user1', phone: '1234567890' };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));

      const result = await AuthService.getUser();
      expect(result).toEqual(mockUser);
    });

    it('should return null if no user in storage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const result = await AuthService.getUser();
      expect(result).toBeNull();
    });
  });
});