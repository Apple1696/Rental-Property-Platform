import * as React from "react"
import { CalendarDays, ChevronRight, GalleryVerticalEnd, Home, LayoutDashboard, LogOut, Settings, Star, Users } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { authService } from "@/services/authentication"


// Admin navigation data
const data = {
  // Regular navigation items
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: "LayoutDashboard"
    },
    {
      title: "Properties",
      url: "/admin/properties",
      icon: "Home"
    },
     {
      title: "Finance",
      icon: "CalendarDays",
      url: "/admin/finance",
    },
    {
      title: "Reviews",
      url: "/admin/reviews",
      icon: "Star"
    },

  ],
  // Collapsible sections
  collapsibleSections: [

    {
      title: "Users",
      icon: "Users",
      items: [
        {
          title: "Guests",
          url: "/admin/users"
        },
        {
          title: "Hosts",
          url: "/admin/hosts"
        }
      ]
    },

    {
      title: "Settings",
      icon: "Settings",
      items: [
        {
          title: "General Settings",
          url: "/admin/settings"
        },
        {
          title: "Appearance",
          url: "/admin/settings/appearance"
        },
        {
          title: "Notifications",
          url: "/admin/settings/notifications"
        }
      ]
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Function to get the icon component based on the icon name
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "LayoutDashboard": return <LayoutDashboard className="size-4" />;
      case "Home": return <Home className="size-4" />;
      case "CalendarDays": return <CalendarDays className="size-4" />;
      case "Users": return <Users className="size-4" />;
      case "Star": return <Star className="size-4" />;
      case "Settings": return <Settings className="size-4" />;
      default: return null;
    }
  };

  // Handle logout function
  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login'; // Redirect to login page after logout
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">NLR</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Regular navigation items */}
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="flex items-center gap-3">
                    {getIcon(item.icon)}
                    {item.title}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Separator between regular and collapsible items */}
        <div className="my-2 border-t border-border" />

        {/* Collapsible sections */}
        <SidebarGroup>
          <SidebarMenu>
            {data.collapsibleSections.map((section) => (
              <Collapsible key={section.title} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild className="w-full">
                    <SidebarMenuButton>
                      <div className="flex items-center gap-3">
                        {getIcon(section.icon)}
                        {section.title}
                      </div>
                      <ChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {section.items.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={item.url}>{item.title}</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          Logout
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
