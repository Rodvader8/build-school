import { schema } from '../src/schema.js';

describe('the schema', () => {
  it('accepts a good entity, trims the name and turns the value into a number', () => {
    const result = schema.safeParse({ name: '  Family Trust ', email: 'owner@example.com', value: '2400000' });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ name: 'Family Trust', email: 'owner@example.com', value: 2400000 });
  });

  it('rejects a name under 2 characters, with a message a person can read', () => {
    const result = schema.safeParse({ name: 'A', email: 'owner@example.com', value: '10' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('Enter a name of at least 2 characters');
  });

  it('rejects an email without a proper address', () => {
    const result = schema.safeParse({ name: 'Family Trust', email: 'not-an-email', value: '10' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('Enter a valid email address');
  });

  it('rejects a value below 1 or one that is not a number', () => {
    const low = schema.safeParse({ name: 'Family Trust', email: 'owner@example.com', value: '0' });
    const letters = schema.safeParse({ name: 'Family Trust', email: 'owner@example.com', value: 'lots' });
    expect(low.success).toBe(false);
    expect(low.error.issues[0].message).toBe('Value must be at least $1');
    expect(letters.success).toBe(false);
  });
});
