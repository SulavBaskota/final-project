const adminAbi = require("./Admin/abi.json");
const adminContractAddress = require("./Admin/address.json");
const blindAuctionFactoryAbi = require("./BlindAuctionFactory/abi.json");
const blindAuctionFactoryContractAddress = require("./BlindAuctionFactory/address.json");

const AUCTIONSTATE = {
  UNVERIFIED: 0,
  REJECTED: 1,
  OPEN: 2,
  SUCCESSFUL: 3,
  FAILED: 4,
};

const ITEMSTATE = {
  NOTRECEIVED: 0,
  RECEIVED: 1,
  SHIPPED: 2,
};

module.exports = {
  adminAbi,
  adminContractAddress,
  blindAuctionFactoryAbi,
  blindAuctionFactoryContractAddress,
  AUCTIONSTATE,
  ITEMSTATE,
};
