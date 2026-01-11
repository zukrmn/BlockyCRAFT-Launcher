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
[0]   VITE v5.4.21  ready in 484 ms
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
[1] [12132:0111/214658.301170:ERROR:bus.cc(407)] Failed to connect to the bus: Failed to connect to socket /run/dbus/system_bus_socket: No such file or directory
[1] === BlockyCRAFT Launcher Starting ===
[1] Electron version: 33.4.11
[1] [12132:0111/214658.548272:ERROR:bus.cc(407)] Failed to connect to the bus: Failed to connect to socket /run/dbus/system_bus_socket: No such file or directory
[1] [12132:0111/214658.548312:ERROR:bus.cc(407)] Failed to connect to the bus: Failed to connect to socket /run/dbus/system_bus_socket: No such file or directory
[1] [12132:0111/214658.549432:ERROR:bus.cc(407)] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[1] [12132:0111/214658.549456:ERROR:bus.cc(407)] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[1] [12132:0111/214658.549565:ERROR:bus.cc(407)] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[1] [12132:0111/214658.549620:ERROR:bus.cc(407)] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[1] [12132:0111/214658.549704:ERROR:bus.cc(407)] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[1] Creating main window...
[1] Window created, loading content...
[1] Create Window: did-finish-load
[1] Requesting game launch... { username: 'zukerman_' }
[1] [JavaManager] No Java found, downloading...
[1] [JavaManager] Downloading from: https://api.adoptium.net/v3/binary/latest/17/ga/linux/x64/jre/hotspot/normal/eclipse
[1] [JavaManager] Download complete: /home/node/.config/blockycraft-launcher/java/temurin-17-jre.tar.gz
[1] [JavaManager] Extracting...
[1] [JavaManager] Java installed at: /home/node/.config/blockycraft-launcher/java/jdk-17.0.17+10-jre/bin/java
[1] Found libraries.zip, extracting...
[1] Libraries extracted successfully.
[1] [Cache] Found library (maven struct): asm
[1] [Cache] Found library (maven struct): asm-analysis
[1] [Cache] Found library (maven struct): asm-commons
[1] [Cache] Found library (maven struct): asm-tree
[1] [Cache] Found library (maven struct): asm-util
[1] [Cache] Found library (maven struct): sponge-mixin
[1] [Cache] Found library (maven struct): commons-lang3
[1] [Cache] Found library (maven struct): commons-io
[1] [Cache] Found library (maven struct): commons-codec
[1] [Cache] Found library (maven struct): jutils
[1] [Cache] Found library (maven struct): jinput
[1] [Cache] Found library (maven struct): lwjgl
[1] [Cache] Found library (maven struct): lwjgl_util
[1] [Cache] Found library (maven struct): guava
[1] [Cache] Found library (maven struct): failureaccess
[1] [Cache] Found native library locally: lwjgl-platform-2.9.4+legacyfabric.9-natives-linux.jar
[1] [Cache] Found native library locally: jinput-platform-2.0.5-natives-linux.jar
[1] Spawning java: /home/node/.config/blockycraft-launcher/java/jdk-17.0.17+10-jre/bin/java
[1] Args: [
[1]   '-Djava.library.path=/home/node/.config/blockycraft-launcher/instances/default/.minecraft/bin/natives',
[1]   '-Dorg.lwjgl.librarypath=/home/node/.config/blockycraft-launcher/instances/default/.minecraft/bin/natives',
[1]   '-Dfabric.gameJarPath=/home/node/.config/blockycraft-launcher/instances/default/.minecraft/bin/minecraft.jar',
[1]   '-Dfabric.gameVersion=b1.7.3',
[1]   '-Dfabric.envType=client',
[1]   '-cp',
[1]   '/home/node/.config/blockycraft-launcher/instances/default/libraries/libraries/org/ow2/asm/asm/9.7.1/asm-9.7.1.jar:/home/node/.config/blockycraft-launcher/instances/default/libraries/libraries/org/ow2/asm/asm-analysis/9.7.1/asm-analysis-9.7.1.jar:/home/node/.config/blockycraft-launcher/instances/default/libraries/libraries/org/ow2/asm/asm-commons/9.7.1/asm-commons-9.7.1.jar:/home/node/.config/blockycraft-launcher/instances/default/libraries/libraries/org/ow2/asm/asm-tree/9.7.1/asm-tree-9.7.1.jar:/home/node/.config/blockycraft-launcher/instances/default/libraries/libraries/org/ow2/asm/asm-util/9.7.1/asm-util-9.7.1.jar:/home/node/.config/blockycraft-launcher/instances/default/libraries/libraries/net/fabricmc/sponge-mixin/0.15.3+mixin.0.8.7/sponge-mixin-0.15.3+mixin.0.8.7.jar:/home/node/.config/blockycraft-launcher/instances/default/libraries/libraries/org/apache/commons/commons-lang3/3.12.0/commons-lang3-3.12.0.jar:/home/node/.config/blockycraft-launcher/instances/default/libraries/libraries/commons-io/commons-io/2.11.0/commons-io-2.11.0.jar:/home/node/.config/blockycraft-launcher/instances/default/libraries/libraries/commons-codec/commons-codec/1.15/commons-codec-1.15.jar:/home/node/.config/blockycraft-launcher/instances/default/libraries/libraries/net/java/jutils/jutils/1.0.0/jutils-1.0.0.jar:/home/node/.config/blockycraft-launcher/instances/default/libraries/libraries/net/java/jinput/jinput/2.0.5/jinput-2.0.5.jar:/home/node/.config/blockycraft-launcher/instances/default/libraries/libraries/org/lwjgl/lwjgl/lwjgl/2.9.4+legacyfabric.9/lwjgl-2.9.4+legacyfabric.9.jar:/home/node/.config/blockycraft-launcher/instances/default/libraries/libraries/org/lwjgl/lwjgl/lwjgl_util/2.9.4+legacyfabric.9/lwjgl_util-2.9.4+legacyfabric.9.jar:/home/node/.config/blockycraft-launcher/instances/default/libraries/log4j-api-2.22.1.jar:/home/node/.config/blockycraft-launcher/instances/default/libraries/log4j-core-2.22.1.jar:/home/node/.config/blockycraft-launcher/instances/default/libraries/libraries/com/google/guava/guava/31.0.1-jre/guava-31.0.1-jre.jar:/home/node/.config/blockycraft-launcher/instances/default/libraries/libraries/com/google/guava/failureaccess/1.0.1/failureaccess-1.0.1.jar:/home/node/.config/blockycraft-launcher/instances/default/libraries/fabric-loader-0.16.7.jar:/home/node/.config/blockycraft-launcher/instances/default/libraries/intermediary-upstream-b1.7.3.jar:/home/node/.config/blockycraft-launcher/instances/default/.minecraft/bin/minecraft.jar',
[1]   'net.fabricmc.loader.impl.launch.knot.KnotClient',
[1]   '--username',
[1]   'zukerman_',
[1]   '--gameDir',
[1]   '/home/node/.config/blockycraft-launcher/instances/default/.minecraft',
[1]   '--assetsDir',
[1]   '/home/node/.config/blockycraft-launcher/instances/default/.minecraft/resources',
[1]   '--assetIndex',
[1]   'truly_legacy',
[1]   '--server',
[1]   '185.100.215.195',
[1]   '--port',
[1]   '25565'
[1] ]
[1] [MC]: 21:47:17.011 [main] INFO  GCAPI3 - Loading config factories.
[1] 
[1] [MC]: 21:47:17.062 [main] INFO  GCAPI3 - 14 config load factories loaded.
[1] 
[1] [MC]: 21:47:17.066 [main] INFO  GCAPI3 - 14 config save factories loaded.
[1] 
[1] [MC]: 21:47:17.067 [main] INFO  GCAPI3 - 0 config load transformer factories loaded.
[1] 
[1] [MC]: 21:47:17.067 [main] INFO  GCAPI3 - Loading config event listeners.
[1] 
[1] [MC]: 21:47:17.069 [main] INFO  GCAPI3 - Loaded config event listeners.
[1] 
[1] [MC]: 21:47:17.255 [main] INFO  GCAPI3 - Successfully read "alwaysmoreitems:config"'s mod configs, reading 1 categories, and 13 values.
[1] 
[1] [MC]: 21:47:17.336 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 13 values for Always More Items(alwaysmoreitems).
[1] 
[1] [MC]: 21:47:17.354 [main] INFO  GCAPI3 - Successfully read "inventorytweaks:inventoryTweaks"'s mod configs, reading 5 categories, and 22 values.
[1] 
[1] [MC]: 21:47:17.366 [main] INFO  GCAPI3 - Successfully saved 4 categories, containing 22 values for InventoryTweaks(inventorytweaks).
[1] 
[1] [MC]: 21:47:17.374 [main] INFO  GCAPI3 - Successfully read "item_3d:item3d_config"'s mod configs, reading 1 categories, and 1 values.
[1] 
[1] [MC]: 21:47:17.379 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 1 values for 3D Dropped Item(item_3d).
[1] 
[1] [MC]: 21:47:17.384 [main] INFO  GCAPI3 - Successfully read "station-api-configuration:config"'s mod configs, reading 1 categories, and 1 values.
[1] 
[1] [MC]: 21:47:17.387 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 1 values for Station API Configuration(station-api-configuration).
[1] 
[1] [MC]: 21:47:17.403 [main] INFO  GCAPI3 - Successfully read "unitweaks:general"'s mod configs, reading 1 categories, and 6 values.
[1] 
[1] [MC]: 21:47:17.414 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 6 values for UniTweaks(unitweaks).
[1] 
[1] [MC]: 21:47:17.423 [main] INFO  GCAPI3 - Successfully read "unitweaks:userinterface"'s mod configs, reading 4 categories, and 21 values.
[1] 
[1] [MC]: 21:47:17.434 [main] INFO  GCAPI3 - Successfully saved 3 categories, containing 21 values for UniTweaks(unitweaks).
[1] 
[1] [MC]: 21:47:17.444 [main] INFO  GCAPI3 - Successfully read "unitweaks:gameplay"'s mod configs, reading 1 categories, and 5 values.
[1] 
[1] [MC]: 21:47:17.447 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 5 values for UniTweaks(unitweaks).
[1] 
[1] [MC]: 21:47:17.454 [main] INFO  GCAPI3 - Successfully read "unitweaks:features"'s mod configs, reading 3 categories, and 13 values.
[1] 
[1] [MC]: 21:47:17.464 [main] INFO  GCAPI3 - Successfully saved 2 categories, containing 13 values for UniTweaks(unitweaks).
[1] 
[1] [MC]: 21:47:17.473 [main] INFO  GCAPI3 - Successfully read "unitweaks:tweaks"'s mod configs, reading 1 categories, and 16 values.
[1] 
[1] [MC]: 21:47:17.483 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 16 values for UniTweaks(unitweaks).
[1] 
[1] [MC]: 21:47:17.498 [main] INFO  GCAPI3 - Successfully read "unitweaks:bugfixes"'s mod configs, reading 1 categories, and 30 values.
[1] 
[1] [MC]: 21:47:17.510 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 30 values for UniTweaks(unitweaks).
[1] 
[1] [MC]: 21:47:17.517 [main] INFO  GCAPI3 - Successfully read "unitweaks:oldfeatures"'s mod configs, reading 1 categories, and 9 values.
[1] 
[1] [MC]: 21:47:17.520 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 9 values for UniTweaks(unitweaks).
[1] 
[1] [MC]: 21:47:17.530 [main] INFO  GCAPI3 - Successfully read "unitweaks:recipes"'s mod configs, reading 4 categories, and 26 values.
[1] 
[1] [MC]: 21:47:17.536 [main] INFO  GCAPI3 - Successfully saved 3 categories, containing 26 values for UniTweaks(unitweaks).
[1] 
[1] [MC-Err]: SLF4J(W): No SLF4J providers were found.
[1] 
[1] [MC-Err]: SLF4J(W): Defaulting to no-operation (NOP) logger implementation
[1] SLF4J(W): See https://www.slf4j.org/codes.html#noProviders for further details.
[1] 
[1] [MC]: 21:47:17.742 [main] INFO  Station|API - Initializing Station API...
[1] 
[1] [MC]: 21:47:17.742 [main] INFO  Station|API - Loading entrypoints...
[1] 
[1] [MC]: 21:47:17.839 [main] INFO  Station|API - Setting up "alwaysmoreitems" "stationapi:event_bus" "net.glasslauncher.mods.alwaysmoreitems.util.AlwaysMoreItems" entrypoint...
[1] 
[1] [MC]: 21:47:17.918 [main] INFO  Station|API - Setting up "alwaysmoreitems" "stationapi:event_bus" "net.glasslauncher.mods.alwaysmoreitems.init.CommonInit" entrypoint...
[1] 
[1] [MC]: 21:47:17.955 [main] INFO  Station|API - Setting up "alwaysmoreitems" "stationapi:event_bus" "net.glasslauncher.mods.alwaysmoreitems.init.AfterBlockAndItemListener" entrypoint...
[1] 
[1] [MC]: 21:47:17.971 [main] INFO  Station|API - Setting up "alwaysmoreitems" "stationapi:event_bus" "net.glasslauncher.mods.alwaysmoreitems.init.ActionButtonListener" entrypoint...
[1] 
[1] [MC]: 21:47:17.975 [main] INFO  Station|API - Setting up "keyf3" "stationapi:event_bus" "io.github.yunivers.keyf3.events.init.InitListener" entrypoint...
[1] 
[1] [MC]: 21:47:18.044 [main] INFO  Station|API - Setting up "smoothbeta" "stationapi:event_bus" "net.mine_diver.smoothbeta.SmoothBeta" entrypoint...
[1] 
[1] [MC]: 21:47:18.047 [main] INFO  Station|API - Setting up "station-api-base" "stationapi:event_bus" "net.modificationstation.stationapi.impl.mod.DeprecatedInitEventsImpl" entrypoint...
[1] 
[1] [MC]: 21:47:18.235 [main] INFO  Station|API - Setting up "station-blockitems-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.block.HasMetaBlockItemImpl" entrypoint...
[1] 
[1] [MC]: 21:47:18.240 [main] INFO  Station|API - Setting up "station-blockitems-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.block.HasMetaNamedBlockItemImpl" entrypoint...
[1] 
[1] [MC]: 21:47:18.242 [main] INFO  Station|API - Setting up "station-blockitems-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.block.HasCustomBlockItemFactoryImpl" entrypoint...
[1] 
[1] [MC]: 21:47:18.244 [main] INFO  Station|API - Setting up "station-blockitems-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.block.BlockFormOnlyHandler" entrypoint...
[1] 
[1] [MC]: 21:47:18.247 [main] INFO  Station|API - Setting up "station-effects-api-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.effect.EffectsRegisterListener" entrypoint...
[1] 
[1] [MC]: 21:47:18.433 [main] INFO  Station|API - Setting up "station-flattening-v0" "stationapi:event_bus" "net.modificationstation.stationapi.api.block.States" entrypoint...
[1] 
[1] [MC]: 21:47:18.437 [main] INFO  Station|API - Setting up "station-flattening-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.block.PlacementStateImpl" entrypoint...
[1] 
[1] [MC]: 21:47:18.440 [main] INFO  Station|API - Setting up "station-flattening-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.world.WorldDataVersionImpl" entrypoint...
[1] 
[1] [MC]: 21:47:18.444 [main] INFO  Station|API - Setting up "station-flattening-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.block.BlockInteractionImpl" entrypoint...
[1] 
[1] [MC]: 21:47:18.448 [main] INFO  Station|API - Setting up "station-items-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.entity.player.ItemCustomReachImpl" entrypoint...
[1] 
[1] [MC]: 21:47:18.454 [main] INFO  Station|API - Setting up "station-items-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.dispenser.CustomDispenseBehaviorImpl" entrypoint...
[1] 
[1] [MC]: 21:47:18.459 [main] INFO  Station|API - Setting up "station-networking-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.network.packet.StationNetworkingInit" entrypoint...
[1] 
[1] [MC]: 21:47:18.465 [main] INFO  Station|API - Setting up "station-recipes-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.recipe.json.JsonRecipeParserRegisterImpl" entrypoint...
[1] 
[1] [MC]: 21:47:18.473 [main] INFO  Station|API - Setting up "station-recipes-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.recipe.JsonRecipeParserInit" entrypoint...
[1] 
[1] [MC]: 21:47:18.606 [main] INFO  Station|API - Setting up "station-recipes-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.recipe.JsonRecipesLoader" entrypoint...
[1] 
[1] [MC]: 21:47:18.628 [main] INFO  Station|API - Setting up "station-recipes-v0" "stationapi:event_bus" "net.modificationstation.stationapi.api.recipe.FuelRegistry" entrypoint...
[1] 
[1] [MC]: 21:47:18.629 [main] INFO  Station|API - Setting up "station-registry-api-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.registry.WorldRegistryRemapper" entrypoint...
[1] 
[1] [MC]: 21:47:18.636 [main] INFO  Station|API - Setting up "station-registry-api-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.registry.TagReloaderImpl" entrypoint...
[1] 
[1] [MC]: 21:47:18.641 [main] INFO  Station|API - Setting up "station-registry-sync-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.network.RegistryNetworkingInit" entrypoint...
[1] 
[1] [MC]: 21:47:18.666 [main] INFO  Station|API - Setting up "station-resource-loader-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.resource.DataReloaderImpl" entrypoint...
[1] 
[1] [MC]: 21:47:18.673 [main] INFO  Station|API - Setting up "station-tools-api-v1" "stationapi:event_bus" "net.modificationstation.stationapi.impl.item.HijackShearsImplV1" entrypoint...
[1] 
[1] [MC]: 21:47:18.694 [main] INFO  Station|API - Setting up "station-vanilla-checker-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.network.VanillaChecker" entrypoint...
[1] 
[1] [MC]: 21:47:18.699 [main] INFO  Station|API - Setting up "station-vanilla-fix-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.vanillafix.block.VanillaBlockFixImpl" entrypoint...
[1] 
[1] [MC]: 21:47:18.705 [main] INFO  Station|API - Setting up "station-vanilla-fix-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.vanillafix.item.VanillaItemFixImpl" entrypoint...
[1] 
[1] [MC]: 21:47:18.709 [main] INFO  Station|API - Setting up "station-vanilla-fix-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.vanillafix.dimension.VanillaDimensionFixImpl" entrypoint...
[1] 
[1] [MC]: 21:47:18.713 [main] INFO  Station|API - Setting up "station-vanilla-fix-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.vanillafix.recipe.VanillaFuelItemFixImpl" entrypoint...
[1] 
[1] [MC]: 21:47:18.725 [main] INFO  Station|API - Setting up "station-vanilla-fix-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.vanillafix.datafixer.VanillaDataFixerImpl" entrypoint...
[1] 
[1] [MC]: 21:47:18.731 [main] INFO  Station|API - Setting up "station-worldgen-api-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.worldgen.WorldgenListener" entrypoint...
[1] 
[1] [MC]: 21:47:18.736 [main] INFO  Station|API - Setting up "unitweaks" "stationapi:event_bus" "net.danygames2014.unitweaks.event.InitListener" entrypoint...
[1] 
[1] [MC]: 21:47:18.774 [main] INFO  Station|API - Setting up "unitweaks" "stationapi:event_bus" "net.danygames2014.unitweaks.tweaks.recipes.RecipeListener" entrypoint...
[1] 
[1] [MC]: 21:47:18.776 [main] INFO  Station|API - Setting up "unitweaks" "stationapi:event_bus" "net.danygames2014.unitweaks.tweaks.recipes.FurnaceRecipeListener" entrypoint...
[1] 
[1] [MC]: 21:47:18.779 [main] INFO  Station|API - Setting up "unitweaks" "stationapi:event_bus" "net.danygames2014.unitweaks.bugfixes.slabminingfix.MiningListener" entrypoint...
[1] 
[1] [MC]: 21:47:18.802 [main] INFO  Station|API - Setting up "alwaysmoreitems" "stationapi:event_bus_client" "net.glasslauncher.mods.alwaysmoreitems.init.ClientInit" entrypoint...
[1] 
[1] [MC]: 21:47:18.805 [main] INFO  Station|API - Setting up "alwaysmoreitems" "stationapi:event_bus_client" "net.glasslauncher.mods.alwaysmoreitems.init.KeybindListener" entrypoint...
[1] 
[1] [MC]: 21:47:18.813 [main] INFO  Station|API - Setting up "alwaysmoreitems" "stationapi:event_bus_client" "net.glasslauncher.mods.alwaysmoreitems.gui.AMITooltipSystem" entrypoint...
[1] 
[1] [MC]: 21:47:19.281 [main] INFO  Station|API - Setting up "betterf3" "stationapi:event_bus_client" "ralf2oo2.betterf3.Betterf3" entrypoint...
[1] 
[1] [MC]: 21:47:19.283 [main] INFO  Station|API - Setting up "dynamic_light" "stationapi:event_bus_client" "farn.dynamicLight.DynamicLight" entrypoint...
[1] 
[1] [MC]: 21:47:19.344 [main] INFO  Station|API - Setting up "keyf3" "stationapi:event_bus_client" "io.github.yunivers.keyf3.registry.F3BindRegistry" entrypoint...
[1] 
[1] [MC]: 21:47:19.368 [main] INFO  Station|API - Setting up "keyf3" "stationapi:event_bus_client" "io.github.yunivers.keyf3.events.init.BindListener" entrypoint...
[1] 
[1] [MC]: 21:47:19.371 [main] INFO  Station|API - Setting up "rei_minimap" "stationapi:event_bus_client" "reifnsk.minimap.stationapi.ReiMinimapStationAPI" entrypoint...
[1] 
[1] [MC]: 21:47:19.375 [main] INFO  Station|API - Setting up "smoothbeta" "stationapi:event_bus_client" "net.mine_diver.smoothbeta.client.SmoothBetaClient" entrypoint...
[1] 
[1] [MC]: 21:47:19.379 [main] INFO  Station|API - Setting up "smoothbeta" "stationapi:event_bus_client" "net.mine_diver.smoothbeta.client.render.Shaders" entrypoint...
[1] 
[1] [MC]: 21:47:19.390 [main] INFO  Station|API - Setting up "station-achievements-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.gui.screen.achievement.AchievementPageImpl" entrypoint...
[1] 
[1] [MC]: 21:47:19.469 [main] INFO  Station|API - Setting up "station-container-api-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.network.GuiClientNetworkHandler" entrypoint...
[1] 
[1] [MC]: 21:47:19.765 [main] INFO  Station|API - Setting up "station-entities-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.network.EntityClientNetworkHandler" entrypoint...
[1] 
[1] [MC]: 21:47:19.768 [main] INFO  Station|API - Setting up "station-gui-api-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.gui.screen.EditWorldScreenImpl" entrypoint...
[1] 
[1] [MC]: 21:47:19.771 [main] INFO  Station|API - Setting up "station-items-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.render.item.CustomItemOverlayImpl" entrypoint...
[1] 
[1] [MC]: 21:47:19.775 [main] INFO  Station|API - Setting up "station-items-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.gui.screen.container.CustomTooltipRendererImpl" entrypoint...
[1] 
[1] [MC]: 21:47:19.781 [main] INFO  Station|API - Setting up "station-localization-api-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.api.resource.language.LanguageManager" entrypoint...
[1] 
[1] [MC]: 21:47:19.786 [main] INFO  Station|API - Setting up "station-registry-sync-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.registry.ClientServerRegistryRemapper" entrypoint...
[1] 
[1] [MC]: 21:47:19.788 [main] INFO  Station|API - Setting up "station-registry-sync-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.registry.ClientRegistryRestorer" entrypoint...
[1] 
[1] [MC]: 21:47:19.824 [main] INFO  Station|API - Setting up "station-renderer-api-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.texture.StationRenderImpl" entrypoint...
[1] 
[1] [MC]: 21:47:19.836 [main] INFO  Station|API - Setting up "station-renderer-arsenic" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.arsenic.Arsenic" entrypoint...
[1] 
[1] [MC]: 21:47:19.843 [main] INFO  Station|API - Setting up "station-resource-loader-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.resource.AssetsReloaderImpl" entrypoint...
[1] 
[1] [MC]: 21:47:19.846 [main] INFO  Station|API - Setting up "station-vanilla-checker-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.network.ClientVanillaChecker" entrypoint...
[1] 
[1] [MC]: 21:47:19.859 [main] INFO  Station|API - Setting up "station-vanilla-fix-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.vanillafix.client.gui.screen.EditWorldScreenImpl" entrypoint...
[1] 
[1] [MC]: 21:47:19.884 [main] INFO  Station|API - Setting up "station-vanilla-fix-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.vanillafix.client.color.block.VanillaBlockColorProviders" entrypoint...
[1] 
[1] [MC]: 21:47:19.934 [main] INFO  Station|API - Setting up "unitweaks" "stationapi:event_bus_client" "net.danygames2014.unitweaks.tweaks.morekeybinds.KeyPressedListener" entrypoint...
[1] 
[1] [MC]: 21:47:20.076 [main] INFO  Station|API - Setting up "unitweaks" "stationapi:event_bus_client" "net.danygames2014.unitweaks.tweaks.morekeybinds.KeyBindingListener" entrypoint...
[1] 
[1] [MC]: 21:47:20.077 [main] INFO  Station|API - Setting up "unitweaks" "stationapi:event_bus_client" "net.danygames2014.unitweaks.bugfixes.grassblockitemfix.ColorProviderListener" entrypoint...
[1] 
[1] [MC]: 21:47:20.077 [main] INFO  Station|API - Invoking Init event...
[1] 
[1] [MC]: 21:47:20.180 [main] INFO  Station|API - Searching for JSON recipes...
[1] 
[1] [MC]: 21:47:20.204 [main] INFO  Station|API - Gathering mods that require client verification...
[1] 
[1] [MC]: 21:47:20.210 [main] INFO  Arsenic - Registering Arsenic renderer!
[1] 
[1] [MC]: 21:47:20.233 [main] INFO  keyf3|Mod - keyf3
[1] 
[1] [MC]: 21:47:20.238 [main] INFO  dynamic_light|Mod - Dynamic Light Mod initialized.
[1] 
[1] [MC]: 21:47:20.243 [main] INFO  dynamic_light|Mod - 50
[1] 
[1] [MC]: 21:47:20.243 [main] INFO  dynamic_light|Mod - 89
[1] 21:47:20.243 [main] INFO  dynamic_light|Mod - 74
[1] 21:47:20.243 [main] INFO  dynamic_light|Mod - 348
[1] 21:47:20.243 [main] INFO  dynamic_light|Mod - 76
[1] 
[1] [MC]: 21:47:20.245 [main] INFO  Station|API - Finished Station API setup.
[1] 
[1] [MC-Err]: Authorization required, but no authorization protocol specified
[1] 
[1] 
[1] [MC]: 21:47:20.442 [main] ERROR FabricLoader - Minecraft has crashed!
[1] net.fabricmc.loader.impl.FormattedException: java.awt.AWTError: Can't connect to X11 window server using ':0' as the value of the DISPLAY variable.
[1]     at net.fabricmc.loader.impl.FormattedException.ofLocalized(FormattedException.java:63) ~[fabric-loader-0.16.7.jar:?]
[1]     at net.fabricmc.loader.impl.game.minecraft.MinecraftGameProvider.launch(MinecraftGameProvider.java:482) ~[fabric-loader-0.16.7.jar:?]
[1]     at net.fabricmc.loader.impl.launch.knot.Knot.launch(Knot.java:74) [fabric-loader-0.16.7.jar:?]
[1]     at net.fabricmc.loader.impl.launch.knot.KnotClient.main(KnotClient.java:23) [fabric-loader-0.16.7.jar:?]
[1] Caused by: java.awt.AWTError: Can't connect to X11 window server using ':0' as the value of the DISPLAY variable.
[1]     at java.desktop/sun.awt.X11GraphicsEnvironment.initDisplay(Native Method) ~[?:?]
[1]     at java.desktop/sun.awt.X11GraphicsEnvironment$1.run(Unknown Source) ~[?:?]
[1]     at java.base/java.security.AccessController.doPrivileged(Unknown Source) ~[?:?]
[1]     at java.desktop/sun.awt.X11GraphicsEnvironment.initStatic(Unknown Source) ~[?:?]
[1]     at java.desktop/sun.awt.X11GraphicsEnvironment.<clinit>(Unknown Source) ~[?:?]
[1]     at java.desktop/sun.awt.PlatformGraphicsInfo.createGE(Unknown Source) ~[?:?]
[1]     at java.desktop/java.awt.GraphicsEnvironment$LocalGE.createGE(Unknown Source) ~[?:?]
[1]     at java.desktop/java.awt.GraphicsEnvironment$LocalGE.<clinit>(Unknown Source) ~[?:?]
[1]     at java.desktop/java.awt.GraphicsEnvironment.getLocalGraphicsEnvironment(Unknown Source) ~[?:?]
[1]     at java.desktop/sun.awt.X11.XToolkit.<clinit>(Unknown Source) ~[?:?]
[1]     at java.desktop/sun.awt.PlatformGraphicsInfo.createToolkit(Unknown Source) ~[?:?]
[1]     at java.desktop/java.awt.Toolkit.getDefaultToolkit(Unknown Source) ~[?:?]
[1]     at java.desktop/java.awt.Toolkit.getEventQueue(Unknown Source) ~[?:?]
[1]     at java.desktop/java.awt.EventQueue.invokeLater(Unknown Source) ~[?:?]
[1]     at net.fabricmc.loader.impl.game.minecraft.applet.AppletMain.main(AppletMain.java:38) ~[fabric-loader-0.16.7.jar:?]
[1]     at net.fabricmc.loader.impl.game.minecraft.MinecraftGameProvider.launch(MinecraftGameProvider.java:480) ~[fabric-loader-0.16.7.jar:?]
[1]     ... 2 more
[1] 
[1] [MC]: 21:47:20.480 [main] ERROR FabricLoader - Uncaught exception in thread "main"
[1] java.lang.NoClassDefFoundError: Could not initialize class sun.awt.X11.XToolkit
[1]     at java.desktop/sun.awt.PlatformGraphicsInfo.createToolkit(Unknown Source) ~[?:?]
[1]     at java.desktop/java.awt.Toolkit.getDefaultToolkit(Unknown Source) ~[?:?]
[1]     at java.desktop/javax.swing.UIManager.getSystemLookAndFeelClassName(Unknown Source) ~[?:?]
[1]     at net.fabricmc.loader.impl.gui.FabricMainWindow.open(FabricMainWindow.java:87) ~[fabric-loader-0.16.7.jar:?]
[1]     at net.fabricmc.loader.impl.gui.FabricGuiEntry.open(FabricGuiEntry.java:51) ~[fabric-loader-0.16.7.jar:?]
[1]     at net.fabricmc.loader.impl.gui.FabricGuiEntry.displayError(FabricGuiEntry.java:141) ~[fabric-loader-0.16.7.jar:?]
[1]     at net.fabricmc.loader.impl.gui.FabricGuiEntry.displayError(FabricGuiEntry.java:108) ~[fabric-loader-0.16.7.jar:?]
[1]     at net.fabricmc.loader.impl.launch.FabricLauncherBase.handleFormattedException(FabricLauncherBase.java:86) ~[fabric-loader-0.16.7.jar:?]
[1]     at net.fabricmc.loader.impl.launch.knot.Knot.launch(Knot.java:76) ~[fabric-loader-0.16.7.jar:?]
[1]     at net.fabricmc.loader.impl.launch.knot.KnotClient.main(KnotClient.java:23) ~[fabric-loader-0.16.7.jar:?]
[1] Caused by: java.lang.ExceptionInInitializerError: Exception java.awt.AWTError: Can't connect to X11 window server using ':0' as the value of the DISPLAY variable. [in thread "main"]
[1]     at java.desktop/sun.awt.X11GraphicsEnvironment.initDisplay(Native Method) ~[?:?]
[1]     at java.desktop/sun.awt.X11GraphicsEnvironment$1.run(Unknown Source) ~[?:?]
[1]     at java.base/java.security.AccessController.doPrivileged(Unknown Source) ~[?:?]
[1]     at java.desktop/sun.awt.X11GraphicsEnvironment.initStatic(Unknown Source) ~[?:?]
[1]     at java.desktop/sun.awt.X11GraphicsEnvironment.<clinit>(Unknown Source) ~[?:?]
[1]     at java.desktop/sun.awt.PlatformGraphicsInfo.createGE(Unknown Source) ~[?:?]
[1]     at java.desktop/java.awt.GraphicsEnvironment$LocalGE.createGE(Unknown Source) ~[?:?]
[1]     at java.desktop/java.awt.GraphicsEnvironment$LocalGE.<clinit>(Unknown Source) ~[?:?]
[1]     at java.desktop/java.awt.GraphicsEnvironment.getLocalGraphicsEnvironment(Unknown Source) ~[?:?]
[1]     at java.desktop/sun.awt.X11.XToolkit.<clinit>(Unknown Source) ~[?:?]
[1]     at java.desktop/sun.awt.PlatformGraphicsInfo.createToolkit(Unknown Source) ~[?:?]
[1]     at java.desktop/java.awt.Toolkit.getDefaultToolkit(Unknown Source) ~[?:?]
[1]     at java.desktop/java.awt.Toolkit.getEventQueue(Unknown Source) ~[?:?]
[1]     at java.desktop/java.awt.EventQueue.invokeLater(Unknown Source) ~[?:?]
[1]     at net.fabricmc.loader.impl.game.minecraft.applet.AppletMain.main(AppletMain.java:38) ~[fabric-loader-0.16.7.jar:?]
[1]     at net.fabricmc.loader.impl.game.minecraft.MinecraftGameProvider.launch(MinecraftGameProvider.java:480) ~[fabric-loader-0.16.7.jar:?]
[1]     at net.fabricmc.loader.impl.launch.knot.Knot.launch(Knot.java:74) ~[fabric-loader-0.16.7.jar:?]
[1]     ... 1 more
[1] 
[1] [MC-Err]: java.lang.NoClassDefFoundError: Could not initialize class sun.awt.X11.XToolkit
[1]     at java.desktop/sun.awt.PlatformGraphicsInfo.createToolkit(Unknown Source)
[1]     at java.desktop/java.awt.Toolkit.getDefaultToolkit(Unknown Source)
[1] 
[1] [MC-Err]:   at java.desktop/javax.swing.UIManager.getSystemLookAndFeelClassName(Unknown Source)
[1]     at net.fabricmc.loader.impl.gui.FabricMainWindow.open(FabricMainWindow.java:87)
[1]     at net.fabricmc.loader.impl.gui.FabricGuiEntry.open(FabricGuiEntry.java:51)
[1]     at net.fabricmc.loader.impl.gui.FabricGuiEntry.displayError(FabricGuiEntry.java:141)
[1]     at net.fabricmc.loader.impl.gui.FabricGuiEntry.displayError(FabricGuiEntry.java:108)
[1]     at net.fabricmc.loader.impl.launch.FabricLauncherBase.handleFormattedException(FabricLauncherBase.java:86)
[1]     at net.fabricmc.loader.impl.launch.knot.Knot.launch(Knot.java:76)
[1]     at net.fabricmc.loader.impl.launch.knot.KnotClient.main(KnotClient.java:23)
[1]     Suppressed: java.lang.NoClassDefFoundError: Could not initialize class sun.awt.X11.XToolkit
[1]             at java.desktop/sun.awt.PlatformGraphicsInfo.createToolkit(Unknown Source)
[1]             at java.desktop/java.awt.Toolkit.getDefaultToolkit(Unknown Source)
[1]             at java.desktop/javax.swing.UIManager.getSystemLookAndFeelClassName(Unknown Source)
[1]             at net.fabricmc.loader.impl.gui.FabricMainWindow.open(FabricMainWindow.java:87)
[1]             at net.fabricmc.loader.impl.gui.FabricGuiEntry.open(FabricGuiEntry.java:51)
[1] 
[1] [MC-Err]:           at net.fabricmc.loader.impl.gui.FabricGuiEntry.displayError(FabricGuiEntry.java:141)
[1]             at net.fabricmc.loader.impl.gui.FabricGuiEntry.displayError(FabricGuiEntry.java:108)
[1]             at net.fabricmc.loader.impl.launch.FabricLauncherBase$1.uncaughtException(FabricLauncherBase.java:110)
[1]             at java.base/java.lang.ThreadGroup.uncaughtException(Unknown Source)
[1]             at java.base/java.lang.ThreadGroup.uncaughtException(Unknown Source)
[1]             at java.base/java.lang.Thread.dispatchUncaughtException(Unknown Source)
[1]     Caused by: java.lang.ExceptionInInitializerError: Exception java.awt.AWTError: Can't connect to X11 window server using ':0' as the value of the DISPLAY variable. [in thread "main"]
[1]             at java.desktop/sun.awt.X11GraphicsEnvironment.initDisplay(Native Method)
[1]             at java.desktop/sun.awt.X11GraphicsEnvironment$1.run(Unknown Source)
[1]             at java.base/java.security.AccessController.doPrivileged(Unknown Source)
[1]             at java.desktop/sun.awt.X11GraphicsEnvironment.initStatic(Unknown Source)
[1]             at java.desktop/sun.awt.X11GraphicsEnvironment.<clinit>(Unknown Source)
[1]             at java.desktop/sun.awt.PlatformGraphicsInfo.createGE(Unknown Source)
[1]             at java.desktop/java.awt.GraphicsEnvironment$LocalGE.createGE(Unknown Source)
[1]             at java.desktop/java.awt.GraphicsEnvironment$LocalGE.<clinit>(Unknown Source)
[1]             at java.desktop/java.awt.GraphicsEnvironment.getLocalGraphicsEnvironment(Unknown Source)
[1]             at java.desktop/sun.awt.X11.XToolkit.<clinit>(Unknown Source)
[1]             at java.desktop/sun.awt.PlatformGraphicsInfo.createToolkit(Unknown Source)
[1]             at java.desktop/java.awt.Toolkit.getDefaultToolkit(Unknown Source)
[1]             at java.desktop/java.awt.Toolkit.getEventQueue(Unknown Source)
[1]             at java.desktop/java.awt.EventQueue.invokeLater(Unknown Source)
[1]             at net.fabricmc.loader.impl.game.minecraft.applet.AppletMain.main(AppletMain.java:38)
[1] 
[1] [MC-Err]:           at net.fabricmc.loader.impl.game.minecraft.MinecraftGameProvider.launch(MinecraftGameProvider.java:480)
[1]             at net.fabricmc.loader.impl.launch.knot.Knot.launch(Knot.java:74)
[1]             at net.fabricmc.loader.impl.launch.knot.KnotClient.main(KnotClient.java:23)
[1] Caused by: [CIRCULAR REFERENCE: java.lang.ExceptionInInitializerError: Exception java.awt.AWTError: Can't connect to X11 window server using ':0' as the value of the DISPLAY variable. [in thread "main"]]
[1] 
[1] Minecraft exited with code 1
[1] [12132:0111/214734.528296:ERROR:wayland_event_watcher.cc(47)] libwayland: warning: queue 0x2c4c00780a00 destroyed while proxies still attached:
[1] 
[1] [12132:0111/214734.528393:ERROR:wayland_event_watcher.cc(47)] libwayland:   wl_buffer#48 still attached
[1] 
[1] [12132:0111/214734.528472:ERROR:wayland_event_watcher.cc(47)] libwayland:   wl_buffer#45 still attached
[1] 
[1] [12132:0111/214734.528546:ERROR:wayland_event_watcher.cc(47)] libwayland:   wl_buffer#47 still attached
[1] 
[1] [12132:0111/214734.528606:ERROR:wayland_event_watcher.cc(47)] libwayland:   wl_buffer#37 still attached
[1] 
[1] [12132:0111/214734.528658:ERROR:wayland_event_watcher.cc(47)] libwayland:   wl_buffer#46 still attached
[1] 
[1] [12132:0111/214734.528718:ERROR:wayland_event_watcher.cc(47)] libwayland:   wl_buffer#50 still attached
[1] 
[1] [12132:0111/214734.528775:ERROR:wayland_event_watcher.cc(47)] libwayland:   wl_buffer#42 still attached
[1] 
[1] [12132:0111/214734.528832:ERROR:wayland_event_watcher.cc(47)] libwayland:   wl_shm_pool#44 still attached
[1] 
[1] [start-electron] Restored node_modules/electron
[1] wait-on http://localhost:4321 && VITE_DEV_SERVER_URL=http://localhost:4321 npm run electron:start exited with code 0
--> Sending SIGTERM to other processes..
[0] npm run svelte:dev exited with code SIGTERM