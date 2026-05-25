import * as React from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  IconLayoutDashboard,
  IconShoppingCart,
  IconToolsKitchen2,
  IconPackage,
  IconCreditCard,
  IconReceipt,
  IconChartBar,
  IconUsers,
  IconCoffee,
} from "@tabler/icons-react"

import { useAppSelector } from "@/hooks/useAppDispatch"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: IconLayoutDashboard },
  { to: "/orders", label: "Orders", icon: IconShoppingCart },
  { to: "/kitchen", label: "Kitchen Display", icon: IconToolsKitchen2 },
  { to: "/inventory", label: "Inventory", icon: IconPackage },
  { to: "/payments", label: "Payments", icon: IconCreditCard },
  { to: "/transactions", label: "Transactions", icon: IconReceipt },
  { to: "/reports", label: "Reports", icon: IconChartBar },
  { to: "/users", label: "Users", icon: IconUsers, adminOnly: true },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAppSelector((s) => s.auth)
  const location = useLocation()

  return (
    <Sidebar collapsible="icon" data-tour="sidebar" {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <IconCoffee className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-sm">BakeryPOS</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-tight">Enterprise</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2 py-2">
          {NAV_ITEMS.map(({ to, label, icon: Icon, adminOnly }) => {
            if (adminOnly && user?.role !== "admin" && user?.role !== "manager") return null
            const isActive = location.pathname === to || (to !== "/" && location.pathname.startsWith(to))

            return (
              <SidebarMenuItem key={to}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={label}
                  className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                >
                  <NavLink to={to}>
                    <Icon className="size-4" />
                    <span>{label}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-2 group-data-[collapsible=icon]:justify-center">
          <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary shrink-0">
            {user?.username?.charAt(0) || "A"}
          </div>
          <div className="flex flex-col min-w-0 leading-none group-data-[collapsible=icon]:hidden">
            <span className="text-xs font-medium truncate">{user?.username}</span>
            <span className="text-[10px] text-muted-foreground capitalize">{user?.role}</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
