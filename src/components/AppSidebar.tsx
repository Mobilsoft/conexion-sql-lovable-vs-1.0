
import {
  LayoutDashboard,
  Users,
  Shield,
  Database,
  BookOpen,
  Building2
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  {
    title: "TaskMaster",
    icon: LayoutDashboard,
    url: "/",
    isHeader: true
  },
  {
    title: "MAESTROS",
    icon: BookOpen,
    url: "#",
    isSection: true
  },
  {
    title: "Registro de Clientes",
    icon: Users,
    url: "/clientes"
  },
  {
    title: "Registro de Compañías",
    icon: Building2,
    url: "/companies"
  },
  {
    title: "SEGURIDAD",
    icon: Shield,
    url: "#",
    isSection: true
  },
  {
    title: "Configurar Conexión",
    icon: Database,
    url: "/",
  },
  {
    title: "Diccionario de Datos",
    icon: Database,
    url: "/diccionario-datos"
  }
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.isHeader ? (
                    <div className="px-3 py-4 flex items-center gap-2 text-lg font-semibold text-sidebar-foreground">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </div>
                  ) : item.isSection ? (
                    <div className="px-3 py-2 text-sm font-semibold text-sidebar-foreground/60">
                      {item.title}
                    </div>
                  ) : (
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={cn(
                          "w-full",
                          location.pathname === item.url && "bg-sidebar-accent"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
