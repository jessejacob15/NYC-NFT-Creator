import './styles/App.css';
import instalogo from './assets/Instagram-Logo.wine.svg'
import namelesslogo from './assets/nameless.png'
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
//import myEpicNft from '.utils/NYCDescriptor.json'
import NYCDescriptor from './utils/NYCDescriptor.json';
import NYCSeeder from './utils/NYCSeeder.json';
import LinearProgress from '@mui/material/LinearProgress';
import theme from './styles/colorsTheme'
import { ThemeProvider } from '@mui/material/styles';


const mintMyNFT = require('./functionality/SeedAndMint');

const TWITTER_HANDLE = 'namelessyouthclub';
const TWITTER_LINK = `https://instagram.com/${TWITTER_HANDLE}`;
// const OPENSEA_LINK = '';
// const TOTAL_MINT_COUNT = 50;

// I moved the contract address to the top for easy access.
const CONTRACT_SEEDER_ADDRESS = "0xc0FE7Df4093559fA3d628Ff4be421763D2715330";
const CONTRACT_DESCRIPTOR_ADDRESS = "0x91566DB4684c16476bE9BAD8d3De19a631FC6D43";


const App = () => {

    const [currentAccount, setCurrentAccount] = useState("");

    const [loading, setLoading] = useState(false);
    
    const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;

      if (!ethereum) {
          console.log("Make sure you have metamask!");
          return;
      } else {
          console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      let chainId = await ethereum.request({ method: 'eth_chainId' });
      const rinkebyChainId = "0x4"; 


      if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          if (chainId !== rinkebyChainId) {
            alert("You are not connected to the Rinkeby Test Network!");
          }
          else {
            setCurrentAccount(account)
          // Setup listener! This is for the case where a user comes to our site
          // and ALREADY had their wallet connected + authorized.
            setupEventListener()
          }
					
      } else {
          console.log("No authorized account found")
      }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener() 
    } catch (error) {
      console.log(error)
    }
  }

  // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedDescriptorContract = new ethers.Contract(CONTRACT_DESCRIPTOR_ADDRESS, NYCDescriptor.abi, signer)

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedDescriptorContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          setLoading(false)
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_DESCRIPTOR_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    // try {
      const { ethereum } = window;
      setLoading(true)

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log(signer)
        const connectedSeederContract = new ethers.Contract(CONTRACT_SEEDER_ADDRESS, NYCSeeder.abi, signer);
        const connectedDescriptorContract = new ethers.Contract(CONTRACT_DESCRIPTOR_ADDRESS, NYCDescriptor.abi, signer)

        await mintMyNFT(connectedSeederContract, connectedDescriptorContract, currentAccount)
        

      } else {
        console.log("Ethereum object doesn't exist!");
      }
  }


  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  // const renderMintUI = (props) => (
  //     const isLoggedIn = props.isLoggedIn;

  //   { props.loading === true ? 
  //     <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
  //     Mint NFT
  //   </button> 
  //   :
  //   <h1>Loading</h1>
  //   }
  // )

  function isLoading() {
    const isLoading = loading;
    if (isLoading) {
      return <ThemeProvider theme={theme} ><div className='center'> <LinearProgress className = "spinner" color= "yellow" />  </div></ThemeProvider>
    }
    return <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
         Mint NFT
       </button> ;
  }
  

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <img alt = "nameless-logo" src = {namelesslogo} />
          {/* <p className="header gradient-text">namelessyouthclub</p> */}
          <p className="sub-text">
            ideas unmasked
          </p>
          {currentAccount === "" ? renderNotConnectedContainer() : isLoading()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={instalogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;