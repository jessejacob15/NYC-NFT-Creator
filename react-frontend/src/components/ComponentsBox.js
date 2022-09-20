import '../styles/App.css';
import { ethers } from "ethers";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import NYCDescriptor from '../utils/NYCDescriptor.json';
import React, { useState } from "react";

const CONTRACT_DESCRIPTOR_ADDRESS = "0x2AF31eA5DCA17f3AfC46f6AbEEB0532849aa4EC5";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#000000",
  padding: theme.spacing(1),
  textAlign: 'center',
  color: '#EFEF85',
  fontFamily: "myFont"
}));

const ComponentsBox = () => {

  const [head, setHead] = useState("");
  const [skin, setSkin] = useState("");
  const [jacket, setJacket] = useState("");

  async function getColorCounts() {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedDescriptorContract = new ethers.Contract(CONTRACT_DESCRIPTOR_ADDRESS, NYCDescriptor.abi, signer)
      const skinCount = await connectedDescriptorContract.skinPaletteCount()
      setSkin(skinCount.toNumber())
      const jacketCount = await connectedDescriptorContract.jacketPaletteCount()
      setJacket(jacketCount.toNumber())
      const headCount = await connectedDescriptorContract.headPaletteCount()
      setHead(headCount.toNumber())
    }
  } 

  getColorCounts()

  return (
    <Box sx = {{width: '20%'}}>
      <Stack spacing={1}>
        <Item>Head Colors: {head}</Item>
        <Item>Jacket Colors: {jacket}</Item>
        <Item>Skin Colors: {skin} </Item>
      </Stack>
    </Box>
  );
};

export default ComponentsBox;