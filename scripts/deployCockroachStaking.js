require('dotenv').config({ path: `.env.public` });

async function main() {
  const CockroachStaking = await ethers.getContractFactory("CockroachStaking");
  const token = await upgrades.deployProxy(CockroachStaking, [process.env.CrtAddress]);
  await token.deployed();
  console.log(`CockroachStaking deployed to: ${token.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});