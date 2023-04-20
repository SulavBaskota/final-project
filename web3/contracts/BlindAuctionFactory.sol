// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./Admin.sol";

contract BlindAuctionFactory {
    address public immutable adminContractAddress;
    address private immutable superAdminAddress;
    uint public constant REVEAL_PERIOD = 120; // 2 minutes
    uint public constant MINIMUM_VERIFICATION_DURATION = 120; // 2 minutes
    uint public constant MINIMUM_AUCTION_DURATION = 120; // 2 minutes
    uint public constant STAKE = 1000000000000000000; // 1 ETH

    struct Bid {
        bytes32 blindedBid;
        uint deposit;
    }

    enum AuctionState {
        UNVERIFIED,
        REJECTED,
        OPEN,
        SUCCESSFUL,
        FAILED
    } // 0, 1, 2, 3, 4

    enum ItemState {
        NOTRECEIVED,
        RECEIVED,
        SHIPPED
    } // 0, 1, 2

    struct BlindAuction {
        bytes32 id;
        string title;
        uint minimumBid;
        uint startTime;
        uint endTime;
        uint revealTime;
        string cid;
        string description;
        address seller;
        AuctionState auctionState;
        ItemState itemState;
        address[] bidders;
        address highestBidder;
        uint highestBid;
        string evaluationMessage;
        address evaluatedBy;
        bool shippingAddressUpdated;
    }

    mapping(uint => BlindAuction) private blindAuctions;
    mapping(bytes32 => uint) private auctionIds;
    mapping(bytes32 => string) private shippingAddresses;
    mapping(bytes32 => mapping(address => Bid)) private bids;
    mapping(bytes32 => mapping(address => uint)) private pendingReturns;
    uint private numberOfCampaings = 0;

    constructor(address _adminContractAddress) {
        adminContractAddress = _adminContractAddress;
        superAdminAddress = msg.sender;
    }

    modifier onlyAdmin() {
        Admin adminContract = Admin(adminContractAddress);
        if (!adminContract.isAdmin(msg.sender))
            revert("Auction can only be verified by an admin");
        _;
    }

    modifier onlySeller(bytes32 _auctionId) {
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        if (blindAuction.seller != msg.sender)
            revert("Auction can only be cancelled by seller");
        _;
    }

    modifier verifiedAuction(bytes32 _auctionId) {
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        if (blindAuction.auctionState == AuctionState.UNVERIFIED) {
            revert("Auction is not verified yet");
        } else if (blindAuction.auctionState == AuctionState.REJECTED) {
            revert("Auction has already been rejected");
        }
        _;
    }

    modifier onlyBeforeStartTime(bytes32 _auctionId) {
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        if (block.timestamp >= blindAuction.startTime)
            revert("Auction start time has already passed");
        _;
    }

    modifier onlyBeforeEndTime(bytes32 _auctionId) {
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        if (block.timestamp >= blindAuction.endTime)
            revert("Auction end time has already passed");
        _;
    }

    modifier onlyBeforeRevealTime(bytes32 _auctionId) {
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        if (block.timestamp >= blindAuction.revealTime)
            revert("Auction reveal time has already passed");
        _;
    }

    modifier onlyAfterStartTime(bytes32 _auctionId) {
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        if (block.timestamp <= blindAuction.startTime)
            revert("Auction start time has not passed");
        _;
    }

    modifier onlyAfterEndTime(bytes32 _auctionId) {
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        if (block.timestamp <= blindAuction.endTime)
            revert("Auction end time has not passed");
        _;
    }

    modifier onlyAfterRevealTime(bytes32 _auctionId) {
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        if (block.timestamp <= blindAuction.revealTime)
            revert("Auction reveal time has not passed");
        _;
    }

    modifier notSeller(bytes32 _auctionId) {
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        if (msg.sender == blindAuction.seller) revert("Seller cannot bid");
        _;
    }

    modifier noPreviousBid(bytes32 _auctionId) {
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        if (bids[_auctionId][msg.sender].deposit != 0)
            revert("You can only place one bid per item");
        _;
    }

    modifier pendingVerification(bytes32 _auctionId) {
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        if (blindAuction.auctionState != AuctionState.UNVERIFIED)
            revert("Auction is has already been evaluated or cancelled");
        _;
    }

    modifier successfulAuction(bytes32 _auctionId) {
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        if (blindAuction.auctionState != AuctionState.SUCCESSFUL)
            revert("Auction was not successful");
        _;
    }

    modifier onlyHighestBidder(bytes32 _auctionId) {
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        if (blindAuction.highestBidder != msg.sender)
            revert("Only highest bidder can change shipping address");
        _;
    }

    modifier notShipped(bytes32 _auctionId) {
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        if (blindAuction.itemState == ItemState.SHIPPED)
            revert("Item has already been shipped");
        _;
    }

    modifier onlyReceived(bytes32 _auctionId) {
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        if (blindAuction.itemState != ItemState.RECEIVED)
            revert("Only received item status can be updated");
        _;
    }

    modifier onlyClosed(bytes32 _auctionId) {
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        if (
            blindAuction.auctionState == AuctionState.UNVERIFIED ||
            blindAuction.auctionState == AuctionState.OPEN
        )
            revert(
                "Only rejected, successful or failed item status can be updated"
            );
        _;
    }

    event AuctionCreated(bytes32 auctionId);

    function createBlindAuctionContract(
        string memory _title,
        uint _startTime,
        uint _endTime,
        uint _minimumBid,
        string memory _cid,
        string memory _description,
        string memory _shippingAddress
    ) external payable {
        if (msg.value < STAKE) revert("Stake is not sufficient");
        if (msg.value > STAKE) revert("Stake is too high");
        if (bytes(_title).length < 5 || bytes(_title).length > 20)
            revert("Title must be between 5 to 20 characters");
        if (
            _startTime <= block.timestamp + MINIMUM_VERIFICATION_DURATION ||
            _endTime < _startTime + MINIMUM_AUCTION_DURATION
        ) revert("Invalid Auction Period");
        if (bytes(_cid).length != 80) revert("Invalid CID");
        if (bytes(_description).length < 10 || bytes(_description).length > 200)
            revert("Description must be between 10 to 200 characters");
        if (
            bytes(_shippingAddress).length < 10 ||
            bytes(_shippingAddress).length > 200
        ) revert("Shipping must be between 10 to 200 characters");

        BlindAuction storage blindAuction = blindAuctions[numberOfCampaings];
        blindAuction.title = _title;
        blindAuction.startTime = _startTime;
        blindAuction.endTime = _endTime;
        blindAuction.revealTime = _endTime + REVEAL_PERIOD;
        blindAuction.minimumBid = _minimumBid;
        blindAuction.cid = _cid;
        blindAuction.description = _description;
        blindAuction.seller = msg.sender;
        blindAuction.auctionState = AuctionState.UNVERIFIED;
        blindAuction.itemState = ItemState.NOTRECEIVED;
        blindAuction.shippingAddressUpdated = false;
        blindAuction.id = keccak256(
            abi.encodePacked(block.timestamp, numberOfCampaings, msg.sender)
        );
        auctionIds[blindAuction.id] = numberOfCampaings;
        shippingAddresses[blindAuction.id] = _shippingAddress;
        numberOfCampaings++;
        emit AuctionCreated(blindAuction.id);
    }

    event AuctionVerified(
        bytes32 _auctionId,
        address evaluatedBy,
        string evaluationMessage
    );

    function verifyAuction(
        bytes32 _auctionId,
        bool itemReceived,
        string memory _evaluationMessage
    )
        external
        onlyAdmin
        pendingVerification(_auctionId)
        onlyBeforeStartTime(_auctionId)
    {
        if (!itemReceived) revert("Only received auction item can be verified");
        if (bytes(_evaluationMessage).length == 0)
            revert("Empty evaluation message");
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        blindAuction.auctionState = AuctionState.OPEN;
        blindAuction.evaluatedBy = msg.sender;
        blindAuction.evaluationMessage = _evaluationMessage;
        blindAuction.itemState = ItemState.RECEIVED;
        emit AuctionVerified(_auctionId, msg.sender, _evaluationMessage);
    }

    event AuctionRejected(
        bytes32 _auctionId,
        address evaluatedBy,
        string evaluationMessage
    );

    function rejectAuction(
        bytes32 _auctionId,
        bool itemReceived,
        string memory _evaluationMessage
    ) external onlyAdmin pendingVerification(_auctionId) {
        if (bytes(_evaluationMessage).length == 0)
            revert("Empty evaluation message");
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        blindAuction.auctionState = AuctionState.REJECTED;
        blindAuction.evaluatedBy = msg.sender;
        blindAuction.evaluationMessage = _evaluationMessage;
        if (itemReceived) blindAuction.itemState = ItemState.RECEIVED;
        payable(superAdminAddress).transfer(STAKE);
        emit AuctionRejected(_auctionId, msg.sender, _evaluationMessage);
    }

    event BidPlaced(bytes32 _auctionId, address _bidder);

    function bid(
        bytes32 _auctionId,
        bytes32 _blindedBid
    )
        external
        payable
        verifiedAuction(_auctionId)
        onlyAfterStartTime(_auctionId)
        onlyBeforeEndTime(_auctionId)
        notSeller(_auctionId)
        noPreviousBid(_auctionId)
    {
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        if (msg.value < blindAuction.minimumBid)
            revert("Bid is less than minimum bid");
        bids[_auctionId][msg.sender] = Bid({
            blindedBid: _blindedBid,
            deposit: msg.value
        });
        blindAuction.bidders.push(msg.sender);
        emit BidPlaced(_auctionId, msg.sender);
    }

    event BidRevealed(bytes32 _auctionId, address _bidder);

    function reveal(
        bytes32 _auctionId,
        uint trueBid,
        bytes32 secret
    )
        external
        verifiedAuction(_auctionId)
        onlyAfterEndTime(_auctionId)
        onlyBeforeRevealTime(_auctionId)
    {
        uint refund;
        Bid storage bidToCheck = bids[_auctionId][msg.sender];
        if (
            bidToCheck.blindedBid !=
            keccak256(abi.encodePacked(trueBid, secret))
        ) {
            revert("Incorrect true bid value or secret");
        }
        refund = bidToCheck.deposit;
        if (bidToCheck.deposit >= trueBid) {
            if (placeBid(_auctionId, msg.sender, trueBid)) refund -= trueBid;
        }
        pendingReturns[_auctionId][msg.sender] += refund;
        bidToCheck.blindedBid = bytes32(0);
        emit BidRevealed(_auctionId, msg.sender);
    }

    function withdraw(
        bytes32 _auctionId
    ) external verifiedAuction(_auctionId) onlyAfterRevealTime(_auctionId) {
        uint amount = pendingReturns[_auctionId][msg.sender];
        if (amount <= 0) revert("No pending returns");
        if (amount > 0) {
            pendingReturns[_auctionId][msg.sender] = 0;
            payable(msg.sender).transfer(amount);
        }
    }

    function placeBid(
        bytes32 _auctionId,
        address bidder,
        uint value
    ) internal returns (bool success) {
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        if (
            value < blindAuction.minimumBid || value <= blindAuction.highestBid
        ) {
            return false;
        }
        if (blindAuction.highestBidder != address(0)) {
            pendingReturns[_auctionId][
                blindAuction.highestBidder
            ] += blindAuction.highestBid;
        }
        blindAuction.highestBid = value;
        blindAuction.highestBidder = bidder;
        return true;
    }

    event AuctionSuccessful(
        bytes32 _auctionId,
        address highestBidder,
        uint highestBid
    );

    event AuctionFailed(bytes32 _auctionId);

    function auctionEnd(
        bytes32 _auctionId
    ) external verifiedAuction(_auctionId) onlyAfterRevealTime(_auctionId) {
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        if (
            blindAuction.auctionState == AuctionState.SUCCESSFUL ||
            blindAuction.auctionState == AuctionState.FAILED
        ) revert("Auction has already been closed");
        refundBids(_auctionId);
        if (blindAuction.highestBidder != address(0)) {
            blindAuction.auctionState = AuctionState.SUCCESSFUL;
            emit AuctionSuccessful(
                _auctionId,
                blindAuction.highestBidder,
                blindAuction.highestBid
            );
            payable(blindAuction.seller).transfer(blindAuction.highestBid);
            payable(superAdminAddress).transfer(STAKE);
        } else {
            blindAuction.auctionState = AuctionState.FAILED;
            payable(blindAuction.seller).transfer(STAKE);
            emit AuctionFailed(_auctionId);
        }
    }

    function refundBids(bytes32 _auctionId) internal {
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        for (uint i = 0; i < blindAuction.bidders.length; i++) {
            address bidder = blindAuction.bidders[i];
            Bid storage bidToCheck = bids[_auctionId][bidder];
            if (bidToCheck.blindedBid == bytes32(0)) continue;
            pendingReturns[_auctionId][bidder] += bidToCheck.deposit;
            bidToCheck.blindedBid = bytes32(0);
        }
    }

    event AuctionCancelled(bytes32 _auctionId);

    function cancelAuction(
        bytes32 _auctionId
    )
        external
        onlySeller(_auctionId)
        onlyBeforeStartTime(_auctionId)
        pendingVerification(_auctionId)
    {
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        blindAuction.auctionState = AuctionState.FAILED;
        blindAuction.evaluationMessage = "Cancelled by seller";
        payable(blindAuction.seller).transfer(STAKE);
        emit AuctionCancelled(_auctionId);
    }

    event ShippingAddressUpdated(bytes32 _auctionId);

    function updateShippingAddress(
        bytes32 _auctionId,
        string memory _shippingAddress
    )
        external
        successfulAuction(_auctionId)
        onlyHighestBidder(_auctionId)
        notShipped(_auctionId)
    {
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        blindAuction.shippingAddressUpdated = true;
        shippingAddresses[_auctionId] = _shippingAddress;
        emit ShippingAddressUpdated(_auctionId);
    }

    event ShipmentStatusUpdated(bytes32 _auctionId);

    function updateShipmentStatus(
        bytes32 _auctionId
    ) external onlyAdmin onlyReceived(_auctionId) onlyClosed(_auctionId) {
        BlindAuction storage blindAuction = getBlindAuction(_auctionId);
        if (
            blindAuction.auctionState == AuctionState.SUCCESSFUL &&
            blindAuction.shippingAddressUpdated == false
        ) revert("Highest bidder has not updated shipping address");
        blindAuction.itemState = ItemState.SHIPPED;
        emit ShipmentStatusUpdated(_auctionId);
    }

    function getBlindAuctions() external view returns (BlindAuction[] memory) {
        BlindAuction[] memory allBlindAuctions = new BlindAuction[](
            numberOfCampaings
        );
        for (uint i = 0; i < numberOfCampaings; i++) {
            BlindAuction storage blindAuction = blindAuctions[i];
            allBlindAuctions[i] = blindAuction;
        }
        return allBlindAuctions;
    }

    function getBlindAuctionById(
        bytes32 _auctionId
    ) external view returns (BlindAuction memory) {
        return getBlindAuction(_auctionId);
    }

    function getShippingAddress(
        bytes32 _auctionId
    ) external view onlyAdmin returns (string memory) {
        return shippingAddresses[_auctionId];
    }

    function getBlindAuction(
        bytes32 _auctionId
    ) internal view returns (BlindAuction storage) {
        uint _index = auctionIds[_auctionId];
        return blindAuctions[_index];
    }

    fallback() external {}
}
