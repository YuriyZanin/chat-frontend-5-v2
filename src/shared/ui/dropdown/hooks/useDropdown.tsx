import { RefObject, useEffect, useRef, useState } from 'react';

type UseDropdownReturn = {
  isOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  dropdownRef: RefObject<HTMLDivElement | null>;
  menuRef: RefObject<HTMLDivElement | null>;
};

export const useDropdown = (): UseDropdownReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (): void => setIsOpen((prev) => !prev);

  const closeMenu = (): void => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return (): void => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return { isOpen, toggleMenu, closeMenu, dropdownRef, menuRef };
};
