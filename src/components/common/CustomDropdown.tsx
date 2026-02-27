import { useState } from "react";
import styled from "styled-components";

const DropdownContainer = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 280px;
  max-height: 320px;
  z-index: 100;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  padding: 0.5rem 0;
`;

const HeaderTitle = styled.div`
  color: ${({ theme }) => theme.primary};
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.75rem 1.25rem;
  text-align: left;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 240px;
  overflow-y: auto;
`;

const ListItem = styled.li`
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textLight};
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    color: ${({ theme }) => theme.primary};
    background-color: #f9fafb;
  }
`;

const SearchInput = styled.input`
  width: calc(100% - 1.5rem);
  margin: 0 0.75rem 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.85rem;
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }
`;

interface CustomDropdownProps {
  title: string;
  options: string[];
  onSelect: (option: string) => void;
  onClose: () => void;
  enableSearch?: boolean;
}

export function CustomDropdown({
  title,
  options,
  onSelect,
  onClose,
  enableSearch,
}: CustomDropdownProps) {
  const [search, setSearch] = useState("");

  const effectiveOptions = enableSearch
    ? options.filter((option) =>
        option.toLowerCase().includes(search.toLowerCase()),
      )
    : options;

  return (
    <DropdownContainer onClick={(e) => e.stopPropagation()}>
      <HeaderTitle>{title}</HeaderTitle>
      {enableSearch && (
        <SearchInput
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
      )}
      <List>
        {effectiveOptions.map((option) => (
          <ListItem
            key={option}
            onClick={() => {
              onSelect(option);
              onClose();
            }}
          >
            {option}
          </ListItem>
        ))}
      </List>
    </DropdownContainer>
  );
}
