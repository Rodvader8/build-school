import { render, screen } from '@testing-library/react';

const load = async (path) => (await import(path)).default;

describe('images and fonts', () => {
  it('the hero image has alt text, a width and height, and loads first', async () => {
    const Hero = await load('../components/Hero.jsx');
    render(<Hero />);
    const img = screen.getByRole('img');
    expect(img.getAttribute('alt').length).toBeGreaterThan(10);
    expect(img.getAttribute('width')).toBe('1600');
    expect(img.getAttribute('height')).toBe('900');
    expect(img.getAttribute('loading')).not.toBe('lazy');
    expect(img.getAttribute('src')).toContain('/_next/image');
  });

  it('the gallery images have dimensions and stay lazy', async () => {
    const Gallery = await load('../components/Gallery.jsx');
    render(<Gallery />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    for (const img of images) {
      expect(img.getAttribute('width')).toBe('800');
      expect(img.getAttribute('height')).toBe('600');
      expect(img.getAttribute('loading')).toBe('lazy');
      expect(img.getAttribute('alt').length).toBeGreaterThan(10);
    }
  });
});
