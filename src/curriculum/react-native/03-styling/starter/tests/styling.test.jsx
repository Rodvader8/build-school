import { render, screen } from '@testing-library/react';
import { StyleSheet } from 'react-native';
import App from '../App.jsx';
import { styles, buttonStyle } from '../components/RoomCard.jsx';

// How readable is text on a background? 4.5 is the usual minimum for body text.
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);

describe('the room card styling', () => {
  it('the card has padding, rounded corners and a surface colour', () => {
    expect(styles.card.padding).toBeGreaterThanOrEqual(12);
    expect(styles.card.borderRadius).toBeGreaterThanOrEqual(8);
    expect(styles.card.backgroundColor).toBeTruthy();
  });

  it('the photo fills the card width and has a fixed height', () => {
    expect(styles.photo.width).toBe('100%');
    expect(styles.photo.height).toBeGreaterThanOrEqual(120);
  });

  it('the name and the price sit on one row, spread apart', () => {
    expect(styles.header.flexDirection).toBe('row');
    expect(styles.header.justifyContent).toBe('space-between');
    expect(styles.header.alignItems).toBe('center');
  });

  it('the name is bigger and bolder than the description', () => {
    expect(styles.name.fontSize).toBeGreaterThan(styles.description.fontSize);
    expect(Number(styles.name.fontWeight)).toBeGreaterThanOrEqual(600);
  });

  it('the button text is easy to read against the button', () => {
    expect(contrast(styles.buttonText.color, styles.button.backgroundColor)).toBeGreaterThanOrEqual(4.5);
  });

  it('a pressed button gets its own look', () => {
    expect(styles.buttonPressed).toBeTruthy();
    const resting = StyleSheet.flatten(buttonStyle({ pressed: false }));
    const pressed = StyleSheet.flatten(buttonStyle({ pressed: true }));
    expect(resting.backgroundColor).toBe(styles.button.backgroundColor);
    expect(pressed.backgroundColor === resting.backgroundColor && pressed.opacity === resting.opacity).toBe(false);
  });

  it('each room shows its price', () => {
    render(<App />);
    expect(screen.getByText('$320 a night')).toBeTruthy();
  });
});
