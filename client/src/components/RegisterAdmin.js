import { useState } from "react";
import { ethers } from "ethers";
import { Button, Modal, Stack, Box, TextInput } from "@mantine/core";
import { useStateContext } from "@component/context";

export default function RegisterAdmin({ opened, setOpened }) {
  const [newAddress, setNewAddress] = useState("");
  const [error, setError] = useState("");
  const { updateAdmins, toggleIsLoading, registerAdmin } = useStateContext();

  const handleRegister = async () => {
    if (ethers.utils.isAddress(newAddress)) {
      try {
        toggleIsLoading(true);
        const res = await registerAdmin(newAddress);
        console.log(res);
        await res.wait();
        await updateAdmins();
      } catch (e) {
        console.log(e.message);
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
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleRegister}>Register</Button>
          </Box>
        </Stack>
      </Modal>
    </>
  );
}
