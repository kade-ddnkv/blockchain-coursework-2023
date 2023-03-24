import React, { useState, useEffect, useContext } from 'react';
import { Box, Stack, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/system';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { AppContext } from '../hooks/AppContext';
import { CrsAddress } from '../addresses/contractsAddresses';
import { StakerABI } from '../abi/StakerABI';
import { useCountdown } from '../hooks/UseCountdown';
const ethers = require('ethers');

const ReadyButton = styled(Button)({
  borderRadius: 0,
  margin: '10px',
  padding: '10px',
  fontSize: '15px',
  backgroundColor: '#a973fa',
  ':hover': {
    backgroundColor: 'black',
  }
});

const NotReadyButton = styled(Button)({
  borderRadius: 0,
  margin: '10px',
  padding: '10px',
  fontSize: '15px',
});

const StyledTableCell = styled(TableCell)({
  fontSize: '20px',
  padding: '10px',
  //transform: 'rotate(40deg)',
});

const StyledTableHead = styled(TableHead)({
  fontSize: '10px',
  backgroundColor: 'white',
});

const StyledTableRow = styled(TableRow)({
  '&:nth-of-type(even)': {
    backgroundColor: '#f2f2f2',
  },
  //transform: 'rotate(50deg)',
});

const StyledTable = styled(Table)({
  width: '80%',
  margin: '50px auto',
  //transform: 'rotate(10deg)',
});

function Reward(props) {
  return <Stack
    direction="row"
    justifyContent="flex-start"
    alignItems="center"
    spacing={0}
  >
    {props.children}
  </Stack>
}

const RewardIsReady = styled(PriorityHighIcon)({
  fontSize: '40px',
});

const StatusBox = styled(Box)({
  width: '25%',
});

declare let window: any;

const parseDateTime = (raw) => {
  return new Date(raw.toNumber() * 1000)
}

const beautifyDateTimeString = (date: Date) => {
  return date.toLocaleDateString("default") + " " + date.toLocaleTimeString("default")
}

const CountdownTimerAndReward = ({ endTime, claimed }) => {
  const [seconds] = useCountdown(endTime);
  
  const { tokenBalanceChanged, setTokenBalanceChanged } = useContext(AppContext);

  async function receiveTokens() {
    if (!window.ethereum) return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const staker = new ethers.Contract(CrsAddress, StakerABI, signer)

    try {
      const tx = await staker.receiveTokens();
      console.log(`TransactionResponse TX hash: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log("transfer receipt", receipt);
    } catch (e) {
      console.log(e);
    }
    setTokenBalanceChanged(true);
  }

  if (seconds <= 0) {
    return claimed
      ? <>
        <StyledTableCell>0</StyledTableCell>
        <StyledTableCell>
          <Reward>
            <StatusBox>claimed</StatusBox>
            <ReadyButton sx={{ opacity: 0, pointerEvents: 'none' }} onClick={receiveTokens} disableElevation variant="contained">Claim reward</ReadyButton>
            <RewardIsReady sx={{ opacity: 0, pointerEvents: 'none' }} />
          </Reward>
        </StyledTableCell>
      </>
      : <>
        <StyledTableCell>0</StyledTableCell>
        <StyledTableCell>
          <Reward>
            <StatusBox>_ready_</StatusBox><ReadyButton onClick={receiveTokens} disableElevation variant="contained">Claim reward</ReadyButton><RewardIsReady />
          </Reward>
        </StyledTableCell>
      </>
  } else {
    return <>
      <StyledTableCell>{seconds}</StyledTableCell>
      <StyledTableCell>
        <Reward>
          <StatusBox>not_yet</StatusBox><NotReadyButton onClick={receiveTokens} variant="outlined">Claim reward</NotReadyButton>
        </Reward>
      </StyledTableCell>
    </>
  }
}

export default function ShowStakes({ account }) {
  const { tokenBalanceChanged, setTokenBalanceChanged } = useContext(AppContext);

  const [stakes, setStakes] = useState([]);

  useEffect(() => {
    if (!window.ethereum) return;
    if (!account) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const staker = new ethers.Contract(CrsAddress, StakerABI, provider);
    staker.checkStakesOf(account)
      .then((stakes) => {
        stakes = [...stakes].reverse().map((info) => {
          return {
            amount: info[0].toNumber(),
            startTime: parseDateTime(info[1]),
            endTime: parseDateTime(info[2]),
            claimed: info[3]
          }
        })
        setStakes(stakes)
      })
      .catch('error', console.error)

    setTokenBalanceChanged(false)
  }, [tokenBalanceChanged])

  return (
    <StyledTable>
      <StyledTableHead>
        <TableRow>
          <StyledTableCell>Tokens</StyledTableCell>
          <StyledTableCell>Start time</StyledTableCell>
          <StyledTableCell>Time left</StyledTableCell>
          <StyledTableCell>Status</StyledTableCell>
        </TableRow>
      </StyledTableHead>
      {account &&
        <TableBody>
          {stakes && stakes.map(info => {
            return (
              <StyledTableRow>
                <StyledTableCell>{info.amount}</StyledTableCell>
                <StyledTableCell>{beautifyDateTimeString(info.startTime)}</StyledTableCell>
                <CountdownTimerAndReward endTime={info.endTime} claimed={info.claimed} />
              </StyledTableRow>
            )
          })}
        </TableBody>
      }
    </StyledTable>
  )
}