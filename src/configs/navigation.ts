import {
  CalendarDays,
  Images,
  LayoutDashboard,
  PenTool,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const navigation: NavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    description: "Studio overview",
    icon: LayoutDashboard,
  },
  {
    href: "/bookings",
    label: "Bookings",
    description: "Requests and schedule",
    icon: CalendarDays,
  },
  {
    href: "/portfolio",
    label: "Portfolio",
    description: "Public gallery",
    icon: Images,
  },
  {
    href: "/merch",
    label: "Merch",
    description: "Products and drops",
    icon: ShoppingBag,
  },
  {
    href: "/design",
    label: "Designs",
    description: "Flash and originals",
    icon: PenTool,
  },
];

export function getNavItem(pathname: string): NavItem | undefined {
  return navigation.find((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  );
}
