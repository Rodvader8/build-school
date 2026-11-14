import { render, screen } from '@testing-library/react';
import { setParams } from 'expo-router';
import RootLayout from '../app/_layout.jsx';
import Home from '../app/index.jsx';
import RoomDetails from '../app/rooms/[id].jsx';

describe('the screens', () => {
  it('the home screen links every room to its own address', () => {
    render(<Home />);
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['/rooms/garden', '/rooms/harbour', '/rooms/loft']);
  });

  it('the detail screen reads the room id from the address', () => {
    setParams({ id: 'loft' });
    render(<RoomDetails />);
    expect(screen.getByRole('heading', { name: 'Loft' })).toBeTruthy();
    expect(screen.getByText(/best light/)).toBeTruthy();
    expect(screen.getByText('$210 a night')).toBeTruthy();
  });

  it('an unknown room id says so instead of crashing', () => {
    setParams({ id: 'penthouse' });
    render(<RoomDetails />);
    expect(screen.getByText('Room not found')).toBeTruthy();
  });

  it('the detail screen titles its header with the room name', () => {
    setParams({ id: 'harbour' });
    render(<RoomDetails />);
    expect(JSON.parse(screen.getByTestId('screen-options').getAttribute('data-options')).title).toBe('Harbour Suite');
  });

  it('the detail screen has a link back to the list', () => {
    setParams({ id: 'garden' });
    render(<RoomDetails />);
    expect(screen.getByRole('link', { name: /Back to all rooms/ }).getAttribute('href')).toBe('/');
  });
});

describe('the layout', () => {
  it('the layout is a Stack with a titled screen for the list and one for room details', () => {
    render(<RootLayout />);
    expect(screen.getByTestId('stack')).toBeTruthy();
    expect(JSON.parse(screen.getByTestId('screen-index').getAttribute('data-options')).title).toBe('Hotel Marlow');
    expect(screen.getByTestId('screen-rooms/[id]')).toBeTruthy();
  });
});
