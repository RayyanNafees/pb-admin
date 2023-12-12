# Pocketbase Admin Panel

A minimal MVP for your Pocketbase Admin Panel

## Tech Stack
- Astro
- Preact
- PicoCSS
- Pocketbase
- ~dexie~ _for syncing the localdb with pocketbase_
- ~Go~ _for managing the sync feature_

## Building
Once u have crafted your dashboard UI, build it to `server/pb_public` directory
```bash
bun run build
```

## Starting the server
Now start the pocketbase instance
```bash
./server/pocketbase serve
```

## Usage
Visit [http://localhost:8090](http://127.0.0.1:8090) to see your admin panel working on live changes

## Development
For development ease, u can run the Pocketbase instance `http://localhost:8090` on it's own server and code the Admin Panel on Astro Dev server `http://localhost:4321`

Just replace add the `PUBLIC_PB_URL` to a `.env` file
```env
PUBLIC_PB_URL='http://localhost:8090'
```

And run the astro dev server to develop UI, seeing changes LIVE via Astro HOT reloads without having to build and check every time u change the code
```bash
bun run dev
```

## TODO
- [ ] create it offline-first with service workers
- [ ] Use the pocketbase `/hash` endpoint to check for cloud changes to sync with the client on connection
- [ ] A method to check for user connectivity over fetch
- [ ] Storing images in IndexedDB using Dexie



---



> This project currently works on Linux, if u want to run it on any other OS (eg. Windows) do change the Pocketbase executable from `server` folder by dowloading from their [docs](https://pocketbase.io/docs)
