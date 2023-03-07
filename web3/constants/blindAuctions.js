const currentTime = Math.floor(Date.now() / 1000);

const currentTimePlusHours = (hours) => {
  return parseInt(currentTime + hours * 60 * 60);
};

const blindAuctions = [
  {
    seller: 6,
    startTime: currentTimePlusHours(0.1),
    endTime: currentTimePlusHours(0.2),
    minimumBid: ethers.utils.parseEther("1"),
    cid: "https://gateway.ipfscdn.io/ipfs/QmSdn7fERhNW76YTZcCHjpcj7KgBSmvEqULkVSeLmxTNkT/0",
  },
  {
    seller: 7,
    startTime: currentTimePlusHours(0.2),
    endTime: currentTimePlusHours(0.3),
    minimumBid: ethers.utils.parseEther("2"),
    cid: "https://gateway.ipfscdn.io/ipfs/Qma6zxbbYD1nFpJuZEQA9Xbi7bUyw5ktZb8weCvAxrYTFE/0",
  },
  {
    seller: 8,
    startTime: currentTimePlusHours(0.3),
    endTime: currentTimePlusHours(0.4),
    minimumBid: ethers.utils.parseEther("3"),
    cid: "bafybeihiairwr6sw6mag5rl7x2n5fdr22n6lg34fw3ipjciju7xuwueobi",
  },
];

module.exports = {
  blindAuctions,
};
