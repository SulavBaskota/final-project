import React, { useContext, createContext, useState } from "react";
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
  const [role, toggleRole] = useToggle([null, "admin", "super"]);

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

  const getAdmins = async () => {
    const admins = await adminContract.getAdmins();
    return admins.slice(1);
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
        connectWallet,
        disconnectWallet,
        role,
        updateRole,
        getAdmins,
        registerAdmin,
        deleteAdmin,
        isMismatched,
        isLoading,
        toggleIsLoading,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
