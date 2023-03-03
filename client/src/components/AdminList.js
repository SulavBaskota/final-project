import { useStateContext } from "@component/context";
import { Table, ActionIcon, Center } from "@mantine/core";
import { IconUserX, IconCheck, IconX } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";

export default function AdminList({
  rows,
  activePage,
  itemPerPage,
  setPage,
  fetchAdmins,
}) {
  const { deleteAdmin, toggleIsLoading, getRevertMessage } = useStateContext();

  const handleDelete = async (adminAddress) => {
    try {
      toggleIsLoading(true);
      const res = await deleteAdmin(adminAddress);
      await res.wait();
      showNotification({
        autoClose: 5000,
        title: "Success!!",
        message: "Admin address unregistered",
        color: "teal",
        icon: <IconCheck size={20} />,
      });
      await fetchAdmins();
      if (rows.length === 1) {
        setPage(activePage - 1);
      }
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
