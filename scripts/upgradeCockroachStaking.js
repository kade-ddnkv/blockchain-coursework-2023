require('dotenv').config({ path: `.env.public` });

async function main() {
  const CockroachStaking = await ethers.getContractFactory("CockroachStaking");
  const upgraded = await upgrades.upgradeProxy(process.env.CrsAddress, CockroachStaking);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});