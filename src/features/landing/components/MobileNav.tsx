// features/landing/components/MobileNav.tsx
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/shared/components/ui/sheet';
import { Button } from '@/shared/components/ui/button';
import type { NavLink } from '../types';

interface MobileNavProps {
  links: NavLink[];
}

export function MobileNav({ links }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Ouvrir le menu"
          />
        }
      >
        <Menu className="h-6 w-6" />
      </SheetTrigger>

      <SheetContent side="right" className="w-72">
        <nav className="mt-10 flex flex-col gap-6">
          {links.map((link) => (
            <SheetClose
              key={link.href}
              render={
                <a
                  href={link.href}
                  className="text-base font-medium text-foreground/80 hover:text-foreground"
                />
              }
            >
              {link.label}
            </SheetClose>
          ))}

          <div className="h-px bg-border my-2" />

          <SheetClose
            render={
              <Link
                to="/connexion"
                className="text-base font-medium text-foreground/80 hover:text-foreground text-center"
              />
            }
          >
            Se connecter
          </SheetClose>

          <SheetClose render={<Link to="/inscription" className="w-full" />}>
            <Button className="mt-2 w-full">
              Essai gratuit
            </Button>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}