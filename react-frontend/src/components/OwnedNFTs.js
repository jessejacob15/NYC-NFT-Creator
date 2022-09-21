import { ethers } from "ethers";
import NYCDescriptor from '../utils/NYCDescriptor.json';
import React, { useState } from "react";

//import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';


const CONTRACT_DESCRIPTOR_ADDRESS = "0x2AF31eA5DCA17f3AfC46f6AbEEB0532849aa4EC5";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#000000",
  padding: theme.spacing(1),
  textAlign: 'center',
  color: '#FFF',
  fontFamily: "myfont"
}));


const OwnedNFTs = () => {

  const [balance, setBalance] = useState("");


  async function getNFTs() {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      const account = accounts[0]

      const connectedDescriptorContract = new ethers.Contract(CONTRACT_DESCRIPTOR_ADDRESS, NYCDescriptor.abi, signer)

      const accountBalance = await connectedDescriptorContract.balanceOf(account);
      console.log(accountBalance)
      setBalance(accountBalance.toNumber())
      console.log(balance)

    }
  } 

  getNFTs()

  return (
    <Box sx = {{width: '50%'}}>
      
      <Stack spacing={2}>
        <Item> NFTs owned by you: {balance} </Item>
       
      </Stack>
    </Box>
  );
};

export default OwnedNFTs;