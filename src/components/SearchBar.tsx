import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { WeatherSearchSuggestion } from "../types/weather";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const DEBOUNCE_MS = 350;
const MAX_SUGGESTIONS = 5;

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [shouldAutoOpen, setShouldAutoOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const closeSuggestions = useCallback(() => {
    setIsSuggestionsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const handleSelect = useCallback(
    (suggestion: WeatherSearchSuggestion) => {
      const selectedQuery = `${suggestion.name}, ${suggestion.country}`;
      setQuery(selectedQuery);
      setShouldAutoOpen(false);
      closeSuggestions();
      onSearch(selectedQuery);
    },
    [closeSuggestions, onSearch]
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleaned = query.trim();
    if (!cleaned) return;
    setShouldAutoOpen(false);

    if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
      handleSelect(suggestions[highlightedIndex]);
      return;
    }

    onSearch(cleaned);
    closeSuggestions();
  };

  useEffect(() => {
    const debounceTimer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(debounceTimer);
    };
  }, [query]);

  const canSearch = debouncedQuery.length >= 2;

  const {
    data: suggestions = [],
    isFetching: isSearching,
    isError,
  } = useQuery<WeatherSearchSuggestion[]>({
    queryKey: ["city-search", debouncedQuery],
    enabled: canSearch,
    staleTime: 1000 * 60 * 5,
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(debouncedQuery)}`,
        { signal }
      );

      if (!response.ok) {
        throw new Error("Search API error");
      }

      const result: WeatherSearchSuggestion[] = await response.json();
      return result.slice(0, MAX_SUGGESTIONS);
    },
  });

  useEffect(() => {
    if (!canSearch || !shouldAutoOpen) {
      closeSuggestions();
      return;
    }

    setIsSuggestionsOpen(true);
    setHighlightedIndex(suggestions.length > 0 ? 0 : -1);
  }, [canSearch, suggestions, closeSuggestions, shouldAutoOpen]);

  useEffect(() => {
    const onDocumentMouseDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        closeSuggestions();
      }
    };

    document.addEventListener("mousedown", onDocumentMouseDown);
    return () => document.removeEventListener("mousedown", onDocumentMouseDown);
  }, [closeSuggestions]);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-6">
      <div ref={containerRef} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShouldAutoOpen(true);
          }}
          onFocus={() => {
            setShouldAutoOpen(true);
            if (canSearch) {
              setIsSuggestionsOpen(true);
            }
          }}
          onKeyDown={(e) => {
            if (!isSuggestionsOpen || suggestions.length === 0) {
              return;
            }

            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlightedIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
            } else if (e.key === "Escape") {
              closeSuggestions();
            }
          }}
          placeholder="Város keresése... (pl. Budapest)"
          className="w-full px-6 py-4 pr-20 rounded-2xl bg-zinc-900/80 backdrop-blur-3xl border border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 text-lg md:text-xl text-emerald-100 placeholder:text-emerald-100/45"
          disabled={isLoading}
          aria-label="Város keresése"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-6 py-2 rounded-xl hover:bg-emerald-400/30 transition disabled:opacity-50"
        >
          🔎
        </button>

        {(isSearching || isLoading) && (
          <div className="absolute right-16 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 rounded-full border-2 border-emerald-300/25 border-t-emerald-300 animate-spin" />
          </div>
        )}

        {isSuggestionsOpen && (
          <div className="absolute z-50 mt-3 w-full overflow-hidden rounded-2xl border border-emerald-500/20 bg-zinc-900/85 backdrop-blur-3xl shadow-2xl">
            {isError && (
              <p className="px-4 py-3 text-sm text-red-300">Keresés sikertelen. Próbáld újra.</p>
            )}

            {!isError && suggestions.length === 0 && !isSearching && canSearch && (
              <p className="px-4 py-3 text-sm text-emerald-100/70">Nincs találat.</p>
            )}

            {!isError && suggestions.length > 0 && (
              <ul className="max-h-72 overflow-y-auto py-2">
                {suggestions.map((suggestion, index) => {
                  const isActive = index === highlightedIndex;
                  const regionText = suggestion.region ? `${suggestion.region}, ` : "";

                  return (
                    <li key={`${suggestion.id}-${suggestion.lat}-${suggestion.lon}`}>
                      <button
                        type="button"
                        onClick={() => handleSelect(suggestion)}
                        className={`w-full px-4 py-3 text-left transition-colors ${
                          isActive
                            ? "bg-emerald-500/20 text-emerald-100"
                            : "text-emerald-100/90 hover:bg-emerald-500/10"
                        }`}
                      >
                        <span className="font-medium">{suggestion.name}</span>
                        <span className="ml-2 text-sm text-emerald-100/65">
                          {regionText}{suggestion.country}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </form>
  );
}