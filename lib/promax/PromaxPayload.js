'use strict'

const encryptionTable = [9, 6, 3, 8, 10, 0, 2, 12, 4, 14, 7, 5, 1, 15, 11, 13, 9];
const decryptionTable = [5, 12, 6, 2, 8, 11, 1, 10, 3, 0, 4, 14, 7, 15, 9, 13];

function decryptPayload(payload) {
    const data = payload.slice();

    data.push(...data.splice(0,2)); //shift 2 bits left & copy bit 27/28 to bit 1/2
    let mn = data.reduce((r, n, i) => {
        if(i%4 === 0)
            r.unshift(0);
        r[0] = (r[0] << 1) + n;
        return r;
    }, []); // create reversed array of nibbles needed for decryption
    mn[6] = mn[6] ^9; // no decryption

    //XOR decryption 2 rounds
    for (let r = 0; r <= 1; r++) {      // Run 2 decryption rounds
        for (let i = 5; i >= 1; i--) {  //decrypt 4 nibbles
            mn[i] = ((decryptionTable[mn[i]] - r) & 0x0F) ^ mn[i-1]; // decrypted with predecessor & key
        }
        mn[0] = (decryptionTable[mn[0]] - r) & 0x0F; //decrypt first nibble
    }

  return {
        address: mn.slice(2, 6).reduce((r, n, i) => r + (n << i*4), 0),
        state: !!(((mn[1] >> 1) & 1) + (mn[6] & 0x7) + ((mn[6] & 0x8) >> 4)),
        count: (mn[1] >> 2),
        unit: mn[0],
        // create a hex string for the unit from 4 integers
    }
}

function encryptPayload({ address, unit, state, count }) {
    // variables needed for encryption
    let mn = []; //message separated in nibbles
    const rcd = count; //rolling code, not needed for Homey so always 1
    let cmd = 0;
    // Translating the correct Homey dim level to Promax dim level.
    // 0 = off, 2..9 = brightness level >0% - 100%. cmd 1 is reserved to put the light in sweeping mode to set the dim
    // level from a remote with only on/off. This is not used by Homey.
    if(typeof state === 'number') {
        cmd = Math.ceil(state * 8);
        if(cmd > 0) {
          cmd += 1;
        }
    }
    else {
      cmd = state ? 1 : 0;
    }

    const txID = address;

    mn[0] = unit;                              // mn[0] = iiiib i=receiver-ID (unit on Homey)
    mn[1] = (rcd << 2) & 0xF;                       // 2 lowest bits of rolling-code s=ON/OFF, 0=const 0?
    if (cmd > 0) { mn[1] |= 2; }                    // ON or OFF
    mn[2] = txID & 0xF;                             // mn[2..5] = ttttb t=txID in nibbles -> 4x ttttb
    mn[3] = (txID >> 4) & 0xF;
    mn[4] = (txID >> 8) & 0xF;
    mn[5] = (txID >> 12) & 0xF;
    if (cmd >= 2 && cmd <= 9) {                     // mn[6] = dpppb d = dim ON/OFF, p=%dim/10 - 1
        mn[6] = cmd - 2;                            // dim: 0=10%..7=80%
        mn[6] |= 8;                                 // dim: ON
    } else {
        mn[6] = 0;                                  // dim: OFF
    }

    //XOR encryption 2 rounds
    for (let r=0; r<=1; r++) {                      // 2 encryption rounds
        mn[0] = encryptionTable[ mn[0]-r+1];        // encrypt first nibble
        for (let i=1; i<=5 ; i++) {                 // encrypt 4 nibbles
            mn[i] = encryptionTable[(mn[i] ^ mn[i-1])-r+1];		// crypted with predecessor & key
        }
    }
    mn[6] = mn[6] ^ 9;                              // no  encryption

    const payload = mn.reduce((r, n) => {
        for(let i =0; i < 4; i++) {
            r.unshift((n >> i) &1);
        }
        return r;
    }, []);
  // shift 2 bits right & copy lowest 2 bits of cbuf[0] in msg bit 27/28
    payload.unshift(...payload.splice(-2));

    return payload;
}

module.exports.decryptPayload = decryptPayload;
module.exports.encryptPayload = encryptPayload
