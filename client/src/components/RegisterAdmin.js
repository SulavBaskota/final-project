import { useState } from "react";
import { ethers } from "ethers";
import { Button, Modal, Stack, Box, TextInput } from "@mantine/core";
import { useStateContext } from "@component/context";
import {
  showSuccessNotification,
  showErrorNotification,
} from "@component/utils";

export default function RegisterAdmin({ opened, setOpened, fetchAdmins }) {
  const [newAddress, setNewAddress] = useState("");
  const { toggleIsLoading, registerAdmin, getRevertMessage } =
    useStateContext();

  const handleRegister = async () => {
    if (ethers.utils.isAddress(newAddress)) {
      try {
        toggleIsLoading(true);
        const txResponse = await registerAdmin(newAddress);
        await txResponse.wait();
        handleClose();
        showSuccessNotification("Admin address registered");
        await fetchAdmins();
      } catch (e) {
        const revertMessage = getRevertMessage(e);
        showErrorNotification(revertMessage);
      } finally {
        toggleIsLoading(false);
      }
    } else {
      showErrorNotification("Invalid Address");
    }
  };

  const handleClose = () => {
    setNewAddress("");
    setOpened(false);
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Add Admin">
      <Stack>
        <TextInput
          placeholder="0x1111111111111111111111111111111111111111"
          label="Address"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          data-autofocus
          autoComplete="off"
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleRegister}>Register</Button>
        </Box>
      </Stack>
    </Modal>
  );
}
