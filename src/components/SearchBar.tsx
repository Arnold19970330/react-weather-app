import { useState, useCallback } from 'react';
import { debounce } from 'lodash'; // vagy saját debounce implementáció

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const debouncedSearch = useCallback(
    debounce((value: string) => onSearch(value), 400),
    [onSearch]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            debouncedSearch(e.target.value);
          }}
          placeholder="Város keresése... (pl. Budapest)"
          className="w-full px-5 py-3 rounded-2xl bg-slate-950/50 backdrop-blur-2xl border border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-300/60 text-lg text-cyan-100 placeholder:text-cyan-100/45"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-6 py-2 rounded-xl hover:bg-emerald-400/30 transition"
        >
          🔎
        </button>
      </div>
    </form>
  );
}