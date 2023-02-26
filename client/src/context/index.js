import { createContext, useContext, useState } from "react";
import { ethers } from "ethers";
import { adminAbi, adminContractAddress } from "@component/constants";
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNetworkMismatch,
  useSigner,
} from "@thirdweb-dev/react";
import { useToggle } from "@mantine/hooks";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [isLoading, toggleIsLoading] = useToggle([false, true]);
  const [role, toggleRole] = useToggle([null, "admin", "super"]);
  const [admins, setAdmins] = useState([]);

  const address = useAddress();
  const connect = useMetamask();
  const disconnect = useDisconnect();
  const isMismatched = useNetworkMismatch();
  const signer = useSigner();

  const adminContract = new ethers.Contract(
    adminContractAddress,
    adminAbi,
    signer
  );

  const connectWallet = async () => {
    toggleIsLoading(true);
    await connect();
    toggleIsLoading(false);
  };

  const disconnectWallet = async () => {
    toggleIsLoading(true);
    await disconnect();
    toggleIsLoading(false);
  };

  const registerAdmin = async (adminAddress) => {
    const res = await adminContract.registerAdmin(adminAddress);
    return res;
  };

  const deleteAdmin = async (adminAddress) => {
    const res = await adminContract.unregisterAdmin(adminAddress);
    return res;
  };

  const isAdmin = async () => await adminContract.isAdmin(address);

  const isSuperAdmin = async () => await adminContract.isSuperAdmin();

  const updateAdmins = async () => {
    if (adminContract) {
      const adminList = await adminContract.getAdmins();
      setAdmins(adminList.slice(1));
    }
  };

  const updateRole = async () => {
    if (!address) {
      toggleRole(null);
      return;
    }
    const admin = await isAdmin();
    if (!admin) {
      toggleRole(null);
      return;
    }
    const superAdmin = await isSuperAdmin();
    superAdmin ? toggleRole("super") : toggleRole("admin");
  };

  return (
    <StateContext.Provider
      value={{
        address,
        admins,
        connectWallet,
        deleteAdmin,
        disconnectWallet,
        isMismatched,
        isLoading,
        registerAdmin,
        role,
        toggleIsLoading,
        updateAdmins,
        updateRole,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
