import { useStateContext } from "@component/context";
import { Table, ActionIcon, Center } from "@mantine/core";
import { IconUserX } from "@tabler/icons";
import {
  showSuccessNotification,
  showErrorNotification,
} from "@component/utils";

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
      const txResponse = await deleteAdmin(adminAddress);
      await txResponse.wait();
      showSuccessNotification("Admin address unregistered");
      await fetchAdmins();
      if (rows.length === 1) {
        setPage(activePage - 1);
      }
    } catch (e) {
      const revertMessage = getRevertMessage(e);
      showErrorNotification(revertMessage);
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
