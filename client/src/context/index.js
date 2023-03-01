import { createContext, useContext, useState } from "react";
import { ethers } from "ethers";
import {
  adminAbi,
  adminContractAddress,
  blindAuctionFactoryAbi,
  blindAuctionFactoryContractAddress,
} from "@component/constants";
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNetworkMismatch,
  useSigner,
  useStorage,
  useStorageUpload,
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
  const storage = useStorage();
  const { mutateAsync: upload } = useStorageUpload();

  const adminContract = new ethers.Contract(
    adminContractAddress,
    adminAbi,
    signer
  );

  const blindAuctionFactoryContract = new ethers.Contract(
    blindAuctionFactoryContractAddress,
    blindAuctionFactoryAbi,
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

  const getRevertMessage = (error) => {
    return error.data.message.split("revert")[1].slice(1);
  };

  const uploadToIpfs = async (images) => {
    const cid = await upload({
      data: [images],
      options: {
        uploadWithGatewayUrl: true,
        uploadWithoutDirectory: false,
      },
    });
    return cid[0];
  };

  const downloadFromIpfs = async (cid) => {
    const images = await (await storage.download(cid)).text();
    return images;
  };

  const createAuction = async (params) => {
    const STAKE = await blindAuctionFactoryContract.STAKE();
    const txResponse =
      await blindAuctionFactoryContract.createBlindAuctionContract(
        params._title,
        params._startTime,
        params._endTime,
        params._minimumBid,
        params._cid,
        params._description,
        params._shippingAddress,
        { value: STAKE }
      );
    console.log(txResponse);
  };

  return (
    <StateContext.Provider
      value={{
        address,
        admins,
        adminContract,
        connectWallet,
        createAuction,
        deleteAdmin,
        disconnectWallet,
        downloadFromIpfs,
        getRevertMessage,
        isMismatched,
        isLoading,
        registerAdmin,
        role,
        toggleIsLoading,
        updateAdmins,
        updateRole,
        uploadToIpfs,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
