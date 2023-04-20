import { createContext, useContext } from "react";
import { ethers } from "ethers";
import {
  adminAbi,
  adminContractAddress,
  blindAuctionFactoryAbi,
  blindAuctionFactoryContractAddress,
  AUCTIONSTATE,
  ITEMSTATE,
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

  const address = useAddress();
  const connect = useMetamask();
  const disconnect = useDisconnect();
  const isMismatched = useNetworkMismatch();
  const signer = useSigner();
  const storage = useStorage();
  const { mutateAsync: upload } = useStorageUpload();

  const adminContract = new ethers.Contract(adminContractAddress, adminAbi);

  const BAFContract = new ethers.Contract(
    blindAuctionFactoryContractAddress,
    blindAuctionFactoryAbi
  );

  const connectWallet = async () => await connect();

  const disconnectWallet = async () => await disconnect();

  const registerAdmin = async (adminAddress) => {
    const signedAdminContract = adminContract.connect(signer);
    const txResponse = await signedAdminContract.registerAdmin(adminAddress);
    return txResponse;
  };

  const deleteAdmin = async (adminAddress) => {
    const signedAdminContract = adminContract.connect(signer);
    const txResponse = await signedAdminContract.unregisterAdmin(adminAddress);
    return txResponse;
  };

  const isAdmin = async () => {
    const signedAdminContract = adminContract.connect(signer);
    const txResponse = await signedAdminContract.isAdmin(address);
    return txResponse;
  };

  const isSuperAdmin = async () => {
    const signedAdminContract = adminContract.connect(signer);
    const txResponse = await signedAdminContract.isSuperAdmin();
    return txResponse;
  };

  const getAdmins = async () => {
    const signedAdminContract = adminContract.connect(signer);
    const adminList = await signedAdminContract.getAdmins();
    return adminList.slice(1);
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
    if (error.code === "ACTION_REJECTED") return "Transaction rejected";
    if (error.code === -32603)
      return error.data.message.split("revert")[1].slice(1);
    return error.reason;
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
    const images = await storage.downloadJSON(cid);
    return images;
  };

  const createAuction = async (params) => {
    const signedBAFContract = BAFContract.connect(signer);
    const STAKE = await signedBAFContract.STAKE();
    const txResponse = await signedBAFContract.createBlindAuctionContract(
      params._title,
      params._startTime,
      params._endTime,
      ethers.utils.parseEther(params._minimumBid),
      params._cid,
      params._description,
      params._shippingAddress,
      { value: STAKE }
    );
    return txResponse;
  };

  const getBlindAuctions = async () => {
    const signedBAFContract = BAFContract.connect(signer);

    const blindAuctions = await signedBAFContract.getBlindAuctions();

    const parsedBlindAuctions = blindAuctions.map((blindAuction, index) => ({
      index: index,
      id: blindAuction.id,
      title: blindAuction.title,
      minimumBid: ethers.utils.formatEther(blindAuction.minimumBid),
      startTime: blindAuction.startTime.toNumber(),
      endTime: blindAuction.endTime.toNumber(),
      revealTime: blindAuction.revealTime.toNumber(),
      cid: blindAuction.cid,
      description: blindAuction.description,
      seller: blindAuction.seller,
      auctionState: blindAuction.auctionState,
      itemState: blindAuction.itemState,
      bidders: blindAuction.bidders,
      highestBidder: blindAuction.highestBidder,
      highestBid: blindAuction.highestBid,
      evaluationMessage: blindAuction.evaluationMessage,
      evaluatedBy: blindAuction.evaluatedBy,
      shippingAddressUpdated: blindAuction.shippingAddressUpdated,
    }));
    const reversedParsedBlindAuctions = parsedBlindAuctions.reverse();
    return reversedParsedBlindAuctions;
  };

  const getUnverifiedAuctions = async () => {
    const allBlindAuctions = await getBlindAuctions();
    const filteredBlindAuctions = allBlindAuctions.filter(
      (blindAuction) => blindAuction.auctionState === AUCTIONSTATE.UNVERIFIED
    );
    return filteredBlindAuctions;
  };

  const getBlindAuctionById = async (_auctionId) => {
    const signedBAFContract = BAFContract.connect(signer);
    const blindAuction = await signedBAFContract.getBlindAuctionById(
      _auctionId
    );
    const parsedBlindAuction = {
      id: blindAuction.id,
      title: blindAuction.title,
      minimumBid: ethers.utils.formatEther(blindAuction.minimumBid),
      startTime: blindAuction.startTime.toNumber(),
      endTime: blindAuction.endTime.toNumber(),
      revealTime: blindAuction.revealTime.toNumber(),
      cid: blindAuction.cid,
      description: blindAuction.description,
      seller: blindAuction.seller,
      auctionState: blindAuction.auctionState,
      itemState: blindAuction.itemState,
      bidders: blindAuction.bidders,
      highestBidder: blindAuction.highestBidder,
      highestBid: ethers.utils.formatEther(blindAuction.highestBid),
      evaluationMessage: blindAuction.evaluationMessage,
      evaluatedBy: blindAuction.evaluatedBy,
      shippingAddressUpdated: blindAuction.shippingAddressUpdated,
    };
    return parsedBlindAuction;
  };

  const getUserAuctions = async () => {
    const allBlindAuctions = await getBlindAuctions();
    const filteredBlindAuctions = allBlindAuctions.filter(
      (blindAuction) =>
        blindAuction.seller === address ||
        blindAuction.bidders.includes(address)
    );
    return filteredBlindAuctions;
  };

  const getOpenAuctions = async () => {
    const allBlindAuctions = await getBlindAuctions();
    const filteredBlindAuctions = allBlindAuctions.filter(
      (blindAuction) => blindAuction.auctionState === AUCTIONSTATE.OPEN
    );
    return filteredBlindAuctions;
  };

  const getClosedAuctions = async () => {
    const allBlindAuctions = await getBlindAuctions();
    const filteredBlindAuctions = allBlindAuctions.filter(
      (blindAuction) =>
        blindAuction.auctionState === AUCTIONSTATE.REJECTED ||
        blindAuction.auctionState === AUCTIONSTATE.FAILED ||
        blindAuction.auctionState === AUCTIONSTATE.SUCCESSFUL
    );
    return filteredBlindAuctions;
  };

  const getUnshippedItems = async () => {
    const allBlindAuctions = await getBlindAuctions();
    const filteredBlindAuctions = allBlindAuctions.filter(
      (blindAuction) =>
        (blindAuction.auctionState === AUCTIONSTATE.REJECTED &&
          blindAuction.itemState === ITEMSTATE.RECEIVED) ||
        (blindAuction.auctionState === AUCTIONSTATE.FAILED &&
          blindAuction.itemState === ITEMSTATE.RECEIVED) ||
        (blindAuction.auctionState === AUCTIONSTATE.SUCCESSFUL &&
          blindAuction.itemState === ITEMSTATE.RECEIVED &&
          blindAuction.shippingAddressUpdated)
    );
    return filteredBlindAuctions;
  };

  const getShippingAddress = async (_auctionId) => {
    const signedBAFContract = BAFContract.connect(signer);
    const txResponse = await signedBAFContract.getShippingAddress(_auctionId);
    return txResponse;
  };

  const updateShipmentStatus = async (_auctionId) => {
    const signedBAFContract = BAFContract.connect(signer);
    const txResponse = await signedBAFContract.updateShipmentStatus(_auctionId);
    return txResponse;
  };

  const verifyAuction = async (
    _auctionId,
    _itemReceived,
    _evaluationMessage
  ) => {
    const signedBAFContract = BAFContract.connect(signer);

    const txResponse = await signedBAFContract.verifyAuction(
      _auctionId,
      _itemReceived,
      _evaluationMessage
    );
    return txResponse;
  };

  const rejectAuction = async (
    _auctionId,
    _itemReceived,
    _evaluationMessage
  ) => {
    const signedBAFContract = BAFContract.connect(signer);

    const txResponse = await signedBAFContract.rejectAuction(
      _auctionId,
      _itemReceived,
      _evaluationMessage
    );
    return txResponse;
  };

  const placeBid = async (_auctionId, _deposit, _trueBid, _secret) => {
    const signedBAFContract = BAFContract.connect(signer);

    const secretBytes = ethers.utils.id(_secret);
    const blindedBid = ethers.utils.solidityKeccak256(
      ["uint", "bytes32"],
      [ethers.utils.parseEther(_trueBid), secretBytes]
    );

    const txResponse = await signedBAFContract.bid(_auctionId, blindedBid, {
      value: ethers.utils.parseEther(_deposit),
    });
    return txResponse;
  };

  const revealBid = async (_auctionId, _trueBid, _secret) => {
    const signedBAFContract = BAFContract.connect(signer);

    const secretBytes = ethers.utils.id(_secret);

    const txResponse = await signedBAFContract.reveal(
      _auctionId,
      ethers.utils.parseEther(_trueBid),
      secretBytes
    );
    return txResponse;
  };

  const withdraw = async (_auctionId) => {
    const signedBAFContract = BAFContract.connect(signer);
    const txResponse = await signedBAFContract.withdraw(_auctionId);
    return txResponse;
  };

  const closeAuction = async (_auctionId) => {
    const signedBAFContract = BAFContract.connect(signer);
    const txResponse = await signedBAFContract.auctionEnd(_auctionId);
    return txResponse;
  };

  const cancelAuction = async (_auctionId) => {
    const signedBAFContract = BAFContract.connect(signer);
    const txResponse = await signedBAFContract.cancelAuction(_auctionId);
    return txResponse;
  };

  const updateShippingInfo = async (_auctionId, _shippingAddress) => {
    const signedBAFContract = BAFContract.connect(signer);
    const txResponse = await signedBAFContract.updateShippingAddress(
      _auctionId,
      _shippingAddress
    );
    return txResponse;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        adminContract,
        BAFContract,
        cancelAuction,
        closeAuction,
        connectWallet,
        createAuction,
        deleteAdmin,
        disconnectWallet,
        downloadFromIpfs,
        getAdmins,
        getBlindAuctionById,
        getClosedAuctions,
        getOpenAuctions,
        getRevertMessage,
        getShippingAddress,
        getUnverifiedAuctions,
        getUserAuctions,
        getUnshippedItems,
        isMismatched,
        isLoading,
        placeBid,
        registerAdmin,
        rejectAuction,
        revealBid,
        role,
        signer,
        toggleIsLoading,
        updateRole,
        updateShippingInfo,
        updateShipmentStatus,
        uploadToIpfs,
        verifyAuction,
        withdraw,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
