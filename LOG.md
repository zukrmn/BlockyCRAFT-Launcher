node ➜ /workspaces/BlockyCRAFT-Launcher (java-autodownload) $ npm run dev                       

> blockycraft-launcher@0.1.0 dev
> npm run electron:build && concurrently -k "npm run svelte:dev" "wait-on http://localhost:4321 && VITE_DEV_SERVER_URL=http://localhost:4321 npm run electron:start"


> blockycraft-launcher@0.1.0 electron:build
> node scripts/build-electron.mjs

✓ Electron files built successfully
[0] 
[0] > blockycraft-launcher@0.1.0 svelte:dev
[0] > vite
[0] 
[0] 
[0]   VITE v5.4.21  ready in 509 ms
[0] 
[0]   ➜  Local:   http://localhost:4321/
[0]   ➜  Network: use --host to expose
[1] 
[1] > blockycraft-launcher@0.1.0 electron:start
[1] > node scripts/start-electron.mjs
[1] 
[1] Electron binary: /workspaces/BlockyCRAFT-Launcher/node_modules/electron/dist/electron
[1] After rename: /workspaces/BlockyCRAFT-Launcher/node_modules/.electron-npm/dist/electron
[1] App path: /workspaces/BlockyCRAFT-Launcher
[1] Args: /workspaces/BlockyCRAFT-Launcher --no-sandbox --disable-gpu --ozone-platform=wayland
[1] [start-electron] Temporarily renamed node_modules/electron
[1] [15224:0111/222411.929656:ERROR:bus.cc(407)] Failed to connect to the bus: Failed to connect to socket /run/dbus/system_bus_socket: No such file or directory
[1] === BlockyCRAFT Launcher Starting ===
[1] Electron version: 33.4.11
[1] [15224:0111/222412.154841:ERROR:bus.cc(407)] Failed to connect to the bus: Failed to connect to socket /run/dbus/system_bus_socket: No such file or directory
[1] [15224:0111/222412.154897:ERROR:bus.cc(407)] Failed to connect to the bus: Failed to connect to socket /run/dbus/system_bus_socket: No such file or directory
[1] [15224:0111/222412.155997:ERROR:bus.cc(407)] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[1] [15224:0111/222412.156033:ERROR:bus.cc(407)] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[1] [15224:0111/222412.156150:ERROR:bus.cc(407)] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[1] [15224:0111/222412.156177:ERROR:bus.cc(407)] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[1] [15224:0111/222412.156276:ERROR:bus.cc(407)] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[1] Creating main window...
[1] Window created, loading content...
[1] Create Window: did-finish-load