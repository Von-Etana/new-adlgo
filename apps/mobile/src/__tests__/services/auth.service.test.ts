import { AuthService } from '../../services/auth.service';

// Mock supabase
jest.mock('../../config/supabase', () => ({
  supabase: {
    auth: {
      signInWithOtp: jest.fn(),
      verifyOtp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
    },
  },
}));

import { supabase } from '../../config/supabase';

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signInWithPhoneNumber', () => {
    it('should send OTP successfully', async () => {
      const mockData = { user: null, session: null };
      mockSupabase.auth.signInWithOtp.mockResolvedValue({ data: mockData, error: null });

      const result = await AuthService.signInWithPhoneNumber('+1234567890');

      expect(mockSupabase.auth.signInWithOtp).toHaveBeenCalledWith({
        phone: '+1234567890',
      });
      expect(result).toEqual(mockData);
    });

    it('should throw error on failure', async () => {
      const mockError = new Error('Invalid phone number');
      mockSupabase.auth.signInWithOtp.mockResolvedValue({ data: null, error: mockError });

      await expect(AuthService.signInWithPhoneNumber('+1234567890')).rejects.toThrow('Invalid phone number');
    });
  });

  describe('confirmCode', () => {
    it('should verify OTP successfully', async () => {
      const mockUser = { id: 'user1', phone: '+1234567890' };
      const mockSession = { access_token: 'token' };
      mockSupabase.auth.verifyOtp.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null
      });

      const result = await AuthService.confirmCode('+1234567890', '123456');

      expect(mockSupabase.auth.verifyOtp).toHaveBeenCalledWith({
        phone: '+1234567890',
        token: '123456',
        type: 'sms',
      });
      expect(result).toEqual({ user: mockUser, session: mockSession });
    });

    it('should throw error on invalid code', async () => {
      const mockError = new Error('Invalid code');
      mockSupabase.auth.verifyOtp.mockResolvedValue({ data: null, error: mockError });

      await expect(AuthService.confirmCode('+1234567890', '123456')).rejects.toThrow('Invalid code');
    });
  });

  describe('login', () => {
    it('should login with email and password successfully', async () => {
      const mockUser = { id: 'user1', email: 'test@example.com' };
      const mockSession = { access_token: 'token' };
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null
      });

      const result = await AuthService.login('test@example.com', 'password');

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
      expect(result).toEqual({ user: mockUser, session: mockSession });
    });

    it('should throw error on login failure', async () => {
      const mockError = new Error('Invalid credentials');
      mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: null, error: mockError });

      await expect(AuthService.login('test@example.com', 'wrong')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({ error: null });

      await expect(AuthService.logout()).resolves.toBeUndefined();

      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    });

    it('should throw error on logout failure', async () => {
      const mockError = new Error('Logout failed');
      mockSupabase.auth.signOut.mockResolvedValue({ error: mockError });

      await expect(AuthService.logout()).rejects.toThrow('Logout failed');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', async () => {
      const mockUser = { id: 'user1', email: 'test@example.com' };
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

      const result = await AuthService.getCurrentUser();

      expect(result).toEqual(mockUser);
      expect(mockSupabase.auth.getUser).toHaveBeenCalled();
    });

    it('should return null if no user', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });

      const result = await AuthService.getCurrentUser();

      expect(result).toBeNull();
    });
  });
});