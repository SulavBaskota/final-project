import { useStateContext } from "@component/context";
import WalletNotConnected from "@component/components/WalletNotConnected";
import NoOpenAuctions from "@component/components/NoOpenAuctions";

export default function Home() {
  const { address } = useStateContext();

  return <>{address ? <NoOpenAuctions /> : <WalletNotConnected />}</>;
}
