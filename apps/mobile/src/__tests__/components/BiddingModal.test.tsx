import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BiddingModal from '../../components/BiddingModal';

const mockRequest = {
  id: 'order1',
  pickup: 'Pickup Address',
  dropoff: 'Dropoff Address',
  price: 1000,
  distance: '5 km',
  type: 'Express' as const,
};

describe('BiddingModal', () => {
  it('renders nothing when visible is false', () => {
    const mockOnAccept = jest.fn();
    const mockOnBid = jest.fn();
    const mockOnDecline = jest.fn();

    const { queryByText } = render(
      <BiddingModal
        visible={false}
        request={mockRequest}
        onAccept={mockOnAccept}
        onBid={mockOnBid}
        onDecline={mockOnDecline}
      />
    );

    expect(queryByText('Pickup Address')).toBeNull();
    expect(queryByText('Dropoff Address')).toBeNull();
  });

  it('renders modal content when visible is true', () => {
    const mockOnAccept = jest.fn();
    const mockOnBid = jest.fn();
    const mockOnDecline = jest.fn();

    const { getByText } = render(
      <BiddingModal
        visible={true}
        request={mockRequest}
        onAccept={mockOnAccept}
        onBid={mockOnBid}
        onDecline={mockOnDecline}
      />
    );

    expect(getByText('Pickup Address')).toBeTruthy();
    expect(getByText('Dropoff Address')).toBeTruthy();
    expect(getByText('₦1,000')).toBeTruthy();
    expect(getByText('Express')).toBeTruthy();
    expect(getByText('5 km')).toBeTruthy();
    expect(getByText('Accept ₦1,000')).toBeTruthy();
    expect(getByText('Bid ₦1,100')).toBeTruthy(); // 10% bid
    expect(getByText('Bid ₦1,200')).toBeTruthy(); // 20% bid
    expect(getByText('Decline')).toBeTruthy();
  });

  it('calls onAccept with request price when accept button is pressed', () => {
    const mockOnAccept = jest.fn();
    const mockOnBid = jest.fn();
    const mockOnDecline = jest.fn();

    const { getByText } = render(
      <BiddingModal
        visible={true}
        request={mockRequest}
        onAccept={mockOnAccept}
        onBid={mockOnBid}
        onDecline={mockOnDecline}
      />
    );

    fireEvent.press(getByText('Accept ₦1,000'));
    expect(mockOnAccept).toHaveBeenCalledWith(1000);
  });

  it('calls onBid with 10% higher price when first bid button is pressed', () => {
    const mockOnAccept = jest.fn();
    const mockOnBid = jest.fn();
    const mockOnDecline = jest.fn();

    const { getByText } = render(
      <BiddingModal
        visible={true}
        request={mockRequest}
        onAccept={mockOnAccept}
        onBid={mockOnBid}
        onDecline={mockOnDecline}
      />
    );

    fireEvent.press(getByText('Bid ₦1,100'));
    expect(mockOnBid).toHaveBeenCalledWith(1100);
  });

  it('calls onBid with 20% higher price when second bid button is pressed', () => {
    const mockOnAccept = jest.fn();
    const mockOnBid = jest.fn();
    const mockOnDecline = jest.fn();

    const { getByText } = render(
      <BiddingModal
        visible={true}
        request={mockRequest}
        onAccept={mockOnAccept}
        onBid={mockOnBid}
        onDecline={mockOnDecline}
      />
    );

    fireEvent.press(getByText('Bid ₦1,200'));
    expect(mockOnBid).toHaveBeenCalledWith(1200);
  });

  it('calls onDecline when decline button is pressed', () => {
    const mockOnAccept = jest.fn();
    const mockOnBid = jest.fn();
    const mockOnDecline = jest.fn();

    const { getByText } = render(
      <BiddingModal
        visible={true}
        request={mockRequest}
        onAccept={mockOnAccept}
        onBid={mockOnBid}
        onDecline={mockOnDecline}
      />
    );

    fireEvent.press(getByText('Decline'));
    expect(mockOnDecline).toHaveBeenCalled();
  });

  it('displays correct bid options for different prices', () => {
    const mockOnAccept = jest.fn();
    const mockOnBid = jest.fn();
    const mockOnDecline = jest.fn();

    const customRequest = { ...mockRequest, price: 500 };

    const { getByText } = render(
      <BiddingModal
        visible={true}
        request={customRequest}
        onAccept={mockOnAccept}
        onBid={mockOnBid}
        onDecline={mockOnDecline}
      />
    );

    expect(getByText('Bid ₦550')).toBeTruthy(); // 10% of 500
    expect(getByText('Bid ₦600')).toBeTruthy(); // 20% of 500
  });
});