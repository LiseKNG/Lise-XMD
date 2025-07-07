import fs from "fs";
import path from "path";
import readline from "readline";
import pino from "pino";
import pkg from "@whiskeysockets/baileys";
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = pkg;

import { handleMessage } from "./lib/Handler.js";
import { sendWelcomeMessage } from "./plugin/welcome.js";

const logger = pino({ level: "silent" });
const DB_DIR = path.join(process.cwd(), "database");
const OWNER_FILE = path.join(DB_DIR, "owner.json");
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ASCII BANNER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TOJI_ASCII = `
████████╗ ██████╗      ██╗      ██╗  ██╗███╗   ███╗██████╗ 
╚══██╔══╝██╔═══██╗     ██║      ██║  ██║████╗ ████║██╔══██╗
   ██║   ██║   ██║     ██║      ██║  ██║██╔████╔██║██████╔╝
   ██║   ██║   ██║     ██║      ██║  ██║██║╚██╔╝██║██╔═══╝ 
   ██║   ╚██████╔╝     ███████╗ ╚█████╔╝██║ ╚═╝ ██║██║     
   ╚═╝    ╚═════╝      ╚══════╝  ╚════╝ ╚═╝     ╚═╝╚═╝     
                『 𝚃𝙾𝙹𝙸 𝚇𝙼𝙳 』W H A T S A P P  B O T
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🧠 ASK FOR OWNER INFO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function askNameAndNumber() {
  return new Promise((resolve) => {
    console.log(TOJI_ASCII);
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    rl.question("\x1b[33m👑 Enter your Name: \x1b[0m", (name) => {
      rl.question("\x1b[33m⚔️  Enter your number (without +): \x1b[0m", (number) => {
        rl.close();
        resolve({ name: name.trim(), number: number.trim() });
      });
    });
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 💾 SAVE OWNER DATA TO FILE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function saveOwnerData(name, number) {
  const data = { Name: name, Number: number };
  fs.writeFileSync(OWNER_FILE, JSON.stringify(data, null, 2));
  console.log("\x1b[32m✅ Owner info saved to database/owner.json\x1b[0m");
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🐞 SEND BUG REPORT TO OWNER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function sendBugReport(sock, error, source = "unknown") {
  try {
    if (!fs.existsSync(OWNER_FILE)) {
      console.error("❌ OWNER_FILE does not exist, cannot send bug report.");
      return;
    }
    const owner = JSON.parse(fs.readFileSync(OWNER_FILE));
    const target = `${owner.Number}@s.whatsapp.net`;
    const short = error?.message || "Unknown error";
    const text = `🐞 *Bug Report*\n📄 Source: ${source}\n\n🧨 Error: ${short}`;
    await sock.sendMessage(target, { text });
    console.log("\x1b[33m🚨 Bug reported to owner.\x1b[0m");
  } catch (err) {
    console.error("\x1b[31m❌ Failed to send bug report:\x1b[0m", err.message);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🤖 START BOT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function startBot() {
  console.clear();
  console.log(TOJI_ASCII);

  const sessionFolder = path.resolve("./TOJI-XMD-SESSION");
  if (!fs.existsSync(sessionFolder)) fs.mkdirSync(sessionFolder);

  const { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds } = await useMultiFileAuthState(sessionFolder);

  const sock = makeWASocket({
    version,
    logger,
    auth: state,
    printQRInTerminal: false,
  });

  // 🧩 Pairing System
  if (!state.creds?.registered) {
    const { name, number } = await askNameAndNumber();
    try {
      console.log(`\x1b[36m🔐 Generating Pairing Code for +${number}...\x1b[0m`);
      const code = await sock.requestPairingCode(number);
      console.log(`\x1b[36mPairing Code: ${code}\x1b[0m`);
      saveOwnerData(name, number);
    } catch (err) {
      console.error("\x1b[31m❌ Failed to generate pairing code:\x1b[0m", err.message);
      return;
    }
  }

  // 🧠 Connection Events
  sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
    const reason =
      lastDisconnect?.error?.output?.statusCode ||
      lastDisconnect?.error?.statusCode ||
      DisconnectReason.unknown;

    if (connection === "close") {
      console.log("\x1b[31m❌ Disconnect reason:\x1b[0m", reason);

      if (reason !== DisconnectReason.loggedOut) {
        console.log("\x1b[33m🔄 Reconnecting to TOJI XMD...\x1b[0m");
        startBot();
      } else {
        console.log("\x1b[31m🔒 Logged out. Delete Sessions folder and retry.\x1b[0m");
      }
    }

    if (connection === "open") {
      // Send bot info to owner on connection open
      try {
        if (!fs.existsSync(OWNER_FILE)) throw new Error("OWNER_FILE not found.");
        const owner = JSON.parse(fs.readFileSync(OWNER_FILE));
        const target = `${owner.Number}@s.whatsapp.net`;
        const botInfo = `🤖 *TOJI XMD CONNECTION*\n\nBot: TOJI XMD\nOwner: ${owner.Name}\nThis bot is now connected and ready to serve!\n\nType !help for commands.`;
        await sock.sendMessage(target, { text: botInfo });
      } catch (e) {
        console.error("❌ Failed to send bot info to owner:", e.message);
      }

      // Send welcome message via your plugin (to owner)
      try {
        if (!fs.existsSync(OWNER_FILE)) throw new Error("OWNER_FILE not found.");
        const owner = JSON.parse(fs.readFileSync(OWNER_FILE));
        const target = `${owner.Number}@s.whatsapp.net`;
        await sendWelcomeMessage(sock, target);
      } catch (e) {
        console.error("❌ Failed to send welcome message:", e.message);
      }

      // ⚙️ Listen for messages and handle with handler
      sock.ev.on("messages.upsert", async ({ messages }) => {
        for (const msg of messages) {
          try {
            await handleMessage(sock, msg);
          } catch (err) {
            await sendBugReport(sock, err, "Command Handler");
          }
        }
      });
    }
  });

  // 🔐 Save Auth Credentials
  sock.ev.on("creds.update", saveCreds);
}

startBot();