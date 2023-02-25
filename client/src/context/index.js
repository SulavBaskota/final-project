import React, { useContext, createContext } from "react";
import { useToggle } from "@mantine/hooks";
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNetworkMismatch,
  useSigner,
} from "@thirdweb-dev/react";
import { adminAbi, adminContractAddress } from "@component/constants";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [isLoading, toggleIsLoading] = useToggle([false, true]);
  const [role, toogleRole] = useToggle([null, "admin", "super"]);

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

  const isAdmin = async () => await adminContract.isAdmin(address);

  const isSuperAdmin = async () => await adminContract.isSuperAdmin();

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

  const updateRole = async () => {
    if (!address) {
      toogleRole(null);
      return;
    }
    if (!isAdmin) {
      toogleRole(null);
      return;
    }
    isSuperAdmin ? toogleRole("super") : toogleRole("admin");
  };

  const getAdmins = async () => {
    toggleIsLoading(true);
    const admins = await adminContract.getAdmins();
    toggleIsLoading(false);
    return admins.slice(1);
  };

  return (
    <StateContext.Provider
      value={{
        address,
        connectWallet,
        disconnectWallet,
        role,
        updateRole,
        getAdmins,
        isMismatched,
        isLoading,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
