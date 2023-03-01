export const ganacheLocalhost = {
  name: "Ganache Localhost",
  chain: "ETH",
  rpc: ["http://172.18.64.1:7545"],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  chainId: 1337,
  networkId: 5777,
  testnet: true,
};

export const hardhatLocalhost = {
  name: "Hardhat Localhost",
  chain: "ETH",
  rpc: ["http://127.0.0.1:8545"],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  chainId: 31337,
  networkId: 31337,
  testnet: true,
};
