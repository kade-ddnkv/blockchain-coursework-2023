const StakeStruct = "(uint256 amount, uint256 startTime, uint256 endTime, bool received)"
export const StakerABI = [
  "function stakeTokens(uint256 amount) returns (uint256)",
  "function receiveTokens() returns (uint256 receivedTokensAmount)",
  `function checkStakesOf(address user) view returns (${StakeStruct}[])`
];