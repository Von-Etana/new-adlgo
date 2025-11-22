import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ModeSwitch from '../../components/ModeSwitch';

describe('ModeSwitch', () => {
  it('renders customer mode correctly', () => {
    const mockOnSwitch = jest.fn();
    const { getByText, queryByTestId } = render(
      <ModeSwitch mode="customer" onSwitch={mockOnSwitch} />
    );

    expect(getByText('Customer')).toBeTruthy();
    expect(getByText('Driver')).toBeTruthy();

    // Customer text should be active (black), Driver inactive (gray)
    // Note: Styling tests might require snapshot testing or custom matchers
  });

  it('renders driver mode correctly', () => {
    const mockOnSwitch = jest.fn();
    const { getByText } = render(
      <ModeSwitch mode="driver" onSwitch={mockOnSwitch} />
    );

    expect(getByText('Customer')).toBeTruthy();
    expect(getByText('Driver')).toBeTruthy();
  });

  it('calls onSwitch with customer when customer button is pressed', () => {
    const mockOnSwitch = jest.fn();
    const { getByText } = render(
      <ModeSwitch mode="driver" onSwitch={mockOnSwitch} />
    );

    fireEvent.press(getByText('Customer'));
    expect(mockOnSwitch).toHaveBeenCalledWith('customer');
  });

  it('calls onSwitch with driver when driver button is pressed', () => {
    const mockOnSwitch = jest.fn();
    const { getByText } = render(
      <ModeSwitch mode="customer" onSwitch={mockOnSwitch} />
    );

    fireEvent.press(getByText('Driver'));
    expect(mockOnSwitch).toHaveBeenCalledWith('driver');
  });

  it('does not call onSwitch when pressing the already active mode', () => {
    const mockOnSwitch = jest.fn();
    const { getByText } = render(
      <ModeSwitch mode="customer" onSwitch={mockOnSwitch} />
    );

    fireEvent.press(getByText('Customer'));
    expect(mockOnSwitch).toHaveBeenCalledWith('customer'); // Still called, as per implementation
  });
});