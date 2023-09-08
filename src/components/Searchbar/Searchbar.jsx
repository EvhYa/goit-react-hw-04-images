import { useState } from 'react';
import { SeacrhbarContainer, SearchForm } from './Searchbar.styled';
import { IconSearch } from './IconSearch';

export function Searchbar({ onSearchRequestSubmit }) {
  const [query, setQuery] = useState('');

  const onChange = e => {
    setQuery(e.currentTarget.value);
  };

  const onSubmit = e => {
    e.preventDefault();
    if (!query.trim()) {
      return;
    }
    onSearchRequestSubmit(query.trim());
    setQuery('');
  };

  return (
    <header>
      <SeacrhbarContainer>
        <SearchForm onSubmit={onSubmit}>
          <button type="submit">
            <IconSearch />
          </button>

          <input
            onChange={onChange}
            type="text"
            autoComplete="off"
            value={query}
            autoFocus
            placeholder="Search images and photos"
          />
        </SearchForm>
      </SeacrhbarContainer>
    </header>
  );
}
