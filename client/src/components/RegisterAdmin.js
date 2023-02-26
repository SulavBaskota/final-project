import { Button, Modal, Stack, Box, TextInput } from "@mantine/core";

export default function RegisterAdmin({
  opened,
  setOpened,
  newAddress,
  setNewAddress,
  handleRegister,
}) {
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} title="Add Admin">
        <Stack>
          <TextInput
            placeholder="0x1111111111111111111111111111111111111111"
            label="Address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleRegister}>Register</Button>
          </Box>
        </Stack>
      </Modal>
    </>
  );
}
