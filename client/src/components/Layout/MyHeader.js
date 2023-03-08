import {
  Header,
  MediaQuery,
  Text,
  Burger,
  useMantineTheme,
  UnstyledButton,
  Group,
} from "@mantine/core";
import logo from "/public/logo.png";
import Image from "next/image";
import Link from "next/link";
import ColorSchemeToggle from "../ColorSchemeToogle";

export default function MyHeader({ opened, setOpened }) {
  const theme = useMantineTheme();
  return (
    <Header height={{ base: 50, md: 70 }} p="md">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        <UnstyledButton component={Link} href="/">
          <Group spacing="xs">
            <Image src={logo} alt="Website logo" priority width={35} />
            <Text tt="capitalize" fz="lg" fw={700}>
              D-Auction
            </Text>
          </Group>
        </UnstyledButton>

        <Group spacing="xs">
          <ColorSchemeToggle />
        </Group>
      </div>
    </Header>
  );
}
