import React, { useState, useContext } from 'react';
import { ERC20ABI } from '../abi/ERC20ABI';
import { StakerABI } from '../abi/StakerABI';
import { Button, TextField } from '@mui/material';
import { styled } from '@mui/system';
import { AppContext } from '../hooks/AppContext';
import { CrtAddress, CrsAddress } from '../addresses/contractsAddresses';
import ethers from 'ethers';

const StyledOutlinedButton = styled(Button)({
  borderRadius: 0,
  border: '1px solid black',
  padding: '15px',
  fontSize: '15px',
  color: 'black',
  margin: '30px',
  //transform: 'rotate(20deg)',
  "&::before,&::after": {
    content: "''",
    position: "absolute",
    top: -30,
    right: -120,
    borderColor: "transparent",
    borderStyle: "solid",
    transform: 'rotate(-20deg)',
  },
  "&::before": {
    borderWidth: "60px",
    borderTopColor: "#cdf725",
    borderRightColor: "#cdf725"
  },
  ':hover': {
    backgroundColor: '#fc9e19',
    color: 'black',
    borderColor: "transparent",
  },
});

const StyledInput = styled(TextField)({
  //width: '50%',
  margin: '30px',
  [`& fieldset`]: {
    borderRadius: 0,
  },
  //display: 'block',
  //transform: 'rotate(30deg)',
});

declare let window: any;

export default function MakeStake({ account }) {
  const { setTokenBalanceChanged } = useContext(AppContext);

  const [amount, setAmount] = useState<string>();

  async function approveTokens(_callback) {
    if (!window.ethereum) return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const erc20 = new ethers.Contract(CrtAddress, ERC20ABI, signer)

    try {
      const tx = await erc20.approve(CrsAddress, amount);
      console.log(`TransactionResponse TX hash: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log("transfer receipt", receipt);
    } catch (e) {
      console.log(e);
      return;
    }

    _callback()
  }

  async function sendTokensToStaking(_callback) {
    if (!window.ethereum) return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const staker = new ethers.Contract(CrsAddress, StakerABI, signer)

    try {
      const tx = await staker.stakeTokens(amount);
      console.log(`TransactionResponse TX hash: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log("transfer receipt", receipt);
    } catch (e) {
      console.log(e);
      return;
    }

    _callback()
  }

  async function stakeTokens(event: React.FormEvent) {
    event.preventDefault();
    if (Number(amount) > 0) {
      approveTokens(
        () => sendTokensToStaking(
          () => setTokenBalanceChanged(true)));
    }
  }

  const handleAmountChange = (e) => setAmount(e.target.value)

  return (
    <form onSubmit={stakeTokens}>
      {account
        ? <>
          <StyledOutlinedButton type="submit" variant="outlined">stake CRT</StyledOutlinedButton>
          <StyledInput onChange={handleAmountChange} label="enter tokens amount" variant="outlined" />
        </>
        : <>
          <StyledOutlinedButton disabled sx={{
            "&::before": {
              borderWidth: "60px",
              borderTopColor: "#f2f2f2",
              borderRightColor: "#f2f2f2"
            }
          }} variant="outlined">stake CRT</StyledOutlinedButton>
          <StyledInput disabled label="enter tokens amount" variant="outlined" />
        </>
      }

    </form>
  )
}