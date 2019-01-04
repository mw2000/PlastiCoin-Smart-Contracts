/**
 * Require the credentials that you entered in the .env file
 */
require('dotenv').config()
 
const Web3 = require('web3')
const axios = require('axios')
const EthereumTx = require('ethereumjs-tx')
const log = require('ololog').configure({ time: true })
const ansi = require('ansicolor').nice

/**
 * Network configuration
 */
const testnet = `https://rinkeby.infura.io/v3/01d5d39c9b47480c929bbf0ba8796713`
 
 
/**
 * Change the provider that is passed to HttpProvider to `mainnet` for live transactions.
 */
const web3 = new Web3( new Web3.providers.HttpProvider(testnet) )
 
 
/**
 * Set the web3 default account to use as your public wallet address
 */
web3.eth.defaultAccount = process.env.WALLET_ADDRESS
const abi = process.env.ABI
const address = '0x89077b8c765d37a5565fbc73109234bc90742722'

const contract = new web3.eth.Contract(JSON.parse(abi), address, {
    from: web3.eth.defaultAccount ,
    gas: 210000,
})
 
/**
 * The amount of ETH you want to send in this transaction
 * @type {Number}
 */


const getCurrentGasPrices = async () => {
    let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json')
    let prices = {
      low: response.data.safeLow / 10,
      medium: response.data.average / 10,
      high: response.data.fast / 10
    }
   
    console.log("\r\n")
    log (`Current ETH Gas Prices (in GWEI):`.cyan)
    console.log("\r\n")
    log(`Low: ${prices.low} (transaction completes in < 30 minutes)`.green)
    log(`Standard: ${prices.medium} (transaction completes in < 5 minutes)`.yellow)
    log(`Fast: ${prices.high} (transaction completes in < 2 minutes)`.red)
    console.log("\r\n")
   
    return prices
  }
   
    

const erc = async (_to, _val)=> {
    // contract.methods.transfer(_to, _val).send({from: web3.eth.defaultAccount})
    //     .then(function(receipt){
    //         // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
    //         console.log(receipt)
    // });
    let gasPrices = await getCurrentGasPrices()
    let nonce = await web3.eth.getTransactionCount(web3.eth.defaultAccount)

    const functionAbi = contract.methods.transfer(_to, _val).encodeABI();
    var details = {
        "nonce": nonce,
        "gasPrice": gasPrices.high * 1000000000,
        "gas": 210000,
        "to": address,
        "value": 0,
        "data": functionAbi,
        "chainId": 4
    };
    const transaction = new EthereumTx(details);
    transaction.sign(Buffer.from(process.env.PRIVATE_KEY, 'hex') )
    console.log(nonce)
    var rawData = '0x' + transaction.serialize().toString('hex');
    web3.eth.sendSignedTransaction(rawData)
    .on('transactionHash', function(hash){
        console.log(['transferToStaging Trx Hash:' + hash]);
        web3.eth.getTransactionReceipt(hash).then(console.log)
        
    })
    .on('receipt', function(receipt){
        console.log(['transferToStaging Receipt:', receipt]);
        process.exit()
    })
    .on('error', console.error);
}


// var tokenContract = contract.at(address)

const getBal = async () => {
    const functionAbi = await contract.methods.balanceOf(process.env.WALLET_ADDRESS).call();
    console.log(functionAbi)

}

getBal()