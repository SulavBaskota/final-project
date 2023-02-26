import { useEffect } from "react";
import {
  Navbar,
  Text,
  UnstyledButton,
  Group,
  ThemeIcon,
  Divider,
  Alert,
} from "@mantine/core";
import Link from "next/link";
import ConnectWallet from "./ConnectWallet";
import { buttonStyles } from "@component/styles/customStyles";
import {
  USER_MENU,
  ADMIN_MENU,
  SUPER_ADMIN_MENU,
} from "@component/constants/menu";
import { IconAlertCircle } from "@tabler/icons";
import { useStateContext } from "@component/context";

const CreateMenu = ({ item }) => (
  <UnstyledButton sx={buttonStyles} component={Link} href={item.href}>
    <Group>
      <ThemeIcon color={item.color} variant="light">
        {item.icon}
      </ThemeIcon>
      <Text fz="sm">{item.label}</Text>
    </Group>
  </UnstyledButton>
);

export default function MyNavbar({ opened }) {
  const { address, role, updateRole, isMismatched } = useStateContext();

  useEffect(() => {
    updateRole();
  }, [address]);

  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 250, lg: 300 }}
    >
      <Navbar.Section grow={role ? false : true}>
        {USER_MENU.map((item, index) => (
          <CreateMenu item={item} key={index} />
        ))}
      </Navbar.Section>
      {role !== null && (role === "admin" || role === "super") && (
        <>
          <Divider my="sm" />
          <Navbar.Section grow={role === "admin" ? true : false}>
            {ADMIN_MENU.map((item, index) => (
              <CreateMenu item={item} key={index} />
            ))}
          </Navbar.Section>
        </>
      )}
      {role && role === "super" && (
        <>
          <Divider my="sm" />
          <Navbar.Section grow>
            {SUPER_ADMIN_MENU.map((item, index) => (
              <CreateMenu item={item} key={index} />
            ))}
          </Navbar.Section>
        </>
      )}
      {isMismatched && (
        <>
          <Divider my="sm" />
          <Navbar.Section>
            <Alert
              color="red"
              title="!Warning"
              icon={<IconAlertCircle size={16} />}
            >
              Please switch to a supported chain. The supported Chain Id is:
              1337
            </Alert>
          </Navbar.Section>
        </>
      )}
      <Divider my="sm" />
      <Navbar.Section>
        <ConnectWallet />
      </Navbar.Section>
    </Navbar>
  );
}
