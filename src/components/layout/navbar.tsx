
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Github, LogIn, Menu, X, Home, FileQuestion, Briefcase, Users, Terminal, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Separator } from '../ui/separator';
import { useAuth } from '@/contexts/auth-context';
import { Skeleton } from '../ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/interview-questions', label: 'Interview Questions', icon: FileQuestion },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: 'https://discord.gg/kGEr9mR5gT', label: 'Join Us', external: true, icon: Users },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, signInWithGitHub, signInWithGoogle, logout } = useAuth();

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

  const renderLoginOptions = () => (
    <>
        <DropdownMenuItem onClick={() => {signInWithGitHub(); setIsMobileMenuOpen(false);}}>
            <Github className="mr-2 h-4 w-4" />
            <span>Login with GitHub</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {signInWithGoogle(); setIsMobileMenuOpen(false);}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M15.5 16.5c-2-1-3.1-2.5-3.5-4.5M12 12h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/><path d="m11.5 7.5-.5 4.5"/></svg>
            <span>Login with Google</span>
        </DropdownMenuItem>
    </>
  )

  const renderUserMenu = () => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                    <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                    </p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {logout(); setIsMobileMenuOpen(false);}}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link 
          href="/" 
          className="mr-auto flex items-center space-x-2"
          aria-label="TWS Community Hub - Home"
        >
          <Terminal className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="font-bold sm:inline-block">
            <span className="text-primary">TrainWithShubham</span>
            <span className="text-accent">@</span>
            <span className="text-green-500">Community</span>
            <span>:~#</span>
          </span>
        </Link>
        <nav 
          id="navigation"
          className="hidden md:flex items-center gap-1 text-sm"
          role="navigation"
          aria-label="Main navigation"
        >
          {renderNavLinks()}
        </nav>
        <div className="flex items-center justify-end space-x-2 ml-4">
          <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
            <a href="https://github.com/trainwithshubham" target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
          <div className="hidden sm:flex items-center gap-2">
            {loading ? (
                <Skeleton className="h-8 w-20" />
            ) : user ? (
                renderUserMenu()
            ) : (
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button>
                          <LogIn className="mr-2 h-4 w-4" /> Login
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                      {renderLoginOptions()}
                  </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
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
                     <Link 
                       href="/" 
                       className="font-bold flex items-center space-x-2" 
                       onClick={() => setIsMobileMenuOpen(false)}
                       aria-label="TWS Community Hub - Home"
                     >
                        <Terminal className="h-6 w-6 text-primary" aria-hidden="true" />
                        <span className="text-sm">
                            <span className="text-primary">TrainWithShubham</span>
                            <span className="text-accent">@</span>
                            <span className="text-green-500">Community</span>
                            <span>:~#</span>
                        </span>
                      </Link>
                  </div>
                  <div className="flex flex-col gap-2">
                    {renderNavLinks(true)}
                    <Separator className="my-2" />
                    {loading ? (
                        <Skeleton className="h-10 w-full" />
                    ) : user ? (
                        <>
                           <div className="flex items-center gap-4 px-2 py-1.5">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                                    <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{user.displayName}</span>
                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                </div>
                            </div>
                            <Button onClick={() => {logout(); setIsMobileMenuOpen(false);}} className="w-full justify-start">
                                <LogOut className="mr-2 h-4 w-4" /> Logout
                            </Button>
                        </>
                    ) : (
                     <div className="flex flex-col gap-2">
                        <Button onClick={() => {signInWithGitHub(); setIsMobileMenuOpen(false)}} className="w-full justify-start">
                            <Github className="mr-2 h-4 w-4" /> Login with GitHub
                        </Button>
                        <Button onClick={() => {signInWithGoogle(); setIsMobileMenuOpen(false)}} className="w-full justify-start">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M15.5 16.5c-2-1-3.1-2.5-3.5-4.5M12 12h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/><path d="m11.5 7.5-.5 4.5"/></svg>
                            Login with Google
                        </Button>
                     </div>
                    )}
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
