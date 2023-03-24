import React, { useEffect, useState, useContext } from 'react';
import { ERC20ABI } from '../abi/ERC20ABI';
import { AppContext } from '../hooks/AppContext';
import { CrtAddress } from '../addresses/contractsAddresses';
const ethers = require('ethers');

declare let window: any;

export default function BalanceOfCrt({ account }) {
  const { tokenBalanceChanged, setTokenBalanceChanged } = useContext(AppContext);

  const [balance, setBalance] = useState<number>();

  useEffect(() => {
    if (!window.ethereum) return;
    if (!account) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const erc20 = new ethers.Contract(CrtAddress, ERC20ABI, provider);
    erc20.balanceOf(account)
      .then((result: string) => {
        setBalance(Number(result))
      })
      .catch('error', console.error)

    // Тут я намотал велосипед конечно, но эта строка нужна, 
    // чтобы при вызове setTokenBalanceChanged откуда-нибудь прогружались оба BalanceOfCrt и ShowStakes.
    setTokenBalanceChanged(true)
  }, [tokenBalanceChanged])

  return <>{balance}</>
}