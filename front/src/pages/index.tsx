import React from 'react';
import { Typography, Container, Stack, Box, Button, TableContainer } from '@mui/material';
import { styled } from '@mui/system';
import NorthIcon from '@mui/icons-material/North';
import { useState, useEffect } from 'react';
import BalanceOfCrt from '../components/TokenBalance';
import MakeStake from '../components/MakeStake';
import ShowStakes from '../components/ShowStakes';
import { AppProvider } from '../hooks/AppContext';

const MyDiv = styled('div')({
  backgroundColor: 'white',
  paddingTop: '80px',
});

const LeftBox = styled(Box)({
  width: '20%',
  // display: 'block',
  transform: 'rotate(-30deg)',
  display: "flex",
  flexDirection: "column",
  // justifyContent: "center",
  alignItems: "center",
  marginBottom: '-120px'
});

const ArrowIcon = styled(NorthIcon)({
  fontSize: '130px',
  marginTop: '10px',
  marginLeft: '80px',
});

const ConnectButton = styled(Button)({
  borderRadius: '0',
  // transform: 'rotate(-30deg)',
  color: '#fff',
  backgroundColor: '#fc0882',
  marginTop: '50px',
  marginLeft: '90px',
  width: '150px',
  height: '150px',
  fontSize: '20px',
  ':hover': {
    backgroundColor: '#69ff8e',
  }
});

const DisconnectButton = styled(Button)({
  borderRadius: '0',
  // transform: 'rotate(-30deg)',
  color: '#69ff8e',
  marginTop: '50px',
  marginLeft: '90px',
  width: '150px',
  height: '150px',
  fontSize: '20px',
  borderColor: '#69ff8e',
  ':hover': {
    borderColor: 'black',
    color: 'black',
    backgroundColor: 'white',
  }
});

const CenterBox = styled(Box)({
  width: '50%',
  marginRight: '20px',
  marginLeft: 'auto',
  display: 'block',
  transform: 'rotate(-5deg)',
  marginBottom: '120px'
});

const MyTableContainer = styled(TableContainer)({
  transform: 'rotate(0.5deg)',
});

const UpperDiv = styled('div')({
  // ...theme.typography.button,
  // backgroundColor: theme.palette.background.paper,
  // padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'right',
  paddingRight: '200px',
  paddingTop: '20px'
});

const AccountDiv = styled(Container)({
  maxWidth: 'sm',
  width: '70%',
  paddingBottom: '20px',
});

declare let window: any;

const App = () => {

  type State = {
    isMetamaskInstalled: boolean;
    account: string | null;
    status: string;
    balance: string | null;
  };

  // const {
  //   dispatch,
  //   state: { status, isMetamaskInstalled, wallet, balance },
  // } = useMetamaskContext();

  const [state, setState] = useState<State>({ isMetamaskInstalled: false } as State);

  function isMetamaskInstalled() {
    return Boolean(window.ethereum && window.ethereum.isMetaMask);
  }

  async function isMetamaskConnected() {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts && accounts.length > 0;
  }

  const activeMetamaskConnection = async () => {
    if (isMetamaskInstalled()) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const balance = await window.ethereum!.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        });
        setState({ account: accounts[0], balance: balance, status: 'connected' } as State);
        // dispatch({ type: "connect", wallet: accounts[0], balance });
        useListen();
      } else {
        setState({ status: 'disconnected' } as State);
      }
    } else {
      setState({ isMetamaskInstalled: false } as State);
    }
  }

  const passiveMetamaskConnection = async () => {
    if (isMetamaskInstalled() && await isMetamaskConnected()) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });

      if (accounts.length > 0) {
        const balance = await window.ethereum!.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        });
        setState({ account: accounts[0], balance: balance, status: 'connected' } as State);
        // dispatch({ type: "connect", wallet: accounts[0], balance });
        useListen();
      } else {
        setState({ status: 'disconnected' } as State);
      }
    } else {
      setState({ isMetamaskInstalled: false } as State);
    }
  };

  const onClickDisconnect = async () => {
    setState({ status: 'disconnected' } as State);
  };

  async function useListen() {
    window.ethereum.on('accountsChanged', async () => {
      passiveMetamaskConnection();
    });
    window.ethereum.on('connect', async () => {
      passiveMetamaskConnection();
    });
    window.ethereum.on('disconnect', async () => {
      setState({ status: 'disconnected' } as State);
    });
  }

  useEffect(() => {
    passiveMetamaskConnection();
  }, []);

  return (
    <AppProvider>
      <UpperDiv>| staking lasts only one minute |</UpperDiv>
      <UpperDiv>| and returns 130% of tokens |</UpperDiv>
      <MyDiv>
        <LeftBox>
          {state.status === 'connected'
            ? <>
              <DisconnectButton variant="outlined" onClick={onClickDisconnect}>disconnect _metamask</DisconnectButton>
              <ArrowIcon style={{ color: 'transparent' }} />
            </>
            : <>
              <ConnectButton disableElevation variant="contained" onClick={activeMetamaskConnection}>_connect_ metamask</ConnectButton>
              <ArrowIcon />
            </>
          }
        </LeftBox>
        <CenterBox>
          <MakeStake account={state.account} />
        </CenterBox>
        {state.status === 'connected'
          ? <AccountDiv>
            <Typography component='div'><Box fontWeight='bold' display='inline'>ACCOUNT:</Box> {state.account}</Typography>
            <Typography component='div'><Box fontWeight='bold' display='inline'>CockroachTokens:</Box> <BalanceOfCrt account={state.account} /></Typography>
          </AccountDiv>
          : <AccountDiv>
            <Typography color='transparent' component='div'><Box fontWeight='bold' display='inline'>Here</Box> will be an account</Typography>
            <Typography color='transparent' component='div'><Box fontWeight='bold' display='inline'>Here</Box> will be CockroachTokens</Typography>
          </AccountDiv>
        }
        <MyTableContainer>
          <ShowStakes account={state.account} />
        </MyTableContainer>
      </MyDiv>
    </AppProvider>
  );
};

export default App;