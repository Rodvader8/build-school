import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import EntityForm from '../src/components/EntityForm.jsx';

const fill = (name, email, value) => {
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: name } });
  fireEvent.change(screen.getByLabelText('Owner email'), { target: { value: email } });
  fireEvent.change(screen.getByLabelText('Value'), { target: { value } });
};
const submit = () => fireEvent.click(screen.getByRole('button', { name: 'Add entity' }));

describe('EntityForm', () => {
  it('submitting an empty form shows a message under each field and sends nothing', () => {
    const onAdd = vi.fn();
    render(<EntityForm onAdd={onAdd} />);
    submit();
    expect(screen.getAllByRole('alert').map((a) => a.textContent)).toEqual([
      'Enter a name of at least 2 characters',
      'Enter a valid email address',
      'Value must be at least $1',
    ]);
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('an invalid field is marked aria-invalid and linked to its message', () => {
    render(<EntityForm onAdd={() => {}} />);
    fill('Family Trust', 'nope', '100');
    submit();
    const email = screen.getByLabelText('Owner email');
    expect(email.getAttribute('aria-invalid')).toBe('true');
    expect(document.getElementById(email.getAttribute('aria-describedby')).textContent).toBe('Enter a valid email address');
    expect(screen.getByLabelText('Name').getAttribute('aria-invalid')).not.toBe('true');
  });

  it('a valid form calls onAdd once with clean data', () => {
    const onAdd = vi.fn();
    render(<EntityForm onAdd={onAdd} />);
    fill(' Family Trust ', 'owner@example.com', '2400000');
    submit();
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith({ name: 'Family Trust', email: 'owner@example.com', value: 2400000 });
  });

  it('after a good submit the messages are gone and the form is empty', () => {
    render(<EntityForm onAdd={() => {}} />);
    submit();
    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    fill('Family Trust', 'owner@example.com', '5');
    submit();
    expect(screen.queryAllByRole('alert')).toHaveLength(0);
    expect(screen.getByLabelText('Name').value).toBe('');
  });
});
