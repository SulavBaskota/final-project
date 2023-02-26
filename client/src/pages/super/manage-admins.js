import {
  Table,
  Pagination,
  Stack,
  Container,
  Button,
  Box,
  MediaQuery,
  ActionIcon,
  Center,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useStateContext } from "@component/context";
import { IconUserPlus, IconUserX } from "@tabler/icons";
import Custom401 from "../401";
import RegisterAdmin from "@component/components/RegisterAdmin";

export default function ManageAdmins() {
  const { role, getAdmins, registerAdmin, deleteAdmin, toggleIsLoading } =
    useStateContext();
  const [admins, setAdmins] = useState([]);
  const [activePage, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [rows, setRows] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [opened, setOpened] = useState(false);
  const itemPerPage = 5;

  const fetchAdmins = async () => {
    const data = await getAdmins();
    setAdmins(data);
  };

  useEffect(() => {
    if (role && role === "super") fetchAdmins();
  }, [role]);

  useEffect(() => {
    if (admins) {
      const count = Math.ceil(admins.length / itemPerPage);
      setTotal(count);
      const from = (activePage - 1) * itemPerPage;
      const to = activePage * itemPerPage;
      setRows(admins.slice(from, to));
    }
  }, [admins, activePage]);

  const handleRegister = async () => {
    if (ethers.utils.isAddress(newAddress)) {
      try {
        toggleIsLoading(true);
        const res = await registerAdmin(newAddress);
        console.log(res);
        await res.wait();
        fetchAdmins();
      } catch (e) {
        console.log(e);
      } finally {
        setNewAddress("");
        setOpened(false);
        toggleIsLoading(false);
      }
    }
  };

  const handleDelete = async (adminAddress) => {
    try {
      toggleIsLoading(true);
      const res = await deleteAdmin(adminAddress);
      console.log(res);
      await res.wait();
      fetchAdmins();
    } catch (e) {
      console.log(e);
    } finally {
      setPage(1);
      toggleIsLoading(false);
    }
  };

  const AddAdminButton = () => (
    <Button
      leftIcon={<IconUserPlus size={16} />}
      onClick={() => setOpened(true)}
    >
      Add Admin
    </Button>
  );

  return (
    <>
      {role && role === "super" ? (
        <Container>
          <Stack>
            <MediaQuery smallerThan="md" styles={{ display: "none" }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <AddAdminButton />
              </Box>
            </MediaQuery>
            <RegisterAdmin
              opened={opened}
              setOpened={setOpened}
              newAddress={newAddress}
              setNewAddress={setNewAddress}
              handleRegister={handleRegister}
            />
            <Table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Admin Address</th>
                  <th>
                    <Center>Action</Center>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item, index) => (
                  <tr key={index}>
                    <td>{(activePage - 1) * itemPerPage + (index + 1)}</td>
                    <td>{item}</td>
                    <td>
                      <Center>
                        <ActionIcon
                          color="red"
                          onClick={() => handleDelete(item)}
                        >
                          <IconUserX size={16} />
                        </ActionIcon>
                      </Center>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination page={activePage} onChange={setPage} total={total} />
            <MediaQuery largerThan="md" styles={{ display: "none" }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <AddAdminButton />
              </Box>
            </MediaQuery>
          </Stack>
        </Container>
      ) : (
        <Custom401 />
      )}
    </>
  );
}
