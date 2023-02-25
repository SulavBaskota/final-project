import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { Button, Text, ThemeIcon, UnstyledButton, Group } from "@mantine/core";
import { IconWallet } from "@tabler/icons";
import { buttonStyles } from "@component/styles/customStyles";
import { useStateContext } from "@component/context";

export default function ConnectWallet() {
  const { address, isLoading, connectWallet, disconnectWallet } =
    useStateContext();

  return (
    <>
      {!address ? (
        <Button
          leftIcon={<IconWallet size={16} />}
          fullWidth
          size="lg"
          onClick={connectWallet}
          loading={isLoading}
        >
          Connect Wallet
        </Button>
      ) : (
        <UnstyledButton sx={buttonStyles} onClick={disconnectWallet}>
          <Group>
            <ThemeIcon variant="light" radius="xl" size="xl">
              <Jazzicon diameter={35} seed={jsNumberForAddress(address)} />
            </ThemeIcon>
            <Text fw={700} truncate>
              {address.slice(0, 6)}....
              {address.slice(address.length - 4)}
            </Text>
          </Group>
        </UnstyledButton>
      )}
    </>
  );
}
