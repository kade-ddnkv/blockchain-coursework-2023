require('dotenv').config({ path: `.env.public` });

async function main() {
  const fs = require('fs');

  const CrtAddress = process.env.CrtAddress;
  const CrtABI = JSON.parse(fs.readFileSync('scripts/contracts_abi/CockroachTokenABI.json'));

  const contract = new ethers.Contract(CrtAddress, CrtABI, ethers.provider);
  const signer = (await ethers.getSigners())[0];
  

  // первая транзакция - перевести токены пользователю из метамаска
  const recipient = process.env.init_recipient;
  let tx = await contract.connect(signer).transfer(recipient, 50);
  
  let receipt = await tx.wait();
  console.log("Transaction hash:", tx.hash);
  console.log("Transaction receipt:", receipt);
  
  
  // вторая транзакция - перевести токены смарт-контракту для стейкинга
  const CrsAddress = process.env.CrsAddress;
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