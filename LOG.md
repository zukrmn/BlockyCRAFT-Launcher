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
[0]   VITE v5.4.21  ready in 518 ms
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
[1] [9251:0111/221629.248991:ERROR:bus.cc(407)] Failed to connect to the bus: Failed to connect to socket /run/dbus/system_bus_socket: No such file or directory
[1] === BlockyCRAFT Launcher Starting ===
[1] Electron version: 33.4.11
[1] [9251:0111/221629.507813:ERROR:bus.cc(407)] Failed to connect to the bus: Failed to connect to socket /run/dbus/system_bus_socket: No such file or directory
[1] [9251:0111/221629.507881:ERROR:bus.cc(407)] Failed to connect to the bus: Failed to connect to socket /run/dbus/system_bus_socket: No such file or directory
[1] [9251:0111/221629.510383:ERROR:bus.cc(407)] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[1] [9251:0111/221629.510457:ERROR:bus.cc(407)] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[1] [9251:0111/221629.510512:ERROR:bus.cc(407)] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[1] [9251:0111/221629.510528:ERROR:bus.cc(407)] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[1] [9251:0111/221629.510546:ERROR:bus.cc(407)] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[1] Creating main window...
[1] Window created, loading content...
[1] Create Window: did-finish-load
[1] Requesting game launch... { username: 'zukerman_' }
[1] Clearing remappedJars cache to force fresh map...
[1] [JavaManager] Using locally installed Java: /home/node/.config/blockycraft-launcher/java/jdk-17.0.17+10-jre/bin/java
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
[1] [MC]: 22:16:35.680 [main] INFO  GCAPI3 - Loading config factories.
[1] 
[1] [MC]: 22:16:35.727 [main] INFO  GCAPI3 - 14 config load factories loaded.
[1] 
[1] [MC]: 22:16:35.731 [main] INFO  GCAPI3 - 14 config save factories loaded.
[1] 
[1] [MC]: 22:16:35.732 [main] INFO  GCAPI3 - 0 config load transformer factories loaded.
[1] 
[1] [MC]: 22:16:35.732 [main] INFO  GCAPI3 - Loading config event listeners.
[1] 
[1] [MC]: 22:16:35.734 [main] INFO  GCAPI3 - Loaded config event listeners.
[1] 
[1] [MC]: 22:16:35.907 [main] INFO  GCAPI3 - Successfully read "alwaysmoreitems:config"'s mod configs, reading 1 categories, and 13 values.
[1] 
[1] [MC]: 22:16:35.964 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 13 values for Always More Items(alwaysmoreitems).
[1] 
[1] [MC]: 22:16:35.978 [main] INFO  GCAPI3 - Successfully read "inventorytweaks:inventoryTweaks"'s mod configs, reading 5 categories, and 22 values.
[1] 
[1] [MC]: 22:16:35.985 [main] INFO  GCAPI3 - Successfully saved 4 categories, containing 22 values for InventoryTweaks(inventorytweaks).
[1] 
[1] [MC]: 22:16:35.990 [main] INFO  GCAPI3 - Successfully read "item_3d:item3d_config"'s mod configs, reading 1 categories, and 1 values.
[1] 
[1] [MC]: 22:16:35.992 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 1 values for 3D Dropped Item(item_3d).
[1] 
[1] [MC]: 22:16:35.998 [main] INFO  GCAPI3 - Successfully read "station-api-configuration:config"'s mod configs, reading 1 categories, and 1 values.
[1] 
[1] [MC]: 22:16:36.001 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 1 values for Station API Configuration(station-api-configuration).
[1] 
[1] [MC]: 22:16:36.018 [main] INFO  GCAPI3 - Successfully read "unitweaks:general"'s mod configs, reading 1 categories, and 6 values.
[1] 
[1] [MC]: 22:16:36.024 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 6 values for UniTweaks(unitweaks).
[1] 
[1] [MC]: 22:16:36.032 [main] INFO  GCAPI3 - Successfully read "unitweaks:userinterface"'s mod configs, reading 4 categories, and 21 values.
[1] 
[1] [MC]: 22:16:36.040 [main] INFO  GCAPI3 - Successfully saved 3 categories, containing 21 values for UniTweaks(unitweaks).
[1] 
[1] [MC]: 22:16:36.046 [main] INFO  GCAPI3 - Successfully read "unitweaks:gameplay"'s mod configs, reading 1 categories, and 5 values.
[1] 
[1] [MC]: 22:16:36.049 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 5 values for UniTweaks(unitweaks).
[1] 
[1] [MC]: 22:16:36.054 [main] INFO  GCAPI3 - Successfully read "unitweaks:features"'s mod configs, reading 3 categories, and 13 values.
[1] 
[1] [MC]: 22:16:36.058 [main] INFO  GCAPI3 - Successfully saved 2 categories, containing 13 values for UniTweaks(unitweaks).
[1] 
[1] [MC]: 22:16:36.064 [main] INFO  GCAPI3 - Successfully read "unitweaks:tweaks"'s mod configs, reading 1 categories, and 16 values.
[1] 
[1] [MC]: 22:16:36.068 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 16 values for UniTweaks(unitweaks).
[1] 
[1] [MC]: 22:16:36.076 [main] INFO  GCAPI3 - Successfully read "unitweaks:bugfixes"'s mod configs, reading 1 categories, and 30 values.
[1] 
[1] [MC]: 22:16:36.090 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 30 values for UniTweaks(unitweaks).
[1] 
[1] [MC]: 22:16:36.109 [main] INFO  GCAPI3 - Successfully read "unitweaks:oldfeatures"'s mod configs, reading 1 categories, and 9 values.
[1] 
[1] [MC]: 22:16:36.115 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 9 values for UniTweaks(unitweaks).
[1] 
[1] [MC]: 22:16:36.128 [main] INFO  GCAPI3 - Successfully read "unitweaks:recipes"'s mod configs, reading 4 categories, and 26 values.
[1] 
[1] [MC]: 22:16:36.153 [main] INFO  GCAPI3 - Successfully saved 3 categories, containing 26 values for UniTweaks(unitweaks).
[1] 
[1] [MC-Err]: SLF4J(W): No SLF4J providers were found.
[1] SLF4J(W): Defaulting to no-operation (NOP) logger implementation
[1] SLF4J(W): See https://www.slf4j.org/codes.html#noProviders for further details.
[1] 
[1] [MC]: 22:16:36.308 [main] INFO  Station|API - Initializing Station API...
[1] 
[1] [MC]: 22:16:36.309 [main] INFO  Station|API - Loading entrypoints...
[1] 
[1] [MC]: 22:16:36.378 [main] INFO  Station|API - Setting up "alwaysmoreitems" "stationapi:event_bus" "net.glasslauncher.mods.alwaysmoreitems.util.AlwaysMoreItems" entrypoint...
[1] 
[1] [MC]: 22:16:36.432 [main] INFO  Station|API - Setting up "alwaysmoreitems" "stationapi:event_bus" "net.glasslauncher.mods.alwaysmoreitems.init.CommonInit" entrypoint...
[1] 
[1] [MC]: 22:16:36.455 [main] INFO  Station|API - Setting up "alwaysmoreitems" "stationapi:event_bus" "net.glasslauncher.mods.alwaysmoreitems.init.AfterBlockAndItemListener" entrypoint...
[1] 
[1] [MC]: 22:16:36.465 [main] INFO  Station|API - Setting up "alwaysmoreitems" "stationapi:event_bus" "net.glasslauncher.mods.alwaysmoreitems.init.ActionButtonListener" entrypoint...
[1] 
[1] [MC]: 22:16:36.468 [main] INFO  Station|API - Setting up "keyf3" "stationapi:event_bus" "io.github.yunivers.keyf3.events.init.InitListener" entrypoint...
[1] 
[1] [MC]: 22:16:36.518 [main] INFO  Station|API - Setting up "smoothbeta" "stationapi:event_bus" "net.mine_diver.smoothbeta.SmoothBeta" entrypoint...
[1] 
[1] [MC]: 22:16:36.521 [main] INFO  Station|API - Setting up "station-api-base" "stationapi:event_bus" "net.modificationstation.stationapi.impl.mod.DeprecatedInitEventsImpl" entrypoint...
[1] 
[1] [MC]: 22:16:36.660 [main] INFO  Station|API - Setting up "station-blockitems-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.block.HasMetaBlockItemImpl" entrypoint...
[1] 
[1] [MC]: 22:16:36.664 [main] INFO  Station|API - Setting up "station-blockitems-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.block.HasMetaNamedBlockItemImpl" entrypoint...
[1] 
[1] [MC]: 22:16:36.665 [main] INFO  Station|API - Setting up "station-blockitems-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.block.HasCustomBlockItemFactoryImpl" entrypoint...
[1] 
[1] [MC]: 22:16:36.667 [main] INFO  Station|API - Setting up "station-blockitems-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.block.BlockFormOnlyHandler" entrypoint...
[1] 
[1] [MC]: 22:16:36.669 [main] INFO  Station|API - Setting up "station-effects-api-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.effect.EffectsRegisterListener" entrypoint...
[1] 
[1] [MC]: 22:16:36.807 [main] INFO  Station|API - Setting up "station-flattening-v0" "stationapi:event_bus" "net.modificationstation.stationapi.api.block.States" entrypoint...
[1] 
[1] [MC]: 22:16:36.810 [main] INFO  Station|API - Setting up "station-flattening-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.block.PlacementStateImpl" entrypoint...
[1] 
[1] [MC]: 22:16:36.812 [main] INFO  Station|API - Setting up "station-flattening-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.world.WorldDataVersionImpl" entrypoint...
[1] 
[1] [MC]: 22:16:36.814 [main] INFO  Station|API - Setting up "station-flattening-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.block.BlockInteractionImpl" entrypoint...
[1] 
[1] [MC]: 22:16:36.816 [main] INFO  Station|API - Setting up "station-items-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.entity.player.ItemCustomReachImpl" entrypoint...
[1] 
[1] [MC]: 22:16:36.820 [main] INFO  Station|API - Setting up "station-items-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.dispenser.CustomDispenseBehaviorImpl" entrypoint...
[1] 
[1] [MC]: 22:16:36.823 [main] INFO  Station|API - Setting up "station-networking-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.network.packet.StationNetworkingInit" entrypoint...
[1] 
[1] [MC]: 22:16:36.825 [main] INFO  Station|API - Setting up "station-recipes-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.recipe.json.JsonRecipeParserRegisterImpl" entrypoint...
[1] 
[1] [MC]: 22:16:36.827 [main] INFO  Station|API - Setting up "station-recipes-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.recipe.JsonRecipeParserInit" entrypoint...
[1] 
[1] [MC]: 22:16:36.912 [main] INFO  Station|API - Setting up "station-recipes-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.recipe.JsonRecipesLoader" entrypoint...
[1] 
[1] [MC]: 22:16:36.928 [main] INFO  Station|API - Setting up "station-recipes-v0" "stationapi:event_bus" "net.modificationstation.stationapi.api.recipe.FuelRegistry" entrypoint...
[1] 22:16:36.929 [main] INFO  Station|API - Setting up "station-registry-api-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.registry.WorldRegistryRemapper" entrypoint...
[1] 
[1] [MC]: 22:16:36.933 [main] INFO  Station|API - Setting up "station-registry-api-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.registry.TagReloaderImpl" entrypoint...
[1] 
[1] [MC]: 22:16:36.937 [main] INFO  Station|API - Setting up "station-registry-sync-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.network.RegistryNetworkingInit" entrypoint...
[1] 
[1] [MC]: 22:16:36.951 [main] INFO  Station|API - Setting up "station-resource-loader-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.resource.DataReloaderImpl" entrypoint...
[1] 
[1] [MC]: 22:16:36.955 [main] INFO  Station|API - Setting up "station-tools-api-v1" "stationapi:event_bus" "net.modificationstation.stationapi.impl.item.HijackShearsImplV1" entrypoint...
[1] 
[1] [MC]: 22:16:36.969 [main] INFO  Station|API - Setting up "station-vanilla-checker-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.network.VanillaChecker" entrypoint...
[1] 
[1] [MC]: 22:16:36.972 [main] INFO  Station|API - Setting up "station-vanilla-fix-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.vanillafix.block.VanillaBlockFixImpl" entrypoint...
[1] 
[1] [MC]: 22:16:36.975 [main] INFO  Station|API - Setting up "station-vanilla-fix-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.vanillafix.item.VanillaItemFixImpl" entrypoint...
[1] 
[1] [MC]: 22:16:36.978 [main] INFO  Station|API - Setting up "station-vanilla-fix-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.vanillafix.dimension.VanillaDimensionFixImpl" entrypoint...
[1] 
[1] [MC]: 22:16:36.981 [main] INFO  Station|API - Setting up "station-vanilla-fix-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.vanillafix.recipe.VanillaFuelItemFixImpl" entrypoint...
[1] 
[1] [MC]: 22:16:36.989 [main] INFO  Station|API - Setting up "station-vanilla-fix-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.vanillafix.datafixer.VanillaDataFixerImpl" entrypoint...
[1] 
[1] [MC]: 22:16:36.995 [main] INFO  Station|API - Setting up "station-worldgen-api-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.worldgen.WorldgenListener" entrypoint...
[1] 
[1] [MC]: 22:16:37.000 [main] INFO  Station|API - Setting up "unitweaks" "stationapi:event_bus" "net.danygames2014.unitweaks.event.InitListener" entrypoint...
[1] 
[1] [MC]: 22:16:37.028 [main] INFO  Station|API - Setting up "unitweaks" "stationapi:event_bus" "net.danygames2014.unitweaks.tweaks.recipes.RecipeListener" entrypoint...
[1] 
[1] [MC]: 22:16:37.030 [main] INFO  Station|API - Setting up "unitweaks" "stationapi:event_bus" "net.danygames2014.unitweaks.tweaks.recipes.FurnaceRecipeListener" entrypoint...
[1] 
[1] [MC]: 22:16:37.032 [main] INFO  Station|API - Setting up "unitweaks" "stationapi:event_bus" "net.danygames2014.unitweaks.bugfixes.slabminingfix.MiningListener" entrypoint...
[1] 
[1] [MC]: 22:16:37.046 [main] INFO  Station|API - Setting up "alwaysmoreitems" "stationapi:event_bus_client" "net.glasslauncher.mods.alwaysmoreitems.init.ClientInit" entrypoint...
[1] 
[1] [MC]: 22:16:37.048 [main] INFO  Station|API - Setting up "alwaysmoreitems" "stationapi:event_bus_client" "net.glasslauncher.mods.alwaysmoreitems.init.KeybindListener" entrypoint...
[1] 
[1] [MC]: 22:16:37.054 [main] INFO  Station|API - Setting up "alwaysmoreitems" "stationapi:event_bus_client" "net.glasslauncher.mods.alwaysmoreitems.gui.AMITooltipSystem" entrypoint...
[1] 
[1] [MC]: 22:16:37.340 [main] INFO  Station|API - Setting up "betterf3" "stationapi:event_bus_client" "ralf2oo2.betterf3.Betterf3" entrypoint...
[1] 
[1] [MC]: 22:16:37.343 [main] INFO  Station|API - Setting up "dynamic_light" "stationapi:event_bus_client" "farn.dynamicLight.DynamicLight" entrypoint...
[1] 
[1] [MC]: 22:16:37.401 [main] INFO  Station|API - Setting up "keyf3" "stationapi:event_bus_client" "io.github.yunivers.keyf3.registry.F3BindRegistry" entrypoint...
[1] 
[1] [MC]: 22:16:37.430 [main] INFO  Station|API - Setting up "keyf3" "stationapi:event_bus_client" "io.github.yunivers.keyf3.events.init.BindListener" entrypoint...
[1] 
[1] [MC]: 22:16:37.433 [main] INFO  Station|API - Setting up "rei_minimap" "stationapi:event_bus_client" "reifnsk.minimap.stationapi.ReiMinimapStationAPI" entrypoint...
[1] 
[1] [MC]: 22:16:37.435 [main] INFO  Station|API - Setting up "smoothbeta" "stationapi:event_bus_client" "net.mine_diver.smoothbeta.client.SmoothBetaClient" entrypoint...
[1] 
[1] [MC]: 22:16:37.438 [main] INFO  Station|API - Setting up "smoothbeta" "stationapi:event_bus_client" "net.mine_diver.smoothbeta.client.render.Shaders" entrypoint...
[1] 
[1] [MC]: 22:16:37.447 [main] INFO  Station|API - Setting up "station-achievements-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.gui.screen.achievement.AchievementPageImpl" entrypoint...
[1] 
[1] [MC]: 22:16:37.520 [main] INFO  Station|API - Setting up "station-container-api-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.network.GuiClientNetworkHandler" entrypoint...
[1] 
[1] [MC]: 22:16:37.815 [main] INFO  Station|API - Setting up "station-entities-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.network.EntityClientNetworkHandler" entrypoint...
[1] 
[1] [MC]: 22:16:37.819 [main] INFO  Station|API - Setting up "station-gui-api-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.gui.screen.EditWorldScreenImpl" entrypoint...
[1] 
[1] [MC]: 22:16:37.823 [main] INFO  Station|API - Setting up "station-items-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.render.item.CustomItemOverlayImpl" entrypoint...
[1] 
[1] [MC]: 22:16:37.826 [main] INFO  Station|API - Setting up "station-items-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.gui.screen.container.CustomTooltipRendererImpl" entrypoint...
[1] 
[1] [MC]: 22:16:37.833 [main] INFO  Station|API - Setting up "station-localization-api-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.api.resource.language.LanguageManager" entrypoint...
[1] 
[1] [MC]: 22:16:37.837 [main] INFO  Station|API - Setting up "station-registry-sync-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.registry.ClientServerRegistryRemapper" entrypoint...
[1] 
[1] [MC]: 22:16:37.840 [main] INFO  Station|API - Setting up "station-registry-sync-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.registry.ClientRegistryRestorer" entrypoint...
[1] 
[1] [MC]: 22:16:37.864 [main] INFO  Station|API - Setting up "station-renderer-api-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.texture.StationRenderImpl" entrypoint...
[1] 
[1] [MC]: 22:16:37.878 [main] INFO  Station|API - Setting up "station-renderer-arsenic" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.arsenic.Arsenic" entrypoint...
[1] 
[1] [MC]: 22:16:37.885 [main] INFO  Station|API - Setting up "station-resource-loader-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.resource.AssetsReloaderImpl" entrypoint...
[1] 
[1] [MC]: 22:16:37.889 [main] INFO  Station|API - Setting up "station-vanilla-checker-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.network.ClientVanillaChecker" entrypoint...
[1] 
[1] [MC]: 22:16:37.898 [main] INFO  Station|API - Setting up "station-vanilla-fix-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.vanillafix.client.gui.screen.EditWorldScreenImpl" entrypoint...
[1] 
[1] [MC]: 22:16:37.928 [main] INFO  Station|API - Setting up "station-vanilla-fix-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.vanillafix.client.color.block.VanillaBlockColorProviders" entrypoint...
[1] 
[1] [MC]: 22:16:37.977 [main] INFO  Station|API - Setting up "unitweaks" "stationapi:event_bus_client" "net.danygames2014.unitweaks.tweaks.morekeybinds.KeyPressedListener" entrypoint...
[1] 
[1] [MC]: 22:16:38.120 [main] INFO  Station|API - Setting up "unitweaks" "stationapi:event_bus_client" "net.danygames2014.unitweaks.tweaks.morekeybinds.KeyBindingListener" entrypoint...
[1] 
[1] [MC]: 22:16:38.122 [main] INFO  Station|API - Setting up "unitweaks" "stationapi:event_bus_client" "net.danygames2014.unitweaks.bugfixes.grassblockitemfix.ColorProviderListener" entrypoint...
[1] 
[1] [MC]: 22:16:38.122 [main] INFO  Station|API - Invoking Init event...
[1] 
[1] [MC]: 22:16:38.227 [main] INFO  Station|API - Searching for JSON recipes...
[1] 
[1] [MC]: 22:16:38.248 [main] INFO  Station|API - Gathering mods that require client verification...
[1] 
[1] [MC]: 22:16:38.255 [main] INFO  Arsenic - Registering Arsenic renderer!
[1] 
[1] [MC]: 22:16:38.277 [main] INFO  keyf3|Mod - keyf3
[1] 
[1] [MC]: 22:16:38.282 [main] INFO  dynamic_light|Mod - Dynamic Light Mod initialized.
[1] 
[1] [MC]: 22:16:38.286 [main] INFO  dynamic_light|Mod - 50
[1] 
[1] [MC]: 22:16:38.287 [main] INFO  dynamic_light|Mod - 89
[1] 22:16:38.287 [main] INFO  dynamic_light|Mod - 74
[1] 22:16:38.287 [main] INFO  dynamic_light|Mod - 348
[1] 
[1] [MC]: 22:16:38.287 [main] INFO  dynamic_light|Mod - 76
[1] 
[1] [MC]: 22:16:38.289 [main] INFO  Station|API - Finished Station API setup.
[1] 
[1] [MC]: 22:16:38.991 [AWT-EventQueue-0] INFO  Station|API - Added vanilla blocks to the registry.
[1] 
[1] [MC]: 22:16:39.190 [AWT-EventQueue-0] INFO  Station|API - Added vanilla items to the registry.
[1] 
[1] [MC]: 16 achievements
[1] 
[1] [MC]: 151 recipes
[1] 
[1] [MC]: 22:16:41.206 [AWT-EventQueue-0] INFO  GCAPI3 - Adding config screens to ModMenu...
[1] 
[1] [MC]: Setting user: zukerman_
[1] 
[1] [MC]: 22:16:43.878 [AWT-EventQueue-0] ERROR FabricLoader - Uncaught exception in thread "AWT-EventQueue-0"
[1] java.lang.UnsatisfiedLinkError: /home/node/.config/blockycraft-launcher/instances/default/.minecraft/bin/natives/liblwjgl-linux-amd64.so: libXxf86vm.so.1: cannot open shared object file: No such file or directory
[1]     at java.base/jdk.internal.loader.NativeLibraries.load(Native Method) ~[?:?]
[1]     at java.base/jdk.internal.loader.NativeLibraries$NativeLibraryImpl.open(Unknown Source) ~[?:?]
[1]     at java.base/jdk.internal.loader.NativeLibraries.loadLibrary(Unknown Source) ~[?:?]
[1]     at java.base/jdk.internal.loader.NativeLibraries.loadLibrary(Unknown Source) ~[?:?]
[1]     at java.base/java.lang.ClassLoader.loadLibrary(Unknown Source) ~[?:?]
[1]     at java.base/java.lang.Runtime.load0(Unknown Source) ~[?:?]
[1]     at java.base/java.lang.System.load(Unknown Source) ~[?:?]
[1]     at knot/org.lwjgl.Sys$1.run(Sys.java:68) ~[lwjgl-2.9.4+legacyfabric.9.jar:?]
[1]     at java.base/java.security.AccessController.doPrivileged(Unknown Source) ~[?:?]
[1]     at knot/org.lwjgl.Sys.doLoadLibrary(Sys.java:64) ~[lwjgl-2.9.4+legacyfabric.9.jar:?]
[1]     at knot/org.lwjgl.Sys.loadLibrary(Sys.java:78) ~[lwjgl-2.9.4+legacyfabric.9.jar:?]
[1]     at knot/org.lwjgl.Sys.<clinit>(Sys.java:83) ~[lwjgl-2.9.4+legacyfabric.9.jar:?]
[1]     at knot/org.lwjgl.opengl.Display.<clinit>(Display.java:135) ~[lwjgl-2.9.4+legacyfabric.9.jar:?]
[1]     at knot/net.danygames2014.gambac.BrnoMinecraft.method_2106(BrnoMinecraft.java:56) ~[gambac-1.3.1.jar:?]
[1]     at knot/net.minecraft.client.Minecraft.run(Minecraft.java:716) ~[minecraft.jar:?]
[1]     at knot/net.minecraft.client.MinecraftApplet.method_2153(MinecraftApplet.java:606) ~[minecraft.jar:?]
[1]     at knot/net.minecraft.client.MinecraftApplet.init(MinecraftApplet.java:577) ~[minecraft.jar:?]
[1]     at net.fabricmc.loader.impl.game.minecraft.applet.AppletLauncher.init(AppletLauncher.java:138) ~[fabric-loader-0.16.7.jar:?]
[1]     at net.fabricmc.loader.impl.game.minecraft.applet.AppletFrame.launch(AppletFrame.java:125) ~[fabric-loader-0.16.7.jar:?]
[1]     at net.fabricmc.loader.impl.game.minecraft.applet.AppletMain.run(AppletMain.java:44) ~[fabric-loader-0.16.7.jar:?]
[1]     at java.desktop/java.awt.event.InvocationEvent.dispatch(Unknown Source) ~[?:?]
[1]     at java.desktop/java.awt.EventQueue.dispatchEventImpl(Unknown Source) ~[?:?]
[1]     at java.desktop/java.awt.EventQueue$4.run(Unknown Source) ~[?:?]
[1]     at java.desktop/java.awt.EventQueue$4.run(Unknown Source) ~[?:?]
[1]     at java.base/java.security.AccessController.doPrivileged(Unknown Source) ~[?:?]
[1]     at java.base/java.security.ProtectionDomain$JavaSecurityAccessImpl.doIntersectionPrivilege(Unknown Source) ~[?:?]
[1]     at java.desktop/java.awt.EventQueue.dispatchEvent(Unknown Source) ~[?:?]
[1]     at java.desktop/java.awt.EventDispatchThread.pumpOneEventForFilters(Unknown Source) [?:?]
[1]     at java.desktop/java.awt.EventDispatchThread.pumpEventsForFilter(Unknown Source) [?:?]
[1]     at java.desktop/java.awt.EventDispatchThread.pumpEventsForHierarchy(Unknown Source) [?:?]
[1]     at java.desktop/java.awt.EventDispatchThread.pumpEvents(Unknown Source) [?:?]
[1]     at java.desktop/java.awt.EventDispatchThread.pumpEvents(Unknown Source) [?:?]
[1]     at java.desktop/java.awt.EventDispatchThread.run(Unknown Source) [?:?]
[1] 
[1] [9251:0111/221655.158208:ERROR:wayland_event_watcher.cc(47)] libwayland: warning: queue 0xc24007810c0 destroyed while proxies still attached:
[1] 
[1] [9251:0111/221655.158329:ERROR:wayland_event_watcher.cc(47)] libwayland:   wl_buffer#46 still attached
[1] 
[1] [9251:0111/221655.158391:ERROR:wayland_event_watcher.cc(47)] libwayland:   wl_buffer#42 still attached
[1] 
[1] [9251:0111/221655.158449:ERROR:wayland_event_watcher.cc(47)] libwayland:   wl_buffer#44 still attached
[1] 
[1] [9251:0111/221655.158505:ERROR:wayland_event_watcher.cc(47)] libwayland:   wl_shm_pool#47 still attached
[1] 
[1] [start-electron] Restored node_modules/electron
[1] wait-on http://localhost:4321 && VITE_DEV_SERVER_URL=http://localhost:4321 npm run electron:start exited with code 0
--> Sending SIGTERM to other processes..
[0] npm run svelte:dev exited with code SIGTERM