import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';


const CONTRACT_DESCRIPTOR_ADDRESS = "0x8Bc3345e219ef14d1137435ded9f6c454F8136Af";


const tokenCard = (props) => {
    console.log("pipeline works mashallah")
    const tokenURI = props.tokenURI.substring(0, props.tokenURI.length - 1)
    const tokens = tokenURI.split("+")

    const finalTokens = []
    tokens.forEach((token) => {

        const tokenID = token.substring(0, token.indexOf("-"))
        const json = Buffer.from(token.substring(31), "base64").toString()
        const result = JSON.parse(json);
        const hash = result.image.substring(7)
        const image = "https://cloudflare-ipfs.com/ipfs/" + hash 
        const openseaURL = "https://testnets.opensea.io/assets/goerli/" + CONTRACT_DESCRIPTOR_ADDRESS + "/" + tokenID
        const goerliURL = "https://goerli.etherscan.io/token/0x8bc3345e219ef14d1137435ded9f6c454f8136af?a=" + tokenID
        const html = <Card sx={{ maxWidth: 350, borderColor: 'black' }} className = "my-card" key = {tokenID}>
                <CardMedia
                component="img"
                height="500"
                image={image}
                alt="NFT image"
                />
                <CardContent className = "card-content">
              
                <div  className='card-text' >
                    Token ID: {tokenID}
                </div>
                {/* <Typography variant="body2" color="text.secondary" className = "sub-text">
                    {result.description}
                </Typography> */}
                </CardContent>
                <CardActions className = "card-content" sx={{justifyContent: 'center'}}>
                <Button variant="contained"  sx = {{marginRight: 1}}className = "card-button" href = {openseaURL} target="_blank"><div className='button-text'>Opensea</div></Button>
                <Button variant="contained"  className = "card-button" href= {goerliURL} target="_blank"><div className = 'button-text'>Etherscan</div></Button>
                </CardActions>
            </Card>
        finalTokens.push(html)
    })

    return (<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{justifyContent: 'center'}}>{finalTokens}</Grid>)
}

export default tokenCard;