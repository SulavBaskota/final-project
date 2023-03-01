import { Stack, Button, Grid, Center, Text } from "@mantine/core";
import { IconUserPlus } from "@tabler/icons";
import Image from "next/image";
import usersPic from "public/users.png";

export default function EmptyAdminList({ setOpened }) {
  return (
    <Grid justify="center" align="center">
      <Grid.Col xs={12} md={6}>
        <Center>
          <Image src={usersPic} alt="users" width={400} height={400} priority />
        </Center>
      </Grid.Col>
      <Grid.Col xs={12} md={6}>
        <Center>
          <Stack>
            <Text fz={20} fw={700}>
              No Admin Address Registered
            </Text>
            <Button
              variant="gradient"
              gradient={{ from: "teal", to: "blue", deg: 60 }}
              size="xl"
              leftIcon={<IconUserPlus size={25} />}
              onClick={() => setOpened(true)}
            >
              Add Admin
            </Button>
          </Stack>
        </Center>
      </Grid.Col>
    </Grid>
  );
}
