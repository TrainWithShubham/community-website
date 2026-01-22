
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Github, Menu, Home, FileQuestion, Briefcase, Terminal, Code, Calendar, Trophy } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '../ui/separator';

type NavLink = {
  href: string;
  label: string;
  icon: any; // lucide-react icon component
  external?: boolean;
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/projects', label: 'Projects', icon: Code },
  { href: '/interview-questions', label: 'Interview Questions', icon: FileQuestion },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/heroes', label: 'Heroes', icon: Trophy },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderNavLinks = (isMobile = false) => (
    <>
      {navLinks.map((link) => (
        <Button key={link.href} variant="ghost" asChild className={isMobile ? 'w-full justify-start' : ''}>
          {link.external ? (
            <a href={link.href} target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>
              {link.icon && <link.icon className="mr-2 h-4 w-4" />}
              {link.label}
            </a>
          ) : (
            <Link href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
              {link.icon && <link.icon className="mr-2 h-4 w-4" />}
              {link.label}
            </Link>
          )}
        </Button>
      ))}
    </>
  );

  const Logo = ({ className = "", onClick }: { className?: string; onClick?: () => void }) => (
    <Link 
      href="/" 
      className={`font-bold flex items-center space-x-2 ${className}`}
      onClick={onClick}
      aria-label="TWS Community Hub - Home"
    >
      <Terminal className="h-6 w-6 text-primary" aria-hidden="true" />
      <span className={className.includes('text-sm') ? 'text-sm' : ''}>
        <span className="text-primary">TrainWithShubham</span>
        <span className="text-accent">@</span>
        <span className="text-green-500">Community</span>
        <span>:~#</span>
      </span>
    </Link>
  );



  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Logo className="mr-auto sm:inline-block" />
        <nav 
          id="navigation"
          className="hidden md:flex items-center gap-1 text-sm"
          role="navigation"
          aria-label="Main navigation"
        >
          {renderNavLinks()}
        </nav>
        <div className="flex items-center justify-end space-x-2 ml-4">
          <ThemeToggle />
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  aria-label="Toggle mobile menu"
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-menu"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right"
                aria-label="Mobile navigation menu"
                id="mobile-menu"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-6">
                    <Logo className="text-sm" onClick={() => setIsMobileMenuOpen(false)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    {renderNavLinks(true)}
                    <Separator className="my-2" />
                    <div className="border-t pt-4 mt-2 flex flex-col gap-2">
                         <Button variant="ghost" asChild className="sm:hidden self-start flex items-center gap-2">
                            <a href="https://github.com/trainwithshubham" target="_blank" rel="noopener noreferrer">
                              <Github className="h-5 w-5" />
                              <span className="">GitHub</span>
                            </a>
                          </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
