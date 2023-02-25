import {
  Table,
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
export default function ManageAdmins() {
  const { role, getAdmins, isLoading } = useStateContext();
  const [admins, setAdmins] = useState([]);
  const [activePage, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [rows, setRows] = useState([]);
  const itemPerPage = 5;

  const fetchAdmins = async () => {
    const data = await getAdmins();
    setAdmins(data);
  };

  useEffect(() => {
    if (role === "super") fetchAdmins();
  }, [role]);

  useEffect(() => {
    if (admins) {
      setTotal(Math.ceil(admins.length / itemPerPage));
    }
  }, [admins]);

  useEffect(() => {
    const from = (activePage - 1) * itemPerPage;
    const to = activePage * itemPerPage;
    setRows(admins.slice(from, to));
  }, [activePage, total]);

  const AddAdminButton = () => (
    <Button leftIcon={<IconUserPlus size={18} />}>Add Admin</Button>
  );

  return (
    <>
      {role === "super" ? (
        <Container>
          <MediaQuery smallerThan="md" styles={{ display: "none" }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <AddAdminButton />
            </Box>
          </MediaQuery>
          <Table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Admin Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => (
                <tr key={index}>
                  <td>{index}</td>
                  <td>{item}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination page={activePage} onChange={setPage} total={total} />
        </Container>
      ) : (
        <Custom401 />
      )}
    </>
  );
}
