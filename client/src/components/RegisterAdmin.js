import { useState } from "react";
import { ethers } from "ethers";
import { Button, Modal, Stack, Box, TextInput } from "@mantine/core";
import { useStateContext } from "@component/context";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";

export default function RegisterAdmin({ opened, setOpened }) {
  const [newAddress, setNewAddress] = useState("");
  const [error, setError] = useState("");
  const { updateAdmins, toggleIsLoading, registerAdmin, getRevertMessage } =
    useStateContext();

  const handleRegister = async () => {
    if (ethers.utils.isAddress(newAddress)) {
      try {
        toggleIsLoading(true);
        const res = await registerAdmin(newAddress);
        await res.wait();
        showNotification({
          autoClose: 5000,
          title: "Success!!",
          message: "Admin address registered",
          color: "teal",
          icon: <IconCheck size={20} />,
        });
        await updateAdmins();
      } catch (e) {
        const revertMessage = getRevertMessage(e);
        showNotification({
          autoClose: 5000,
          title: "Failed!!",
          message: revertMessage,
          color: "red",
          icon: <IconX size={20} />,
        });
      } finally {
        setNewAddress("");
        setOpened(false);
        toggleIsLoading(false);
      }
    } else {
      setError("Invalid Address");
    }
  };

  const handleClose = () => {
    setError("");
    setNewAddress("");
    setOpened(false);
  };

  return (
    <>
      <Modal opened={opened} onClose={handleClose} title="Add Admin">
        <Stack>
          <TextInput
            placeholder="0x1111111111111111111111111111111111111111"
            label="Address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            error={error}
            data-autofocus
            autoComplete="off"
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleRegister}>Register</Button>
          </Box>
        </Stack>
      </Modal>
    </>
  );
}
