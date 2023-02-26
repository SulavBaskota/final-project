import { useState } from "react";
import { AppShell, useMantineTheme, LoadingOverlay } from "@mantine/core";
import MyNavbar from "./MyNavbar";
import MyHeader from "./MyHeader";
import { useStateContext } from "@component/context";

export default function Layout({ children }) {
  const theme = useMantineTheme();
  const { isLoading } = useStateContext();
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
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      {children}
    </AppShell>
  );
}
