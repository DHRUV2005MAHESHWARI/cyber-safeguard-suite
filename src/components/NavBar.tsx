
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Wifi, Key, Activity, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const NavBar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { icon: Shield, label: 'Dashboard', path: '/' },
    { icon: Wifi, label: 'Network Scanner', path: '/network-scanner' },
    { icon: Key, label: 'Password Manager', path: '/password-manager' },
    { icon: Activity, label: 'System Monitor', path: '/system-monitor' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={cn(
      'fixed top-0 left-0 w-full z-50 transition-all duration-300',
      'py-4 px-6 backdrop-blur-md',
      scrolled ? 'bg-background/80 shadow-sm' : 'bg-transparent',
    )}>
      <div className="container flex items-center justify-between mx-auto">
        <Link to="/" className="flex items-center gap-2 animate-fade-in">
          <Shield className="w-7 h-7 text-primary" />
          <span className="font-bold text-xl tracking-tight">CyberGuard</span>
        </Link>

        {isMobile ? (
          <>
            <button 
              onClick={toggleMenu} 
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {isOpen && (
              <div className="fixed inset-0 top-[72px] bg-background/95 backdrop-blur-sm z-40 animate-fade-in">
                <div className="flex flex-col items-center justify-center h-full gap-10 py-10">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-5 py-3 rounded-full transition-all',
                        'text-lg font-medium animate-slide-up',
                        isActive(item.path)
                          ? 'text-primary font-semibold'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-1 animate-fade-in">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full transition-all',
                  isActive(item.path)
                    ? 'text-primary bg-primary/10 font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
