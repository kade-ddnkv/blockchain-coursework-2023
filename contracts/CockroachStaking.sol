// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// import "hardhat/console.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract CockroachStaking is OwnableUpgradeable {
    using SafeMathUpgradeable for uint;
    using SafeERC20Upgradeable for IERC20Upgradeable;

    function initialize(address crtAddress) public initializer {
        __Ownable_init();
        durationOfStake = 60;
        addedPercent = 30;
        token = crtAddress;
    }

    struct Stake {
        uint amount;
        uint startTime;
        uint endTime;
        bool received;
    }

    // адрес токена
    address public token;

    // timestamp измеряется в секундах с эпохи Юникса
    uint public durationOfStake;
    uint public addedPercent;

    // mapping доступен только в storage
    // если захочется сделать его в memory,
    // то сделать связку типа mapping(address => uint) и Stake[][] memory
    mapping(address => Stake[]) private stakes;

    function stakeTokens(uint amount) public returns (uint stakeEndTime) {
        require(amount >= 0, "stake amount should be greater than zero");
        require(
            amount <= IERC20Upgradeable(token).balanceOf(msg.sender),
            "you do not have enough tokens to stake this amount"
        );
        require(
            amount <= IERC20Upgradeable(token).allowance(msg.sender, address(this)),
            "this contract has not been allowed to use this amount of your tokens, call approve or increaseAllowance first"
        );

        IERC20Upgradeable(token).safeTransferFrom(msg.sender, address(this), amount);

        stakes[msg.sender].push() = Stake({
            amount: amount,
            startTime: block.timestamp,
            endTime: block.timestamp + durationOfStake,
            received: false
        });

        // возвращается конец стейка
        // это нужно потому, что block.timestamp не равен времени отправки транзакции
        return block.timestamp + durationOfStake;
    }

    function receiveTokens() public returns (uint receivedTokensAmount) {
        receivedTokensAmount = 0;
        uint userStakesCount = stakes[msg.sender].length;
        bool haveUnreceivedStakes = false;

        for (uint i = 0; i < userStakesCount; i++) {
            if (!stakes[msg.sender][i].received) {
                haveUnreceivedStakes = true;
                if (stakes[msg.sender][i].endTime <= block.timestamp) {
                    receivedTokensAmount = receivedTokensAmount.add(
                        stakes[msg.sender][i].amount.add(stakes[msg.sender][i].amount.mul(addedPercent).div(100)));
                    stakes[msg.sender][i].received = true;
                }
            }
        }

        if (receivedTokensAmount == 0) {
            if (haveUnreceivedStakes) {
                revert('you have no ended stakes yet');
            }
            revert('you have not staked anything yet');
        }

        IERC20Upgradeable(token).safeTransfer(msg.sender, receivedTokensAmount);

        return receivedTokensAmount;
    }

    function checkStakesOf(address user) public view returns (Stake[] memory) {
        return stakes[user];
    }
}
