import { ethers } from "ethers";
import NYCDescriptor from '../utils/NYCDescriptor.json';
import React, { useState } from "react";

//import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TokenCard from './TokenCard'

const CONTRACT_DESCRIPTOR_ADDRESS = "0x8Bc3345e219ef14d1137435ded9f6c454F8136Af";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#000000",
  padding: theme.spacing(1),
  textAlign: 'center',
  color: '#FD593D',
  fontSize: '25px',
  fontFamily: "myfont",
  marginBottom: 20
}));

async function ownedTokenURIs() { 
  const { ethereum } = window;
  const toReturn = {
    "balance" : null, 
    "tokens" : null
  }
  let accountBalance = ""
  let tokenString = ""
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    const account = accounts[0]

    const connectedDescriptorContract = new ethers.Contract(CONTRACT_DESCRIPTOR_ADDRESS, NYCDescriptor.abi, signer)
    accountBalance = await connectedDescriptorContract.balanceOf(account);
    accountBalance = accountBalance.toNumber()

  for (let i = 0; i < accountBalance; i ++) {
    const ownedTokenID = await connectedDescriptorContract.tokenOfOwnerByIndex(account, i)
    const ownedToken = await connectedDescriptorContract.tokenURI(ownedTokenID)
    tokenString += ownedTokenID + "-" + ownedToken + "+";
    
  }
  }
  toReturn["tokens"] = tokenString
  toReturn["balance"] = accountBalance
  return toReturn
}

const OwnedNFTs = () => {

  const [balance, setBalance] = useState("");
  const [tokens, setTokens] = useState("")

  ownedTokenURIs().then(res => {
    setBalance(res.balance)
    setTokens(res.tokens)
  })
  return (
    <Box sx = {{width: '60%'}}>
      <Stack spacing={2}>
        <Item> NFTs owned by you: {balance} </Item>
      </Stack>
      {tokens === "" ? <></> : <TokenCard tokenURI = {tokens} /> } 
      
    </Box>
  );
};

export default OwnedNFTs;