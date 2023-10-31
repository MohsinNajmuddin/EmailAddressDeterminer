import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { EmailAddressDeterminerForm } from './EmailAddressDeterminerForm';
import { APP_CONSTANTS } from '../constants/Constants';

// Mock the emailAddressDeterminerService function
jest.mock('../service/EmailAddressDeterminerService', () => ({
  getDerivedEmailAddress: jest.fn(),
}));

describe('EmailAddressDeterminerForm', () => {
  it('renders without errors', () => {
    const { getByText, getByLabelText } = render(<EmailAddressDeterminerForm />);
    expect(getByText(APP_CONSTANTS.TITLE)).toBeInTheDocument();
    expect(getByText(APP_CONSTANTS.DESCRIPTION)).toBeInTheDocument();
    expect(getByLabelText('First Name')).toBeInTheDocument();
    expect(getByLabelText('Last Name')).toBeInTheDocument();
    expect(getByLabelText('Company Domain')).toBeInTheDocument();
  });

  it('submits the form successfully', async () => {
    const { getByLabelText, getByText, getByRole } = render(<EmailAddressDeterminerForm />);

    // Mock the service response
    const mockResponse = { derivedEmailAddress: 'test@example.com' };
    require('../service/EmailAddressDeterminerService').getDerivedEmailAddress.mockResolvedValue(mockResponse);

    // Fill in the form fields
    fireEvent.change(getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(getByLabelText('Company Domain'), { target: { value: 'example.com' } });

    // Submit the form
    fireEvent.click(getByRole('button', { name: 'Submit' }));

    // Wait for the success message
    await waitFor(() => {
      expect(getByText('Derived Email Address: test@example.com')).toBeInTheDocument();
    });
  });

  it('displays an error message when form submission fails', async () => {
    const { getByLabelText, getByText, getByRole } = render(<EmailAddressDeterminerForm />);

    // Mock the service response
    const mockResponse = { error: 'Some error message' };
    require('../service/EmailAddressDeterminerService').getDerivedEmailAddress.mockResolvedValue(mockResponse);

    // Fill in the form fields
    fireEvent.change(getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(getByLabelText('Company Domain'), { target: { value: 'example.com' } });

    // Submit the form
    fireEvent.click(getByRole('button', { name: 'Submit' }));

    // Wait for the error message
    await waitFor(() => {
      expect(getByText('Some error message')).toBeInTheDocument();
    });
  });
});
