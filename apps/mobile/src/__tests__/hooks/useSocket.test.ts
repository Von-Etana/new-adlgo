import { renderHook } from '@testing-library/react-native';
import { useSocket } from '../../hooks/useSocket';

// Mock supabase
jest.mock('../../config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(),
      update: jest.fn(),
      eq: jest.fn(),
    })),
    auth: {
      getUser: jest.fn(),
    },
  },
}));

import { supabase } from '../../config/supabase';

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('useSocket', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return emit function', () => {
    const { result } = renderHook(() => useSocket());

    expect(result.current.emit).toBeDefined();
    expect(typeof result.current.emit).toBe('function');
  });

  describe('emit function', () => {
    it('should handle create_order event', async () => {
      const mockUser = { id: 'user1' };
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

      const mockInsert = jest.fn().mockResolvedValue({ error: null });
      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
      } as any);

      const { result } = renderHook(() => useSocket());

      const orderData = {
        pickup: { address: 'Pickup St', lat: 1.0, lng: 2.0 },
        dropoff: { address: 'Dropoff St', lat: 3.0, lng: 4.0 },
        offerPrice: 1000,
      };

      await result.current.emit('create_order', orderData);

      expect(mockSupabase.auth.getUser).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('orders');
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: 'user1',
        pickup_address: 'Pickup St',
        pickup_lat: 1.0,
        pickup_lng: 2.0,
        dropoff_address: 'Dropoff St',
        dropoff_lat: 3.0,
        dropoff_lng: 4.0,
        price: 1000,
        status: 'pending',
      });
    });

    it('should handle accept_bid event', async () => {
      const mockUpdate = jest.fn().mockResolvedValue({ error: null });
      const mockEq = jest.fn().mockReturnValue({ error: null });
      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: mockEq,
        }),
      } as any);

      const { result } = renderHook(() => useSocket());

      await result.current.emit('accept_bid', { orderId: 'order1', price: 1200 });

      expect(mockSupabase.from).toHaveBeenCalledWith('orders');
      expect(mockEq).toHaveBeenCalledWith('id', 'order1');
    });

    it('should handle driver_bid event', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const { result } = renderHook(() => useSocket());

      await result.current.emit('driver_bid', { orderId: 'order1', bidPrice: 1100 });

      expect(consoleWarnSpy).toHaveBeenCalledWith('Driver bidding logic needs a bids table in Supabase');

      consoleWarnSpy.mockRestore();
    });

    it('should handle unknown event', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      const { result } = renderHook(() => useSocket());

      await result.current.emit('unknown_event', {});

      expect(consoleLogSpy).toHaveBeenCalledWith('[Supabase Wrapper] Emitting unknown_event', {});

      consoleLogSpy.mockRestore();
    });

    it('should handle errors in create_order', async () => {
      const mockUser = { id: 'user1' };
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

      const mockError = new Error('Insert failed');
      const mockInsert = jest.fn().mockResolvedValue({ error: mockError });
      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
      } as any);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useSocket());

      await result.current.emit('create_order', {
        pickup: { address: 'Pickup St', lat: 1.0, lng: 2.0 },
        dropoff: { address: 'Dropoff St', lat: 3.0, lng: 4.0 },
        offerPrice: 1000,
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Supabase Insert Error:', mockError);

      consoleErrorSpy.mockRestore();
    });
  });
});