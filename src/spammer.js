//#############################################
//##                  SETUP                  ##
//#############################################

var IOTA = require('../node_modules/iota.lib.js/lib/iota');

var iota = new IOTA({
    'host': 'http://localhost',
    'port': 14265
});

var seed = generateSeed();
var address_index = 0;
var tx_address = '';
var rec_address = 'YMT9TLFHOWHE9NVZ9MS9LOGZNJW9WNCJKRUXQSFH9DVIDULZJWKNER999AUHXUSD9YIGJXRKXTUDGMBGC'; /* nowhere */

console.log('\n###########################');
console.log('##   IOTA-SPAMMER v1.0   ##');
console.log('###########################');
console.log('\nSeed: ' + seed);

//delayBefore
setTimeout(run, 5000, null);

//#############################################
//##              EXECUTION HEAD             ##
//#############################################

function run () {
  /* if (additional conditions) */
  spam();
}

//#############################################
//##                   SPAM                  ##
//#############################################

function spam () {

  var options = {
  'index': address_index,
  'total': 1
  }

  iota.api.getNewAddress(seed, options, function(error, data) {

    if (error) {
        console.error(error);
        return -1;

    } else {

        tx_address = data[0];
        console.log('Address at index[' + address_index + ']: ' + tx_address);
        address_index += 1;

        var transfersArray = [{
              'address': rec_address,
              'value': 0,
              'message': '99THIS99IS99SPAM99',
              'tag': '99THIS99IS99SPAM99'
          }]

        var inputs = [{
              'keyIndex': address_index-1,
              'address': tx_address,
              'security': 2
          }]

        iota.api.prepareTransfers(seed, transfersArray, inputs, function(error, trytes) {

          if (error) {
            console.error(error);
            return -1;

          } else {

            console.log('Attaching to Tangle...');

            iota.api.sendTrytes(trytes, 9, 15, function(error, result) {

                if (error) {
                  console.log("Error in tips selection.");
                  address_index -= 1;
                  setTimeout(run, 0, null);
                  return -1;
                } else {

                  console.log('Spam complete.');
                  //delayBetween
                  setTimeout(run, 100, null);
                  return 1;
                }
            })

          }

        })
    }
  })

}


//#############################################
//##                 HELPER                  ##
//#############################################

function generateSeed () {
 var address = "";
 var trytes = "ABCDEFGHIJKLMNOPQRSTUVWXYZ9";

 for (var i = 0; i < 81; i++)
   address += trytes.charAt(Math.floor(Math.random() * trytes.length));

 return address;
}
