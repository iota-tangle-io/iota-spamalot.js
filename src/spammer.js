//#############################################
//##                  SETUP                  ##
//#############################################

let IOTA = require('../node_modules/iota.lib.js/lib/iota');

let iota = new IOTA({
    'host': 'http://localhost',
    'port': 14265
});

let rec_address = 'SPPRLTTIVYUONPOPQSWGCPMZWDOMQGWFUEPKUQIVUKROCHRNCR9MXNGNQSAGLKUDX9MZQWCPFJQS9DWAY'; /* nowhere */
let seed = generateSeed();
var address_index = 0;
var tx_address = '';

let tag = '999SPAMALOT';

let round = 0;
var tps = 0.0;
var success = 0.0;

let depth = process.argv[2] || 4;
let timeout = process.argv[3] || 0;
let debug = process.argv[4] || true;

console.log('\n###########################');
console.log('##   IOTA-SPAMMER v1.1   ##');
console.log('###########################');
console.log('\nseed: ' + seed);
console.log('tag:  ' + tag + '\n');

//delayBefore
setTimeout(run, 1000, null);

//#############################################
//##              EXECUTION HEAD             ##
//#############################################

function run () {

  if (!stopSignal()) {
    round += 1;
    spam();
  } else {
    setTimeout(run, 30000, null);
  }
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
        dbg(round + '.');
        dbg('address: ' + tx_address);
        address_index += 1;

        var transfersArray = [{
              'address': rec_address,
              'value': 0,
              'message': '999JS999ONEPOINTONE',
              'tag': tag
          }]

        var inputs = [{
              'keyIndex': address_index-1,
              'address': tx_address,
              'security': 1
          }]

        iota.api.prepareTransfers(seed, transfersArray, inputs, function(error, trytes) {

          if (error) {
            console.error(error);
            return -1;

          } else {

            iota.api.sendTrytes(trytes, depth, 14, function(error, result) {

                if (error) {
                  dbg('status:  error in tips selection\n');
                  address_index -= 1;
                  setTimeout(run, 0, null);
                  return -1;
                } else {
                  success += 1;
                  dbg('hash:    ' + result[0].hash);
                  dbg('status:  finished');
                  dbg('success: ' + success * 100.0 / round + '%\n');
                  setTimeout(run, timeout, null);
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

function stopSignal () {

    return false;
    // return (lastTxWithControlTag().signal == run ? false : true);
}

function generateSeed () {
 var address = "";
 var trytes = "ABCDEFGHIJKLMNOPQRSTUVWXYZ9";

 for (var i = 0; i < 81; i++)
   address += trytes.charAt(Math.floor(Math.random() * trytes.length));

 return address;
}

function dbg (msg) {
  if (debug)
    console.log(msg);
}
