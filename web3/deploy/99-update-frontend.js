const fs = require("fs");
const { ethers } = require("hardhat");
const {
  fEAdminAbiFile,
  fEAdminAddressFile,
  fEBAFAbiFile,
  fEBAFAddressFile,
} = require("../helper-hardhat-config");

module.exports = async () => {
  await updateContractAddresses();
  await updateAbi();
};

async function updateAbi() {
  const admin = await ethers.getContract("Admin");
  const blindAuctionFactory = await ethers.getContract("BlindAuctionFactory");

  fs.writeFileSync(
    fEAdminAbiFile,
    admin.interface.format(ethers.utils.FormatTypes.json)
  );
  fs.writeFileSync(
    fEBAFAbiFile,
    blindAuctionFactory.interface.format(ethers.utils.FormatTypes.json)
  );
}

async function updateContractAddresses() {
  const admin = await ethers.getContract("Admin");
  const blindAuctionFactory = await ethers.getContract("BlindAuctionFactory");

  fs.writeFileSync(fEAdminAddressFile, JSON.stringify(admin.address));
  fs.writeFileSync(
    fEBAFAddressFile,
    JSON.stringify(blindAuctionFactory.address)
  );
}

module.exports.tags = ["all", "frontend"];
