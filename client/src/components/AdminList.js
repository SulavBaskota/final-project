import { useStateContext } from "@component/context";
import { Table, ActionIcon, Center } from "@mantine/core";
import { IconUserX } from "@tabler/icons";

export default function AdminList({ rows, activePage, itemPerPage, setPage }) {
  const { deleteAdmin, updateAdmins, toggleIsLoading } = useStateContext();

  const handleDelete = async (adminAddress) => {
    try {
      toggleIsLoading(true);
      const res = await deleteAdmin(adminAddress);
      console.log(res);
      await res.wait();
      await updateAdmins();
    } catch (e) {
      console.log(e);
    } finally {
      setPage(1);
      toggleIsLoading(false);
    }
  };

  return (
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
                <ActionIcon color="red" onClick={() => handleDelete(item)}>
                  <IconUserX size={16} />
                </ActionIcon>
              </Center>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
