// не нужно импортировать ethers из hardhat-а, если скрипт запускается через yarn hardhat run
// const { ethers, upgrades } = require('hardhat');

async function main() {
  const CockroachToken = await ethers.getContractFactory("CockroachToken");
  const token = await upgrades.deployProxy(CockroachToken, [1000]);
  await token.deployed();
  console.log(`CockroachToken deployed to: ${token.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});