'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

const themes = [
  {
    label: 'Light',
    icon: SunIcon,
    value: 'light',
  },
  {
    label: 'Dark',
    icon: MoonIcon,
    value: 'dark',
  },
  {
    label: 'System',
    icon: MonitorIcon,
    value: 'system',
  },
];

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Select theme"
            className="cursor-pointer rounded-full"
          >
            {theme === 'light' && (
              <SunIcon size={16} strokeWidth={2} aria-hidden="true" />
            )}
            {theme === 'dark' && (
              <MoonIcon size={16} strokeWidth={2} aria-hidden="true" />
            )}
            {theme === 'system' && (
              <MonitorIcon size={16} strokeWidth={2} aria-hidden="true" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-32">
          {themes.map((theme) => (
            <DropdownMenuItem
              key={theme.value}
              onClick={() => setTheme(theme.value)}
              className="cursor-pointer"
            >
              <theme.icon
                size={16}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>{theme.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
