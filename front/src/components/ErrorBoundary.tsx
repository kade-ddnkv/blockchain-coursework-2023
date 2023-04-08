import React from 'react';
import { Button, Box, Typography } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.log({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ mt: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', transform: 'rotate(-3deg)' }}>Oops, looks like you have problems with Metamask!</Typography>
            <Typography>
              <Box sx={{ transform: 'rotate(-2deg)', mt: 3 }}>1. Metamask browser extension must be installed.</Box>
              <Box sx={{ transform: 'rotate(-1deg)', mt: 1 }}>2. The correct network must be selected.</Box>
              <Box sx={{ transform: 'rotate(-1deg)', ml: 6 }}>2.1. For the online version it is testnet Sepolia.</Box>
              <Box sx={{ transform: 'rotate(-1deg)', ml: 6 }}>2.1. For the local version it is localhost:8545.</Box>
            </Typography>
            <Button sx={{ mt: 5, ml: 20, borderRadius: 0, color: 'red', borderColor: 'black', transform: 'rotate(-10deg)' }}
              variant='outlined' onClick={() => this.setState({ hasError: false })}>
              Try again?
            </Button>
          </Box>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary