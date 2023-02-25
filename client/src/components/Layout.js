import { useState } from "react";
import { AppShell, useMantineTheme } from "@mantine/core";
import MyNavbar from "./MyNavbar";
import MyHeader from "./MyHeader";

export default function Layout({ children }) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={<MyNavbar opened={opened} />}
      header={<MyHeader opened={opened} setOpened={setOpened} />}
    >
      {children}
    </AppShell>
  );
}
