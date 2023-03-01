import {
  Pagination,
  Stack,
  Container,
  Button,
  Box,
  MediaQuery,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useStateContext } from "@component/context";
import { IconUserPlus } from "@tabler/icons";
import Custom401 from "../401";
import RegisterAdmin from "@component/components/RegisterAdmin";
import AdminList from "@component/components/AdminList";
import EmptyAdminList from "@component/components/EmptyAdminList";

export default function ManageAdmins() {
  const { role, admins, updateAdmins } = useStateContext();
  const [activePage, setPage] = useState(1);
  const [opened, setOpened] = useState(false);
  const [total, setTotal] = useState(1);
  const [rows, setRows] = useState([]);

  const itemPerPage = 5;

  const fetchAdmins = async () => {
    await updateAdmins();
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
          <RegisterAdmin opened={opened} setOpened={setOpened} />
          {admins.length > 0 ? (
            <Stack>
              <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <AddAdminButton />
                </Box>
              </MediaQuery>
              <AdminList
                rows={rows}
                activePage={activePage}
                itemPerPage={itemPerPage}
                setPage={setPage}
              />
              <Pagination page={activePage} onChange={setPage} total={total} />
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <AddAdminButton />
                </Box>
              </MediaQuery>
            </Stack>
          ) : (
            <EmptyAdminList setOpened={setOpened} />
          )}
        </Container>
      ) : (
        <Custom401 />
      )}
    </>
  );
}
