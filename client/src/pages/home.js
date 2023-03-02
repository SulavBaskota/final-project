import { LoadingOverlay } from "@mantine/core";
import { useTimeout } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { useStateContext } from "@component/context";
import WalletNotConnected from "@component/components/WalletNotConnected";
import NoOpenAuctions from "@component/components/NoOpenAuctions";

export default function Home() {
  const { address } = useStateContext();
  const [visible, setVisible] = useState(true);
  const { start, clear } = useTimeout(() => setVisible(false), 500);

  useEffect(() => {
    start();
    return () => clear();
  }, []);

  return (
    <>
      {visible ? (
        <LoadingOverlay visible={visible} overlayBlur={2} />
      ) : address ? (
        <NoOpenAuctions />
      ) : (
        <WalletNotConnected />
      )}
    </>
  );
}
