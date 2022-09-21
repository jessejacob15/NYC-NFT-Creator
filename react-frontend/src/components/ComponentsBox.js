// import '../styles/App.css';
 import { ethers } from "ethers";
// import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
// import Stack from '@mui/material/Stack';
// import { styled } from '@mui/material/styles';
import NYCDescriptor from '../utils/NYCDescriptor.json';
import React, { useState } from "react";

//import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';


const CONTRACT_DESCRIPTOR_ADDRESS = "0x2AF31eA5DCA17f3AfC46f6AbEEB0532849aa4EC5";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#000000",
  padding: theme.spacing(1),
  textAlign: 'center',
  color: '#EFEF85',
  fontFamily: "myfont"
}));


const ComponentsBox = () => {

  const [headPalette, setHeadPalette] = useState("");
  const [skinPalette, setSkinPalette] = useState("");
  const [jacketPalette, setJacketPalette] = useState("");

  const [head, setHead] = useState("");
  const [skin, setSkin] = useState("");
  const [jacket, setJacket] = useState("");

  async function getColorCounts() {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedDescriptorContract = new ethers.Contract(CONTRACT_DESCRIPTOR_ADDRESS, NYCDescriptor.abi, signer)

      const skinPaletteCount = await connectedDescriptorContract.skinPaletteCount()
      setSkinPalette(skinPaletteCount.toNumber())
      const jacketPaletteCount = await connectedDescriptorContract.jacketPaletteCount()
      setJacketPalette(jacketPaletteCount.toNumber())
      const headPaletteCount = await connectedDescriptorContract.headPaletteCount()
      setHeadPalette(headPaletteCount.toNumber())

      const skinCount = await connectedDescriptorContract.skinCount()
      setSkin(skinCount.toNumber())
      const jacketCount = await connectedDescriptorContract.jacketCount()
      setJacket(jacketCount.toNumber())
      const headCount = await connectedDescriptorContract.headCount()
      setHead(headCount.toNumber())
    }
  } 

  getColorCounts()

  return (
    <Box sx = {{width: '25%'}}>
      
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
        <Item>Head Types: {head}</Item>
        </Grid>
        <Grid item xs={6}>
        <Item>Head Colors: {headPalette}</Item>
        </Grid>
        <Grid item xs={6}>
        <Item>Jacket Types: {jacket}</Item>
        </Grid>
        <Grid item xs={6}>
        <Item>Jacket Colors: {jacketPalette}</Item>
        </Grid>
        <Grid item xs={6}>
        <Item>Skin Types: {skin}</Item>
        </Grid>
        <Grid item xs={6}>
        <Item>Skin Colors: {skinPalette} </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ComponentsBox;