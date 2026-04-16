import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useClerk, useUser as useClerkUser } from "@clerk/react";
import { useUser } from "@/lib/user-context";
import { Button } from "@/components/ui/button";
import { Home, HelpCircle, Info, Mail, PlusCircle, LogOut, UserRound, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useUser();
  const { signOut } = useClerk();
  const { isSignedIn } = useClerkUser();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Mail },
    { href: "/community", label: "Community", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navbar with shifting opal gradient effect */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-opal-gradient animate-gradient-xy" />
        
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-opal-gradient animate-gradient-x flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 transition-transform">
              O
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden sm:inline-block">
              Opal Zeta
            </span>
          </Link>

          <nav className="flex items-center gap-1 md:gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              
              return (
                <Link key={item.href} href={item.href} className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}>
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline-block">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {isSignedIn ? (
              <Link href="/ask" className="hidden sm:flex">
                <Button size="sm" className="rounded-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all">
                  <PlusCircle className="w-4 h-4" /> Ask Question
                </Button>
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/sign-in">
                  <Button size="sm" variant="ghost" className="rounded-full gap-2">
                    <LogIn className="w-4 h-4" /> Sign in
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" className="rounded-full bg-primary text-primary-foreground">Sign up</Button>
                </Link>
              </div>
            )}
            
            <div className="h-8 w-[1px] bg-border mx-2 hidden sm:block" />
            
            {isSignedIn ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium leading-none">{user?.displayName ?? "Member"}</span>
                <span className="text-xs text-muted-foreground font-mono">{user?.reputation ?? 0} rep</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 p-[2px] shadow-sm">
                <div className="h-full w-full rounded-full bg-background overflow-hidden flex items-center justify-center">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.displayName} className="h-full w-full object-cover" />
                  ) : (
                    <UserRound className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => { logout(); signOut({ redirectUrl: `${import.meta.env.BASE_URL}` }); }} title="Sign out">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {children}
      </main>

      {/* Mobile Ask Button FAB */}
      {isSignedIn && <div className="fixed bottom-6 right-6 sm:hidden z-50">
        <Link href="/ask">
          <Button size="icon" className="h-14 w-14 rounded-full shadow-xl bg-opal-gradient animate-gradient-xy border-0">
            <PlusCircle className="w-6 h-6 text-white" />
          </Button>
        </Link>
      </div>}
    </div>
  );
}
