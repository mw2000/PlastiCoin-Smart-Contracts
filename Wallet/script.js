const testnet = `https://rinkeby.infura.io/v3/01d5d39c9b47480c929bbf0ba8796713`
const web3 = new Web3(new Web3.providers.HttpProvider(testnet))

web3.eth.defaultAccount = '0x4f42D05Cfd9Dc34ffDD75BA6735d0630C2Cf5475'
const pk = 'db3871936c75275119297c7c4adb640c4db458bb0232a0601967635d8a0fc232'
const address = '0x89077b8c765d37A5565fBC73109234bc90742722'

const abi = [{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"standard","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]

const contract = new web3.eth.Contract(abi, address, {
    from: web3.eth.defaultAccount ,
    gas: 210000,
})


const getCurrentGasPrices = async () => {
    let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json')
    let prices = {
      low: response.data.safeLow / 10,
      medium: response.data.average / 10,
      high: response.data.fast / 10
    }
   
    return prices
}

const send = async (_to, _val)=> {
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
    const transaction = new ethereumjs.Tx(details);
    transaction.sign(new ethereumjs.Buffer.Buffer.from(pk, 'hex')) 
    console.log(nonce)
    var rawData = '0x' + transaction.serialize().toString('hex');
    web3.eth.sendSignedTransaction(rawData)
    .on('transactionHash', function(hash){
        console.log(['transferToStaging Trx Hash:' + hash]);        
    })
    .on('receipt', function(receipt){
        console.log(['transferToStaging Receipt:', receipt]);
        window.alert("Transaction sent")
    })
    .on('error', console.error);
}

const getBal = async () => {
    const functionAbi = await contract.methods.balanceOf(web3.eth.defaultAccount).call()
    return functionAbi
}
