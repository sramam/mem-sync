# mem-sync
A browser extension that creates a "mem" in [mem.ai](https;//mem.ai).

## Requirements
This is a barely tested module, and likely to be brittle.

### Environment
```
❯ node -v
v18.13.0
❯ pnpm -v
8.3.1
```
It's only been tested on chrome (Version 113.0.5672.92 (Official Build) (arm64))

## Quick start

### Clone & setup the repository
```
git clone  https://github.com/sramam/mem-sync
cd mem-sync
pnpm install
```

The extension is available at `$GIT_DIR/packages/mem-sync/dist`

### Setup API Keys 
This can be done via the browser extension too. 
The server reloads the keys when updated via the extension settings

```
# https://platform.openai.com/account/api-keys
OPENAI_API_KEY="YOUR_OPENAI_API_KEY3"
# https://mem.ai/flows/api
MEMAI_API_KEY="YOUR_MEMAI_API_KEY3"
```

### Start the server
```
pnpm start
```

### Install the extension in the browser

> installation dir: `$GIT_DIR/packages/mem-sync/dist`

> WARNING: This extension has only been tested on Google Chrome. 

For Google Chrome:

- Open the browser and navigate to chrome://extensions.
- Enable the "Developer mode" toggle.
- Click on the "Load unpacked" button and select the root folder of your extension (the directory containing the manifest.json file).
- Your extension should now be loaded and visible in the list of installed extensions.


## Installation

```
git clone  https://github.com/sramam/mem-sync
cd mem-sync
pnpm install
```

## Building
*** NOTE: You should not have to do this ***
The build output is committed to the repo for your convenience.

```
pnpm build
```
