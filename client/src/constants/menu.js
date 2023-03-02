import {
  IconPencilPlus,
  IconHome,
  IconCheckupList,
  IconTruckDelivery,
  IconUsers,
  IconBookmarks,
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
    label: "Bookmarks",
    icon: <IconBookmarks size={iconSize} />,
    href: "/bookmarks",
    color: "grape",
  },
];

export const ADMIN_MENU = [
  {
    label: "Evaluate Auctions",
    icon: <IconCheckupList size={iconSize} />,
    href: "/admin/evaluate-auctions",
    color: "orange",
  },
  {
    label: "Ship Items",
    icon: <IconTruckDelivery size={iconSize} />,
    href: "/admin/ship-items",
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
