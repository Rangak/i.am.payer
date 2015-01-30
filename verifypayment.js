/*
	public function redeemAll
	
	All the other functions are helper functions 
*/
/*
	Test cases: 
	https://blockchain.info/address/1EZyyYjnHrrFBna9sKC8soBLwmcredVfe2
	Admission fee: 0.01 BTC
	-Vanila 
		b75ca3d08c2e29e595afd14a81a020256c6e29ce76e82d6ff39457159226ac7d	
	-Multiple addresses input:
		57ce598ddbe20114409c92312bfc8925a0272d6d3e6f7f95968f4e2782595e08
	-Underpayment
		b75ca3d08c2e29e595afd14a81a020256c6e29ce76e82d6ff39457159226ac7d
		
	
*/
var bitcoin = require('bitcoinjs-lib');
var message = require('bitcoinjs-lib/src/message');

var merchantAddress = "1EZyyYjnHrrFBna9sKC8soBLwmcredVfe2";

/* Exceptions */
var SignatureInvalid = {};
var UnderpaidException = {};
var DifferentNumberAddressesAndSignaturesException = {};
var TokenWrongFormatException = {};

/**
	@method _blockchainCheckBtcPaidByTransaction
	
	Checks the blockchain for total payment to a merchant address in one transaction.
	Only counts the transaction if the confirmations > 0 OR confidence rating is above 50% 
	
	@param {string} merchantAddress The address that payers send admission fees to
	@param {string} transactionHash The transaction that that admission fees were sent in
	@return {int} The total value paid from the transaction in satoshis 
					to the merchant address
	
*/
function _blockchainCheckBtcPaidByTransaction(merchantAddress, transactionhHash){
	var total = 0;
	
	
	
	return total;
}

/**
	@method _checkBtcRedeemed 
	
	Checks a database for past redemptions from transaction. 
	
	@param {string} transactionHash The transaction hash of the admission fees
	@return {int} The total value redeemed from the addresses in satoshis 
			summed by the database
	
*/
function _checkBtcRedeemed(transactionHash){
	var total = 0;
	
	/* Check the local database for past redemptions */
	
	
	return total;
}

/** 
	@method redeemAll 
	
	Redeems all tickets/license at a time from one transaction and marks the database. 
	
	@param {string} token containing: 
					sending address, transaction hash, 
					payment block height, refund address, 
					signature of everything above signed by sending address
	@param {int} required admission fee in satoshis
	@return {int} 0 for successful redemption and negative for error 
	
*/
function redeemAll(token, requiredAmount){
	/* Break apart the token into separate strings */
	var brokenToken = token.split(",");
	var buyerAddress = brokenToken[0];
	var transactionHash =  brokenToken[1];
	var blockHeight = brokenToken[2];
	var refundAddress = brokenToken[3];
	var signature = brokenToken[4];
	var signatureMessage = brokenToken[0]+","+brokenToken[1]+","+brokenToken[2]+","+brokenToken[3];
	
	/* Error checking token format */
	if(brokenToken.length != 5 || 
	buyerAddress === undefined || 
	transactionHash === undefined ||
	blockHeight === undefined ||
	refundAddress === undefined ||
	signature === undefined){
		throw TokenWrongFormatException;
		return -1;
	}
	
	/* Verify signature */
	if(message.verify(buyerAddress, signature, signatureMessage) == false){
		throw SignatureInvalid;
		return -1; 
	}
	
	/* Fetch payments from the blockchain and past redemptions from local database */
	var blockchainBTC = _blockchainCheckBtcPaidByTransaction(merchantAddress, transactionHash);	
	var alreadyRedeemedBTC = _checkBtcRedeemed(transactionHash);
	var unredeemedCreditBTC = blockchainBTC - alreadyRedeemedBTC;
	var ticketsAvailable = unredeemedCreditBTC/requiredAmount;
	var remainderBTC =  unredeemedCreditBTC % requiredAmount;

	if(ticketsAvailable >= 1){
		console.log("Redeeming: "+ticketsAvailable+" tickets. Remainder: "+remainderBTC/1.0e8+" BTC");
	}
	else {
		console.log(requiredAmount/1.0e8+" BTC required, "+unredeemedCreditBTC/1.0e8+" available");
		throw UnderpaidException;
		return -1;
	}
	
	/* Write to new redemption and token to database */
	
	
	return 0;
}


/* Some test cases. Token, signature */	  
redeemAll("1Lptq9GAc8egezT11UozYQjVPxdkK9ACG1,57ce598ddbe20114409c92312bfc8925a0272d6d3e6f7f95968f4e2782595e08,341148,144QxdDSpSf41fS3rc6RxqMEsJwq63XaqF,G87b6Xfxi8vHOteekTtgMYw0fFLjOQAas+Bkzr1VuwrTWf6fyPzU2mUP+XXtFNHfVqbAxbPNwEOmXYfwqRwr6BA=", 1e6);
redeemAll("1LdgRFdQPQnGnaFDyY5uth834XmL9nsRXj,b75ca3d08c2e29e595afd14a81a020256c6e29ce76e82d6ff39457159226ac7d,341148,144QxdDSpSf41fS3rc6RxqMEsJwq63XaqF,HOypjAJF3zFgsz4ymbr7SWnsU/ONQ6iC1+s+0GXlO1ckzDf4NzMtOBJx8gVRdhwbA4kH+oiNX2cnJTYvXyygLDM=", 1e6);
redeemAll("13QxFLJiLz4dS6ktmrLxdAFHYVL9SQ2cuh,db11389128a657ece02e63517e989430803462100d9b0082a464c5d93165f647,341148,144QxdDSpSf41fS3rc6RxqMEsJwq63XaqF,GwwHuFsjAbqM8vjQpdq2pAiX9fIwkkl4LtMeIGKqv5iC6PHFxLgLHc72lTHd/IT3PJC4IaN2TVtBrvhfWJllZlU=", 1e6);

