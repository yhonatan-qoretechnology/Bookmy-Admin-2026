import { useState } from "react";
import styled from "styled-components";

const SearchContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 280px;
  max-width: 400px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9rem;
  background: white;
  transition: all 0.2s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 50%;
  background: #f1f5f9;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  line-height: 1;

  &:hover {
    background: #e2e8f0;
    color: #334155;
  }
`;

const FilterSelect = styled.select`
  padding: 0.6rem 2rem 0.6rem 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.85rem;
  background: white
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E")
    no-repeat right 10px center;
  cursor: pointer;
  appearance: none;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
`;

const FilterLabel = styled.span`
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
`;

interface ColumnFilter {
  key: string;
  label: string;
}

interface TableSearchFilterProps {
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  columns?: ColumnFilter[];
  onFilterChange?: (key: string, value: string) => void;
}

export function TableSearchFilter({
  searchPlaceholder = "Buscar...",
  onSearch,
  columns = [],
  onFilterChange,
}: TableSearchFilterProps) {
  const [searchValue, setSearchValue] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  const handleClear = () => {
    setSearchValue("");
    onSearch?.("");
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filterValues, [key]: value };
    setFilterValues(newFilters);
    onFilterChange?.(key, value);
  };

  return (
    <SearchContainer>
      <InputWrapper>
        <SearchIcon>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={handleSearchChange}
        />
        {searchValue && (
          <ClearButton onClick={handleClear} type="button">
            ×
          </ClearButton>
        )}
      </InputWrapper>
      {columns.map((col) => (
        <div
          key={col.key}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <FilterLabel>{col.label}:</FilterLabel>
          <FilterSelect
            value={filterValues[col.key] || ""}
            onChange={(e) => handleFilterChange(col.key, e.target.value)}
          >
            <option value="">Todos</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </FilterSelect>
        </div>
      ))}
    </SearchContainer>
  );
}
