// require all the packages needed

require('dotenv').config();
const formidable = require('formidable');
const https = require('https');
const { v4: uuidv4 } = require('uuid');

// import the paytmChecksum to authenticate the payment requests
const PaytmChecksum = require('./PaytmChecksum');


// export the controller functionalities

exports.payment = (req, res) => {

    const {
        amount,
        email,
        mobileNo
    } = req.body;

    // prepare the request Object
    let params = {
        MID: process.env.PAYTM_MERCHANT_ID,
        WEBSITE: process.env.PAYTM_WEBSITE,
        CHANNEL_ID: process.env.PAYTM_CHANNEL_ID,
        INDUSTRY_TYPE_ID: process.env.PAYTM_INDUSTRY_TYPE,
        ORDER_ID: uuidv4(),
        CUST_ID: email,
        TXN_AMOUNT: amount.toString(),
        EMAIL: email,
        MOBILE_NO: mobileNo.toString(),
        CALLBACK_URL: 'https://zomato-b22-be.herokuapp.com/paymentCallback'
    }

    // use PaytmChecksum to generate a signature
    let paytmCheckSum = PaytmChecksum.generateSignature(params, process.env.PAYTM_MERCHANT_KEY);

    paytmCheckSum.then(success => {
        let paytmChecksumResp = {
            ...params,
            "CHECKSUMHASH": success
        };
        res.json(paytmChecksumResp);
    }).catch(error => {
        res.status(500).json({
            message: 'Error in Payment',
            error: error
        });
    });

}

exports.paymentCallback = (req, res) => {
    // it is called by the paytm system, Paytm server will send the transaction status here
    // we need to read this transaction details

    const form = new formidable.IncomingForm();

    form.parse(req, (error, fields, file) => {

        // check if it is an error or not
        if (error) {
            console.log(error);
            res.status(500).json({ error });
        }

        // verify the signature
        const checksumHash = fields.CHECKSUMHASH;
        const isVerified = PaytmChecksum.verifySignature(fields, process.env.PAYTM_MERCHANT_KEY, checksumHash);

        if (isVerified) {
            // response is valid and can be accepted
            // make an API call to the paytm server to get the transaction status

            let params = {
                MID: fields.MID,
                ORDER_ID: fields.ORDERID
            };

            let paytmCheckSum = PaytmChecksum.generateSignature(params, process.env.PAYTM_MERCHANT_KEY);
            paytmCheckSum
                .then(checksum => {
                    params["CHECKSUMHASH"] = checksum;
                    const data = JSON.stringify(params);
                    const reqObject = {
                        hostname: 'securegw-stage.paytm.in',
                        port: '443',
                        path: '/order/status',
                        method: 'POST',
                        header: {
                            'Content-Type': 'application/json',
                            'Content-Length': data.length
                        },
                        data: data
                    };
                    let response = "";
                    const request = https.request(reqObject, (responseFromPaytm) => {
                        responseFromPaytm.on('data', (chunk) => {
                            response += chunk;
                        });
                        responseFromPaytm.on('end', () => {
                            if (JSON.parse(response).STATUS === 'TXN_SUCCESS') {
                                // transaction is successfull
                                // Zomato BE will inform the Zomato FE
                                res.sendFile(__dirname + '/txn_success.html');
                            } else {
                                // transaction is failure
                                // Zomato BE will inform the Zomato FE
                                res.sendFile(__dirname + '/txn_failure.html');
                            }
                        });
                    });
                    request.write(data);
                    request.end();
                })
                .catch(error => {
                    res.status(500).json({
                        message: 'Error in Payment',
                        error: error
                    });
                });
        } else {
            // response is not valid
            console.log("checksum mismatch");
            res.status(500).json({
                error: "It's a hacker !!"
            });
        }

    });
}

