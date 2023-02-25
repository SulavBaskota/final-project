import {
  IconPencilPlus,
  IconHome,
  IconJewishStar,
  IconCheckupList,
  IconTruckDelivery,
  IconUsers,
} from "@tabler/icons";

const iconSize = 16;

export const USER_MENU = [
  {
    label: "Home",
    icon: <IconHome size={iconSize} />,
    href: "/",
    color: "blue",
  },
  {
    label: "Create Auction",
    icon: <IconPencilPlus size={iconSize} />,
    href: "/auction/create-auction",
    color: "teal",
  },
  {
    label: "My Wishlist",
    icon: <IconJewishStar size={iconSize} />,
    href: "/my-wishlist",
    color: "grape",
  },
];

export const ADMIN_MENU = [
  {
    label: "Verify Auction",
    icon: <IconCheckupList size={iconSize} />,
    href: "/admin/verify-auction",
    color: "orange",
  },
  {
    label: "Ship Item",
    icon: <IconTruckDelivery size={iconSize} />,
    href: "/admin/ship-item",
    color: "violet",
  },
];

export const SUPER_ADMIN_MENU = [
  {
    label: "Manage Admins",
    icon: <IconUsers size={iconSize} />,
    href: "/super/manage-admins",
    color: "gray",
  },
];
