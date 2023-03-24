async function main() {
  const fs = require('fs');

  const CrtAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const CrtABI = JSON.parse(fs.readFileSync('scripts/contracts_abi/CockroachTokenABI.json'));

  const contract = new ethers.Contract(CrtAddress, CrtABI, ethers.provider);
  const signer = (await ethers.getSigners())[0];
  

  // первая транзакция - перевести токены пользователю из метамаска
  const recipient = "0x49580F79775cc5eB7969EB8B52E08FF259a28cC7";
  let tx = await contract.connect(signer).transfer(recipient, 50);
  
  let receipt = await tx.wait();
  console.log("Transaction hash:", tx.hash);
  console.log("Transaction receipt:", receipt);
  
  
  // вторая транзакция - перевести токены смарт-контракту для стейкинга
  const CrsAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  tx = await contract.connect(signer).transfer(CrsAddress, 50);

  receipt = await tx.wait();
  console.log("Transaction hash:", tx.hash);
  console.log("Transaction receipt:", receipt);
  
  console.log('recipient balance: ' + (await contract.balanceOf(recipient)).toNumber());
  console.log('CRS balance: ' + (await contract.balanceOf(CrsAddress)).toNumber());


  // третья транзакция - перевести ETH пользователю из метамаска
  const transaction = await signer.sendTransaction({
    to: recipient,
    value: ethers.utils.parseUnits("10", "ether")
  });
  await transaction.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});