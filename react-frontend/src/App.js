import './styles/App.css';
import instalogo from './assets/Instagram-Logo.wine.svg'
import namelesslogo from './assets/nameless.png'
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import NYCDescriptor from './utils/NYCDescriptor.json';
import NYCSeeder from './utils/NYCSeeder.json';
import LinearProgress from '@mui/material/LinearProgress';
import theme from './styles/colorsTheme'
import { ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import {mintNFT} from './functionality/SeedAndMint';
import Grid from './components/ComponentsBox';
import OwnedNFTs from './components/OwnedNFTs';

const TWITTER_HANDLE = 'namelessyouthclub';
const TWITTER_LINK = `https://instagram.com/${TWITTER_HANDLE}`;
// const OPENSEA_LINK = '';
// const TOTAL_MINT_COUNT = 50;

// I moved the contract address to the top for easy access.
const CONTRACT_SEEDER_ADDRESS = "0xa22B8bcf893f61a052f83Af6ca4AF5Fe9fA37e03";
const CONTRACT_DESCRIPTOR_ADDRESS = "0x23b6a2B1A5Bd81c35953D17FF44c87bfb248a24c";

const App = () => {

    const [currentAccount, setCurrentAccount] = useState("");
    const [myAlert, setAlert] = useState()
    const [loading, setLoading] = useState(false);
    
    const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;
      if (!ethereum) {
          console.log("Make sure you have metamask!");
          return;
      } else {
          //console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      let chainId = await ethereum.request({ method: 'eth_chainId' });
      //const rinkebyChainId = "0x4"; 
      const goerliChainId = "0x5"

      if (accounts.length !== 0) {
          const account = accounts[0];
          //console.log("Found an authorized account:", account);
          if (chainId !== goerliChainId) {
            alert("You are not connected to the Goerli Test Network!");
          }
          else {
            setCurrentAccount(account)
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

       // event if minted is completed
        connectedDescriptorContract.on("NewEpicNFTMinted", (from, tokenId) => {
          //console.log(from, tokenId.toNumber())
          setLoading(false)
          //alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_DESCRIPTOR_ADDRESS}/${tokenId.toNumber()}`)
          setAlert(<Alert onClose={() => {setAlert("")}} severity="success">NFT minted successfully -- find it below.  We are glad to have you</Alert>)
        });

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

        await mintNFT(connectedSeederContract, connectedDescriptorContract, currentAccount)
            .catch((err)=>{
              console.log(err)
              setLoading(false);
              setAlert(<Alert onClose={() => {setAlert("")}} severity="error">
                        <strong>Error: </strong>Transaction Rejected
                      </Alert>)
              })
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  function isLoading() {
    const isLoading = loading;
    if (isLoading) {
      return <ThemeProvider theme={theme} ><div className='center'> <LinearProgress className = "spinner" color= "secondary" />  </div></ThemeProvider>
    }
    return <button onClick={askContractToMintNft} className="cta-button mint-button">
         Mint NFT
       </button> ;
  }
  
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div className = "alert">{myAlert}</div>
        <div className="container">
        
          <div className="header-container">
            <img alt = "nameless-logo" src = {namelesslogo} />
            <h1 className="sub-text">ideas unmasked</h1>
            {currentAccount === "" ? renderNotConnectedContainer() : isLoading()}
          </div>
          <div className='components-container'>
          {currentAccount === "" ? <></> : <Grid />  }
          </div>
          <div className = 'components-container'>
          {currentAccount === "" ? <></> : <OwnedNFTs />  }
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
    </ThemeProvider>
  );
};

export default App;