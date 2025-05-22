import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Travel Guide Booking heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Travel Guide Booking/i);
  expect(headingElement).toBeInTheDocument();
});
