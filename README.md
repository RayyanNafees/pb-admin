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

# Starting the server
Now start the pocketbase instance
```bash
./server/pocketbase serve
```

# Usage
Visit [http://localhost:8090](http://127.0.0.1:8090) to see your admin panel working on live changes
