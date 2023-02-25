import React, { useContext, createContext } from "react";
import { useToggle } from "@mantine/hooks";
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNetworkMismatch,
} from "@thirdweb-dev/react";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [isLoading, toggleIsLoading] = useToggle([false, true]);

  const address = useAddress();
  const connect = useMetamask();
  const disconnect = useDisconnect();
  const isMismatched = useNetworkMismatch();

  const connectWallet = async () => {
    toggleIsLoading();
    await connect();
    toggleIsLoading();
  };

  const disconnectWallet = async () => {
    toggleIsLoading();
    await disconnect();
    toggleIsLoading();
  };

  return (
    <StateContext.Provider
      value={{
        address,
        connectWallet,
        disconnectWallet,
        isMismatched,
        isLoading,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
