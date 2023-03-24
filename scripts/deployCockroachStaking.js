async function main() {

  const CockroachStaking = await ethers.getContractFactory("CockroachStaking");
  const token = await CockroachStaking.deploy();

  await token.deployed();

  console.log(`CockroachStaking deployed to: ${token.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});