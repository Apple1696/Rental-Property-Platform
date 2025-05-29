interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface Footer2Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer2 = ({
  
  menuItems = [
    {
      title: "Explore",
      links: [
        { text: "Search Properties", url: "/search" },
        { text: "Featured Listings", url: "/featured" },
        { text: "Popular Destinations", url: "/destinations" },
        { text: "Last Minute Deals", url: "/deals" },
        { text: "Long-term Rentals", url: "/long-term" },
        { text: "Luxury Stays", url: "/luxury" },
      ],
    },
    {
      title: "Host",
      links: [
        { text: "Become a Host", url: "/become-host" },
        { text: "Host Resources", url: "/host-resources" },
        { text: "Success Stories", url: "/success-stories" },
        { text: "Host Guidelines", url: "/guidelines" },
        { text: "Host Support", url: "/host-support" },
        { text: "Hosting Tools", url: "/tools" },
      ],
    },
    {
      title: "Support",
      links: [
        { text: "Help Center", url: "/help" },
        { text: "Guest Support", url: "/guest-support" },
        { text: "Cancellation Options", url: "/cancellation" },
        { text: "Safety Center", url: "/safety" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About Us", url: "/about" },
        { text: "Careers", url: "/careers" },
        { text: "Press", url: "/press" },
        { text: "Contact", url: "/contact" },
      ],
    },
  ],
  copyright = "© 2024 Nón Lá Retreat. All rights reserved.",
  bottomLinks = [
    { text: "Terms of Service", url: "/terms" },
    { text: "Privacy Policy", url: "/privacy" },
    { text: "Cookie Settings", url: "/cookies" },
    { text: "Sitemap", url: "/sitemap" },
  ],
}: Footer2Props) => {
  return (
    <section className="py-32">
      <div className="container mx-auto">
        <footer>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
           
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="space-y-4 text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      <a href={link.url}>{link.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
            <p>{copyright}</p>
            <ul className="flex gap-4">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx} className="underline hover:text-primary">
                  <a href={link.url}>{link.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer2 };
