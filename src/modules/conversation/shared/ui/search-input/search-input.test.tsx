import { fireEvent, render, screen } from '@testing-library/react';
import { SearchInput } from './search-input';

describe('SearchInput — поле поиска', () => {
  it('Рендерит инпут с переданным значением', () => {
    render(<SearchInput query="test" onChange={() => {}} onClear={() => {}} />);

    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });

  it('Вызывает onChange при изменении значения инпута', () => {
    const onChange = vi.fn();

    render(<SearchInput query="" onChange={onChange} onClear={() => {}} />);

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'abc' },
    });

    expect(onChange).toHaveBeenCalledWith('abc');
  });

  it('Показывает кнопку очистки и вызывает onClear при клике', () => {
    const onClear = vi.fn();

    render(<SearchInput query="abc" onChange={() => {}} onClear={onClear} />);

    fireEvent.click(screen.getByLabelText('Очистить поиск'));

    expect(onClear).toHaveBeenCalled();
  });
});
