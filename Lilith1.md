Lilith-Bot/
│
├── index.js                 # Main entry point (connects bot)
├── package.json            # NPM dependencies and metadata
├── config.js               # Global bot config (prefix, owner, etc.)
├── README.md               # Optional: project description
│
├── lib/                    # Core logic & system utils
│   ├── database.js         # DB logic (json / sqlite / mongo)
│   ├── function.js         # General utility functions
│   ├── loader.js           # Command/event loader
│   ├── messages.js         # Standard responses/messages
│   └── logger.js           # Logger setup (for debug/errors)
│
├── commands/               # All bot commands
│   ├── owner/              # Owner-only commands (e.g., restart, ban)
│   ├── group/              # Group features (welcome, promote, etc.)
│   ├── user/               # General commands (info, help, rank)
│   ├── ai/                 # AI-related (chatGPT, image gen, etc.)
│   ├── fun/                # Games, jokes, memes
│   ├── sticker/            # Convert media to stickers
│   └── downloader/         # YouTube, media downloader
│
├── events/                 # Message handlers, group joins, etc.
│   ├── message.js
│   ├── group-update.js
│   └── call-block.js
│
├── plugin/                 # Middleware-like features (anti-link, etc.)
│   └── antilink.js
│
├── media/                  # Bot images, audio, videos
│   ├── images/
│   └── audio/
│
├── temp/                   # Temporary storage for runtime
│   └── gcwelcome.json
│
└── king_lilith/            # Personal data or internal constants
    └── owner.json