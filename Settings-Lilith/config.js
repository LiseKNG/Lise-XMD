/*
╭────────────────────────────────────────
│ GitHub   : https://github.com/r-serex
│ YouTube  : https://youtube.com/@zxruzx
│ WhatsApp : https://wa.me/6288980698613
│ Telegram : https://rujekaciw.t.me
╰─────────────────────────────────────────
*/

const fs = require('fs')

//~~~~~~~~~ Setting Owner ~~~~~~~~~~//
global.owner = "237655273782"
global.namaowner = "EvoSaturn"

//~~~~~~~~~ Setting Channel ~~~~~~~~~~//
global.namach = "Informasi Bot & Website 2025"
global.linkch = "https://whatsapp.com/channel/0029VbARtDPGpLHPdJIvI73a"
global.idch = "120363398454335106@newsletter"

//~~~~~~~~~ Setting Packname ~~~~~~~~~~//
global.packname = "WhatsApp Bot 2025"
global.author = "https://wa.me/237655273782"

//~~~~~~~~~ Setting Status ~~~~~~~~~~//
global.status = true
global.welcome = true

//~~~~~~~~~ Setting Apikey ~~~~~~~~~~//
global.KEY = "GET APIKEY elevenlabs.io"
global.IDVOICE = "GET ON elevenlabs.io"

global.pairing = "EVOSATURN"

//~~~~~~~~~ Setting Message ~~~~~~~~~~//
global.mess = {
    owner: "bonjour owner, j'espere que tout se passe bien pour vous ! je suis la pour vous aider et vous apportez un peu de lumiere dans votre journee", 
    group: "Hey owner & Team, hope you,re all crushing your goals today! i'm here to help and bring some positivity to our group", 
    private: "Hi owwner , hope your day is amazing! im here for you", 
}

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
