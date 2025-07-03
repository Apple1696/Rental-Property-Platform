import {  Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authService } from "@/services/authentication";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar1 = ({
  logo = {
    url: "/",
    src: "/images/navbar/2.png",
    alt: "logo",
    title: "NLR"
  },
  menu = [
    { title: "Home", url: "/" },
    { title: "Properties", url: "/properties" },
    // {
    //   title: "List Your Property",
    //   url: "#",
    //   items: [
    //     {
    //       title: "How it Works",
    //       description: "Learn about the process of listing your property on our platform",
    //       icon: <Book className="size-5 shrink-0" />,
    //       url: "#",
    //     },
    //     {
    //       title: "Hosting Guidelines",
    //       description: "Essential information and requirements for property hosts",
    //       icon: <Trees className="size-5 shrink-0" />,
    //       url: "#",
    //     },
    //     {
    //       title: "Pricing & Fees",
    //       description: "Understand our pricing structure and commission rates",
    //       icon: <Sunset className="size-5 shrink-0" />,
    //       url: "#",
    //     },
    //     {
    //       title: "Host Resources",
    //       description: "Access tools and guides to help you succeed as a host",
    //       icon: <Zap className="size-5 shrink-0" />,
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "My Bookings",
      url: "/my-bookings",
    },
    {
      title: "Switch to Hosting",
      url: "/hosting",
    },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "/login?signup=true" },
  },
}: Navbar1Props) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInitials, setUserInitials] = useState("U");

  const checkAuth = () => {
    const isAuth = authService.isAuthenticated();
    setIsAuthenticated(isAuth);
    // TODO: Get user data from localStorage or API
    // For now, using placeholder initials
    setUserInitials("U");
  };

  useEffect(() => {
    // Check auth state when component mounts
    checkAuth();

    // Listen for storage events (logout from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        checkAuth();
      }
    };

    // Listen for custom auth change events
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChange', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigate('/login');
  };


const renderAuthButtons = () => {
  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleLogout}
          className="h-8 w-8 rounded-full p-0 text-white hover:bg-white/10"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button asChild variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
        <a href={auth.login.url}>{auth.login.title}</a>
      </Button>
      <Button asChild size="sm" className="bg-white text-[#B03F4A] hover:bg-white/90">
        <a href={auth.signup.url}>{auth.signup.title}</a>
      </Button>
    </>
  );
};

  return (
    <section className="py-4" style={{ backgroundColor: '#B03F4A' }}>
      <div className="container  mx-auto">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-3">
              {/* <img src={logo.src} className="max-h-8" alt={logo.alt} /> */}
              <span className="text-white text-xl font-semibold">{logo.title}</span>
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {renderAuthButtons()}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-3">
              <img src={logo.src} className="max-h-12" alt={logo.alt} />
              <span className="text-white text-xl font-semibold">{logo.title}</span>
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a href={logo.url} className="flex items-center gap-3">
                      <img src={logo.src} className="max-h-12" alt={logo.alt} />
                      <span className="text-white text-xl font-semibold">{logo.title}</span>
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    {isAuthenticated ? (
                      <>
                        <Button asChild variant="outline" onClick={() => navigate('/profile')}>
                          <span>Profile</span>
                        </Button>
                        <Button asChild onClick={handleLogout}>
                          <span>Log out</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button asChild variant="outline">
                          <a href={auth.login.url}>{auth.login.title}</a>
                        </Button>
                        <Button asChild>
                          <a href={auth.signup.url}>{auth.signup.title}</a>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger className="text-white bg-transparent hover:bg-white/10">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="bg-white text-foreground">
          <div className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
            {item.items.map((subItem) => (
              <NavigationMenuLink asChild key={subItem.title}>
                <a
                  className="flex select-none flex-row gap-4 rounded-md p-4 no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                  href={subItem.url}
                >
                  <div className="text-foreground">{subItem.icon}</div>
                  <div className="flex flex-col gap-1">
                    <div className="text-base font-medium leading-none">{subItem.title}</div>
                    {subItem.description && (
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {subItem.description}
                      </p>
                    )}
                  </div>
                </a>
              </NavigationMenuLink>
            ))}
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <a
              key={subItem.title}
              href={subItem.url}
              className="flex select-none flex-row gap-4 rounded-md p-4 no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
            >
              <div className="text-foreground">{subItem.icon}</div>
              <div className="flex flex-col gap-1">
                <div className="text-base font-medium leading-none">{subItem.title}</div>
                {subItem.description && (
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {subItem.description}
                  </p>
                )}
              </div>
            </a>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

export { Navbar1 };
