❯ cd Documents/VSCodeProjects/BlockyCRAFT-Launcher
❯ npm run dev

> blockycraft-launcher@0.1.0 dev
> dbus-run-session -- npm run dev:internal


> blockycraft-launcher@0.1.0 dev:internal
> npm run electron:build && concurrently -k "npm run svelte:dev" "wait-on http://localhost:4321 && VITE_DEV_SERVER_URL=http://localhost:4321 npm run electron:start"


> blockycraft-launcher@0.1.0 electron:build
> node scripts/build-electron.mjs

✓ Electron files built successfully
[0] 
[0] > blockycraft-launcher@0.1.0 svelte:dev
[0] > vite
[0] 
[0] 
[0]   VITE v5.4.21  ready in 545 ms
[0] 
[0]   ➜  Local:   http://localhost:4321/
[0]   ➜  Network: use --host to expose
[1] 
[1] > blockycraft-launcher@0.1.0 electron:start
[1] > node scripts/start-electron.mjs
[1] 
[1] Electron binary: /home/zukerman/Documents/VSCodeProjects/BlockyCRAFT-Launcher/node_modules/electron/dist/electron
[1] After rename: /home/zukerman/Documents/VSCodeProjects/BlockyCRAFT-Launcher/node_modules/.electron-npm/dist/electron
[1] App path: /home/zukerman/Documents/VSCodeProjects/BlockyCRAFT-Launcher
[1] Args: /home/zukerman/Documents/VSCodeProjects/BlockyCRAFT-Launcher --no-sandbox --disable-gpu
[1] [start-electron] Temporarily renamed node_modules/electron
dbus-daemon[610729]: [session uid=1000 pid=610729] Activating service name='org.gtk.vfs.Daemon' requested by ':1.0' (uid=1000 pid=610855 comm="/home/zukerman/Documents/VSCodeProjects/BlockyCRAF" label="unconfined")
dbus-daemon[610729]: [session uid=1000 pid=610729] Successfully activated service 'org.gtk.vfs.Daemon'
fusermount3: failed to access mountpoint /run/user/1000/gvfs: Permission denied
dbus-daemon[610729]: [session uid=1000 pid=610729] Activating service name='org.freedesktop.portal.Desktop' requested by ':1.2' (uid=1000 pid=610855 comm="/home/zukerman/Documents/VSCodeProjects/BlockyCRAF" label="unconfined")
dbus-daemon[610729]: [session uid=1000 pid=610729] Activating service name='org.freedesktop.portal.Documents' requested by ':1.3' (uid=1000 pid=610900 comm="/usr/libexec/xdg-desktop-portal" label="unconfined")
dbus-daemon[610729]: [session uid=1000 pid=610729] Activating service name='org.freedesktop.impl.portal.PermissionStore' requested by ':1.4' (uid=1000 pid=610908 comm="/usr/libexec/xdg-document-portal" label="unconfined")
dbus-daemon[610729]: [session uid=1000 pid=610729] Successfully activated service 'org.freedesktop.impl.portal.PermissionStore'
dbus-daemon[610729]: [session uid=1000 pid=610729] Successfully activated service 'org.freedesktop.portal.Documents'
fusermount3: failed to access mountpoint /run/user/1000/doc: Permission denied
error: fuse init failed: Can't mount path /run/user/1000/doc
dbus-daemon[610729]: [session uid=1000 pid=610729] Activating service name='org.freedesktop.impl.portal.desktop.gnome' requested by ':1.3' (uid=1000 pid=610900 comm="/usr/libexec/xdg-desktop-portal" label="unconfined")
[1] Initializing Application...
[1] GameHandler initialized.
[1] Creating main window...
dbus-daemon[610729]: [session uid=1000 pid=610729] Activating service name='org.a11y.Bus' requested by ':1.6' (uid=1000 pid=610855 comm="/home/zukerman/Documents/VSCodeProjects/BlockyCRAF" label="unconfined")
Non-compatible display server, exposing settings only.
dbus-daemon[610729]: [session uid=1000 pid=610729] Successfully activated service 'org.a11y.Bus'
dbus-daemon[610729]: [session uid=1000 pid=610729] Successfully activated service 'org.freedesktop.impl.portal.desktop.gnome'
dbus-daemon[610729]: [session uid=1000 pid=610729] Activating service name='org.freedesktop.impl.portal.desktop.gtk' requested by ':1.3' (uid=1000 pid=610900 comm="/usr/libexec/xdg-desktop-portal" label="unconfined")
[1] Window created, loading content...
dbus-daemon[610939]: Activating service name='org.a11y.atspi.Registry' requested by ':1.0' (uid=1000 pid=610855 comm="/home/zukerman/Documents/VSCodeProjects/BlockyCRAF" label="unconfined")
dbus-daemon[610939]: Successfully activated service 'org.a11y.atspi.Registry'
SpiRegistry daemon is running with well-known name - org.a11y.atspi.Registry
dbus-daemon[610729]: [session uid=1000 pid=610729] Successfully activated service 'org.freedesktop.impl.portal.desktop.gtk'
dbus-daemon[610729]: [session uid=1000 pid=610729] Activating service name='org.freedesktop.secrets' requested by ':1.3' (uid=1000 pid=610900 comm="/usr/libexec/xdg-desktop-portal" label="unconfined")
GNOME_KEYRING_CONTROL=/run/user/1000/keyring
SSH_AUTH_SOCK=/run/user/1000/keyring/ssh
[1] Create Window: did-finish-load
[1] [610855:0111/223706.247073:ERROR:object_proxy.cc(576)] Failed to call method: org.freedesktop.DBus.StartServiceByName: object_path= /org/freedesktop/DBus: org.freedesktop.DBus.Error.NoReply: Did not receive a reply. Possible causes include: the remote application did not send a reply, the message bus security policy blocked the reply, the reply timeout expired, or the network connection was broken.
[1] Requesting game launch... { username: 'zukerman_' }
[1] [JavaManager] Using system Java: java
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
[1] Spawning java: java
[1] Args: [
[1]   '-Djava.library.path=/home/zukerman/.config/blockycraft-launcher/instances/default/.minecraft/bin/natives',
[1]   '-Dorg.lwjgl.librarypath=/home/zukerman/.config/blockycraft-launcher/instances/default/.minecraft/bin/natives',
[1]   '-Dfabric.gameJarPath=/home/zukerman/.config/blockycraft-launcher/instances/default/.minecraft/bin/minecraft.jar',
[1]   '-Dfabric.gameVersion=b1.7.3',
[1]   '-Dfabric.envType=client',
[1]   '-cp',
[1]   '/home/zukerman/.config/blockycraft-launcher/instances/default/libraries/libraries/org/ow2/asm/asm/9.7.1/asm-9.7.1.jar:/home/zukerman/.config/blockycraft-launcher/instances/default/libraries/libraries/org/ow2/asm/asm-analysis/9.7.1/asm-analysis-9.7.1.jar:/home/zukerman/.config/blockycraft-launcher/instances/default/libraries/libraries/org/ow2/asm/asm-commons/9.7.1/asm-commons-9.7.1.jar:/home/zukerman/.config/blockycraft-launcher/instances/default/libraries/libraries/org/ow2/asm/asm-tree/9.7.1/asm-tree-9.7.1.jar:/home/zukerman/.config/blockycraft-launcher/instances/default/libraries/libraries/org/ow2/asm/asm-util/9.7.1/asm-util-9.7.1.jar:/home/zukerman/.config/blockycraft-launcher/instances/default/libraries/libraries/net/fabricmc/sponge-mixin/0.15.3+mixin.0.8.7/sponge-mixin-0.15.3+mixin.0.8.7.jar:/home/zukerman/.config/blockycraft-launcher/instances/default/libraries/libraries/org/apache/commons/commons-lang3/3.12.0/commons-lang3-3.12.0.jar:/home/zukerman/.config/blockycraft-launcher/instances/default/libraries/libraries/commons-io/commons-io/2.11.0/commons-io-2.11.0.jar:/home/zukerman/.config/blockycraft-launcher/instances/default/libraries/libraries/commons-codec/commons-codec/1.15/commons-codec-1.15.jar:/home/zukerman/.config/blockycraft-launcher/instances/default/libraries/libraries/net/java/jutils/jutils/1.0.0/jutils-1.0.0.jar:/home/zukerman/.config/blockycraft-launcher/instances/default/libraries/libraries/net/java/jinput/jinput/2.0.5/jinput-2.0.5.jar:/home/zukerman/.config/blockycraft-launcher/instances/default/libraries/libraries/org/lwjgl/lwjgl/lwjgl/2.9.4+legacyfabric.9/lwjgl-2.9.4+legacyfabric.9.jar:/home/zukerman/.config/blockycraft-launcher/instances/default/libraries/libraries/org/lwjgl/lwjgl/lwjgl_util/2.9.4+legacyfabric.9/lwjgl_util-2.9.4+legacyfabric.9.jar:/home/zukerman/.config/blockycraft-launcher/instances/default/libraries/log4j-api-2.22.1.jar:/home/zukerman/.config/blockycraft-launcher/instances/default/libraries/log4j-core-2.22.1.jar:/home/zukerman/.config/blockycraft-launcher/instances/default/libraries/libraries/com/google/guava/guava/31.0.1-jre/guava-31.0.1-jre.jar:/home/zukerman/.config/blockycraft-launcher/instances/default/libraries/libraries/com/google/guava/failureaccess/1.0.1/failureaccess-1.0.1.jar:/home/zukerman/.config/blockycraft-launcher/instances/default/libraries/fabric-loader-0.16.7.jar:/home/zukerman/.config/blockycraft-launcher/instances/default/libraries/intermediary-upstream-b1.7.3.jar:/home/zukerman/.config/blockycraft-launcher/instances/default/.minecraft/bin/minecraft.jar',
[1]   'net.fabricmc.loader.impl.launch.knot.KnotClient',
[1]   '--username',
[1]   'zukerman_',
[1]   '--gameDir',
[1]   '/home/zukerman/.config/blockycraft-launcher/instances/default/.minecraft',
[1]   '--assetsDir',
[1]   '/home/zukerman/.config/blockycraft-launcher/instances/default/.minecraft/resources',
[1]   '--assetIndex',
[1]   'truly_legacy',
[1]   '--server',
[1]   '185.100.215.195',
[1]   '--port',
[1]   '25565'
[1] ]
[1] [MC]: 22:37:13.911 [main] INFO  GCAPI3 - Loading config factories.
[1] 
[1] [MC]: 22:37:13.971 [main] INFO  GCAPI3 - 14 config load factories loaded.
[1] 
[1] [MC]: 22:37:13.974 [main] INFO  GCAPI3 - 14 config save factories loaded.
[1] 
[1] [MC]: 22:37:13.975 [main] INFO  GCAPI3 - 0 config load transformer factories loaded.
[1] 
[1] [MC]: 22:37:13.975 [main] INFO  GCAPI3 - Loading config event listeners.
[1] 
[1] [MC]: 22:37:13.978 [main] INFO  GCAPI3 - Loaded config event listeners.
[1] 
[1] [MC]: 22:37:14.209 [main] INFO  GCAPI3 - Successfully read "alwaysmoreitems:config"'s mod configs, reading 1 categories, and 13 values.
[1] 
[1] [MC]: 22:37:14.253 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 13 values for Always More Items(alwaysmoreitems).
[1] 
[1] [MC]: 22:37:14.268 [main] INFO  GCAPI3 - Successfully read "inventorytweaks:inventoryTweaks"'s mod configs, reading 5 categories, and 22 values.
[1] 
[1] [MC]: 22:37:14.275 [main] INFO  GCAPI3 - Successfully saved 4 categories, containing 22 values for InventoryTweaks(inventorytweaks).
[1] 
[1] [MC]: 22:37:14.280 [main] INFO  GCAPI3 - Successfully read "item_3d:item3d_config"'s mod configs, reading 1 categories, and 1 values.
[1] 
[1] [MC]: 22:37:14.282 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 1 values for 3D Dropped Item(item_3d).
[1] 
[1] [MC]: 22:37:14.286 [main] INFO  GCAPI3 - Successfully read "station-api-configuration:config"'s mod configs, reading 1 categories, and 1 values.
[1] 
[1] [MC]: 22:37:14.288 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 1 values for Station API Configuration(station-api-configuration).
[1] 
[1] [MC]: 22:37:14.301 [main] INFO  GCAPI3 - Successfully read "unitweaks:general"'s mod configs, reading 1 categories, and 6 values.
[1] 
[1] [MC]: 22:37:14.306 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 6 values for UniTweaks(unitweaks).
[1] 
[1] [MC]: 22:37:14.315 [main] INFO  GCAPI3 - Successfully read "unitweaks:userinterface"'s mod configs, reading 4 categories, and 21 values.
[1] 
[1] [MC]: 22:37:14.320 [main] INFO  GCAPI3 - Successfully saved 3 categories, containing 21 values for UniTweaks(unitweaks).
[1] 
[1] [MC]: 22:37:14.328 [main] INFO  GCAPI3 - Successfully read "unitweaks:gameplay"'s mod configs, reading 1 categories, and 5 values.
[1] 
[1] [MC]: 22:37:14.331 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 5 values for UniTweaks(unitweaks).
[1] 
[1] [MC]: 22:37:14.339 [main] INFO  GCAPI3 - Successfully read "unitweaks:features"'s mod configs, reading 3 categories, and 13 values.
[1] 
[1] [MC]: 22:37:14.344 [main] INFO  GCAPI3 - Successfully saved 2 categories, containing 13 values for UniTweaks(unitweaks).
[1] 
[1] [MC]: 22:37:14.350 [main] INFO  GCAPI3 - Successfully read "unitweaks:tweaks"'s mod configs, reading 1 categories, and 16 values.
[1] 
[1] [MC]: 22:37:14.354 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 16 values for UniTweaks(unitweaks).
[1] 
[1] [MC]: 22:37:14.379 [main] INFO  GCAPI3 - Successfully read "unitweaks:bugfixes"'s mod configs, reading 1 categories, and 30 values.
[1] 
[1] [MC]: 22:37:14.387 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 30 values for UniTweaks(unitweaks).
[1] 
[1] [MC]: 22:37:14.393 [main] INFO  GCAPI3 - Successfully read "unitweaks:oldfeatures"'s mod configs, reading 1 categories, and 9 values.
[1] 
[1] [MC]: 22:37:14.396 [main] INFO  GCAPI3 - Successfully saved 0 categories, containing 9 values for UniTweaks(unitweaks).
[1] 
[1] [MC]: 22:37:14.404 [main] INFO  GCAPI3 - Successfully read "unitweaks:recipes"'s mod configs, reading 4 categories, and 26 values.
[1] 
[1] [MC]: 22:37:14.415 [main] INFO  GCAPI3 - Successfully saved 3 categories, containing 26 values for UniTweaks(unitweaks).
[1] 
[1] [MC-Err]: SLF4J(W): No SLF4J providers were found.
[1] SLF4J(W): Defaulting to no-operation (NOP) logger implementation
[1] SLF4J(W): See https://www.slf4j.org/codes.html#noProviders for further details.
[1] 
[1] [MC]: 22:37:14.600 [main] INFO  Station|API - Initializing Station API...
[1] 
[1] [MC]: 22:37:14.601 [main] INFO  Station|API - Loading entrypoints...
[1] 
[1] [MC]: 22:37:14.684 [main] INFO  Station|API - Setting up "alwaysmoreitems" "stationapi:event_bus" "net.glasslauncher.mods.alwaysmoreitems.util.AlwaysMoreItems" entrypoint...
[1] 
[1] [MC]: 22:37:14.715 [main] INFO  Station|API - Setting up "alwaysmoreitems" "stationapi:event_bus" "net.glasslauncher.mods.alwaysmoreitems.init.CommonInit" entrypoint...
[1] 
[1] [MC]: 22:37:14.738 [main] INFO  Station|API - Setting up "alwaysmoreitems" "stationapi:event_bus" "net.glasslauncher.mods.alwaysmoreitems.init.AfterBlockAndItemListener" entrypoint...
[1] 
[1] [MC]: 22:37:14.748 [main] INFO  Station|API - Setting up "alwaysmoreitems" "stationapi:event_bus" "net.glasslauncher.mods.alwaysmoreitems.init.ActionButtonListener" entrypoint...
[1] 
[1] [MC]: 22:37:14.751 [main] INFO  Station|API - Setting up "keyf3" "stationapi:event_bus" "io.github.yunivers.keyf3.events.init.InitListener" entrypoint...
[1] 
[1] [MC]: 22:37:14.784 [main] INFO  Station|API - Setting up "smoothbeta" "stationapi:event_bus" "net.mine_diver.smoothbeta.SmoothBeta" entrypoint...
[1] 
[1] [MC]: 22:37:14.787 [main] INFO  Station|API - Setting up "station-api-base" "stationapi:event_bus" "net.modificationstation.stationapi.impl.mod.DeprecatedInitEventsImpl" entrypoint...
[1] 
[1] [MC]: 22:37:14.976 [main] INFO  Station|API - Setting up "station-blockitems-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.block.HasMetaBlockItemImpl" entrypoint...
[1] 
[1] [MC]: 22:37:14.981 [main] INFO  Station|API - Setting up "station-blockitems-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.block.HasMetaNamedBlockItemImpl" entrypoint...
[1] 
[1] [MC]: 22:37:14.983 [main] INFO  Station|API - Setting up "station-blockitems-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.block.HasCustomBlockItemFactoryImpl" entrypoint...
[1] 
[1] [MC]: 22:37:14.985 [main] INFO  Station|API - Setting up "station-blockitems-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.block.BlockFormOnlyHandler" entrypoint...
[1] 
[1] [MC]: 22:37:14.988 [main] INFO  Station|API - Setting up "station-effects-api-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.effect.EffectsRegisterListener" entrypoint...
[1] 
[1] [MC]: 22:37:15.143 [main] INFO  Station|API - Setting up "station-flattening-v0" "stationapi:event_bus" "net.modificationstation.stationapi.api.block.States" entrypoint...
[1] 
[1] [MC]: 22:37:15.147 [main] INFO  Station|API - Setting up "station-flattening-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.block.PlacementStateImpl" entrypoint...
[1] 
[1] [MC]: 22:37:15.150 [main] INFO  Station|API - Setting up "station-flattening-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.world.WorldDataVersionImpl" entrypoint...
[1] 
[1] [MC]: 22:37:15.155 [main] INFO  Station|API - Setting up "station-flattening-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.block.BlockInteractionImpl" entrypoint...
[1] 
[1] [MC]: 22:37:15.158 [main] INFO  Station|API - Setting up "station-items-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.entity.player.ItemCustomReachImpl" entrypoint...
[1] 
[1] [MC]: 22:37:15.161 [main] INFO  Station|API - Setting up "station-items-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.dispenser.CustomDispenseBehaviorImpl" entrypoint...
[1] 
[1] [MC]: 22:37:15.164 [main] INFO  Station|API - Setting up "station-networking-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.network.packet.StationNetworkingInit" entrypoint...
[1] 
[1] [MC]: 22:37:15.166 [main] INFO  Station|API - Setting up "station-recipes-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.recipe.json.JsonRecipeParserRegisterImpl" entrypoint...
[1] 
[1] [MC]: 22:37:15.169 [main] INFO  Station|API - Setting up "station-recipes-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.recipe.JsonRecipeParserInit" entrypoint...
[1] 
[1] [MC]: 22:37:15.232 [main] INFO  Station|API - Setting up "station-recipes-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.recipe.JsonRecipesLoader" entrypoint...
[1] 
[1] [MC]: 22:37:15.253 [main] INFO  Station|API - Setting up "station-recipes-v0" "stationapi:event_bus" "net.modificationstation.stationapi.api.recipe.FuelRegistry" entrypoint...
[1] 
[1] [MC]: 22:37:15.254 [main] INFO  Station|API - Setting up "station-registry-api-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.registry.WorldRegistryRemapper" entrypoint...
[1] 
[1] [MC]: 22:37:15.259 [main] INFO  Station|API - Setting up "station-registry-api-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.registry.TagReloaderImpl" entrypoint...
[1] 
[1] [MC]: 22:37:15.262 [main] INFO  Station|API - Setting up "station-registry-sync-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.network.RegistryNetworkingInit" entrypoint...
[1] 
[1] [MC]: 22:37:15.278 [main] INFO  Station|API - Setting up "station-resource-loader-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.resource.DataReloaderImpl" entrypoint...
[1] 
[1] [MC]: 22:37:15.282 [main] INFO  Station|API - Setting up "station-tools-api-v1" "stationapi:event_bus" "net.modificationstation.stationapi.impl.item.HijackShearsImplV1" entrypoint...
[1] 
[1] [MC]: 22:37:15.299 [main] INFO  Station|API - Setting up "station-vanilla-checker-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.network.VanillaChecker" entrypoint...
[1] 
[1] [MC]: 22:37:15.303 [main] INFO  Station|API - Setting up "station-vanilla-fix-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.vanillafix.block.VanillaBlockFixImpl" entrypoint...
[1] 
[1] [MC]: 22:37:15.307 [main] INFO  Station|API - Setting up "station-vanilla-fix-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.vanillafix.item.VanillaItemFixImpl" entrypoint...
[1] 
[1] [MC]: 22:37:15.311 [main] INFO  Station|API - Setting up "station-vanilla-fix-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.vanillafix.dimension.VanillaDimensionFixImpl" entrypoint...
[1] 
[1] [MC]: 22:37:15.314 [main] INFO  Station|API - Setting up "station-vanilla-fix-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.vanillafix.recipe.VanillaFuelItemFixImpl" entrypoint...
[1] 
[1] [MC]: 22:37:15.321 [main] INFO  Station|API - Setting up "station-vanilla-fix-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.vanillafix.datafixer.VanillaDataFixerImpl" entrypoint...
[1] 
[1] [MC]: 22:37:15.326 [main] INFO  Station|API - Setting up "station-worldgen-api-v0" "stationapi:event_bus" "net.modificationstation.stationapi.impl.worldgen.WorldgenListener" entrypoint...
[1] 
[1] [MC]: 22:37:15.329 [main] INFO  Station|API - Setting up "unitweaks" "stationapi:event_bus" "net.danygames2014.unitweaks.event.InitListener" entrypoint...
[1] 
[1] [MC]: 22:37:15.353 [main] INFO  Station|API - Setting up "unitweaks" "stationapi:event_bus" "net.danygames2014.unitweaks.tweaks.recipes.RecipeListener" entrypoint...
[1] 
[1] [MC]: 22:37:15.355 [main] INFO  Station|API - Setting up "unitweaks" "stationapi:event_bus" "net.danygames2014.unitweaks.tweaks.recipes.FurnaceRecipeListener" entrypoint...
[1] 
[1] [MC]: 22:37:15.357 [main] INFO  Station|API - Setting up "unitweaks" "stationapi:event_bus" "net.danygames2014.unitweaks.bugfixes.slabminingfix.MiningListener" entrypoint...
[1] 
[1] [MC]: 22:37:15.386 [main] INFO  Station|API - Setting up "alwaysmoreitems" "stationapi:event_bus_client" "net.glasslauncher.mods.alwaysmoreitems.init.ClientInit" entrypoint...
[1] 
[1] [MC]: 22:37:15.388 [main] INFO  Station|API - Setting up "alwaysmoreitems" "stationapi:event_bus_client" "net.glasslauncher.mods.alwaysmoreitems.init.KeybindListener" entrypoint...
[1] 
[1] [MC]: 22:37:15.395 [main] INFO  Station|API - Setting up "alwaysmoreitems" "stationapi:event_bus_client" "net.glasslauncher.mods.alwaysmoreitems.gui.AMITooltipSystem" entrypoint...
[1] 
[1] [MC]: 22:37:15.659 [main] INFO  Station|API - Setting up "betterf3" "stationapi:event_bus_client" "ralf2oo2.betterf3.Betterf3" entrypoint...
[1] 
[1] [MC]: 22:37:15.662 [main] INFO  Station|API - Setting up "dynamic_light" "stationapi:event_bus_client" "farn.dynamicLight.DynamicLight" entrypoint...
[1] 
[1] [MC]: 22:37:15.721 [main] INFO  Station|API - Setting up "keyf3" "stationapi:event_bus_client" "io.github.yunivers.keyf3.registry.F3BindRegistry" entrypoint...
[1] 
[1] [MC]: 22:37:15.746 [main] INFO  Station|API - Setting up "keyf3" "stationapi:event_bus_client" "io.github.yunivers.keyf3.events.init.BindListener" entrypoint...
[1] 
[1] [MC]: 22:37:15.749 [main] INFO  Station|API - Setting up "rei_minimap" "stationapi:event_bus_client" "reifnsk.minimap.stationapi.ReiMinimapStationAPI" entrypoint...
[1] 
[1] [MC]: 22:37:15.752 [main] INFO  Station|API - Setting up "smoothbeta" "stationapi:event_bus_client" "net.mine_diver.smoothbeta.client.SmoothBetaClient" entrypoint...
[1] 
[1] [MC]: 22:37:15.755 [main] INFO  Station|API - Setting up "smoothbeta" "stationapi:event_bus_client" "net.mine_diver.smoothbeta.client.render.Shaders" entrypoint...
[1] 
[1] [MC]: 22:37:15.764 [main] INFO  Station|API - Setting up "station-achievements-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.gui.screen.achievement.AchievementPageImpl" entrypoint...
[1] 
[1] [MC]: 22:37:15.823 [main] INFO  Station|API - Setting up "station-container-api-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.network.GuiClientNetworkHandler" entrypoint...
[1] 
[1] [MC]: 22:37:16.038 [main] INFO  Station|API - Setting up "station-entities-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.network.EntityClientNetworkHandler" entrypoint...
[1] 
[1] [MC]: 22:37:16.043 [main] INFO  Station|API - Setting up "station-gui-api-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.gui.screen.EditWorldScreenImpl" entrypoint...
[1] 
[1] [MC]: 22:37:16.048 [main] INFO  Station|API - Setting up "station-items-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.render.item.CustomItemOverlayImpl" entrypoint...
[1] 
[1] [MC]: 22:37:16.052 [main] INFO  Station|API - Setting up "station-items-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.gui.screen.container.CustomTooltipRendererImpl" entrypoint...
[1] 
[1] [MC]: 22:37:16.058 [main] INFO  Station|API - Setting up "station-localization-api-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.api.resource.language.LanguageManager" entrypoint...
[1] 
[1] [MC]: 22:37:16.061 [main] INFO  Station|API - Setting up "station-registry-sync-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.registry.ClientServerRegistryRemapper" entrypoint...
[1] 
[1] [MC]: 22:37:16.063 [main] INFO  Station|API - Setting up "station-registry-sync-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.registry.ClientRegistryRestorer" entrypoint...
[1] 
[1] [MC]: 22:37:16.080 [main] INFO  Station|API - Setting up "station-renderer-api-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.texture.StationRenderImpl" entrypoint...
[1] 
[1] [MC]: 22:37:16.087 [main] INFO  Station|API - Setting up "station-renderer-arsenic" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.arsenic.Arsenic" entrypoint...
[1] 
[1] [MC]: 22:37:16.092 [main] INFO  Station|API - Setting up "station-resource-loader-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.resource.AssetsReloaderImpl" entrypoint...
[1] 
[1] [MC]: 22:37:16.096 [main] INFO  Station|API - Setting up "station-vanilla-checker-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.client.network.ClientVanillaChecker" entrypoint...
[1] 
[1] [MC]: 22:37:16.101 [main] INFO  Station|API - Setting up "station-vanilla-fix-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.vanillafix.client.gui.screen.EditWorldScreenImpl" entrypoint...
[1] 
[1] [MC]: 22:37:16.120 [main] INFO  Station|API - Setting up "station-vanilla-fix-v0" "stationapi:event_bus_client" "net.modificationstation.stationapi.impl.vanillafix.client.color.block.VanillaBlockColorProviders" entrypoint...
[1] 
[1] [MC]: 22:37:16.146 [main] INFO  Station|API - Setting up "unitweaks" "stationapi:event_bus_client" "net.danygames2014.unitweaks.tweaks.morekeybinds.KeyPressedListener" entrypoint...
[1] 
[1] [MC]: 22:37:16.272 [main] INFO  Station|API - Setting up "unitweaks" "stationapi:event_bus_client" "net.danygames2014.unitweaks.tweaks.morekeybinds.KeyBindingListener" entrypoint...
[1] 
[1] [MC]: 22:37:16.273 [main] INFO  Station|API - Setting up "unitweaks" "stationapi:event_bus_client" "net.danygames2014.unitweaks.bugfixes.grassblockitemfix.ColorProviderListener" entrypoint...
[1] 
[1] [MC]: 22:37:16.273 [main] INFO  Station|API - Invoking Init event...
[1] 
[1] [MC]: 22:37:16.369 [main] INFO  Station|API - Searching for JSON recipes...
[1] 
[1] [MC]: 22:37:16.393 [main] INFO  Station|API - Gathering mods that require client verification...
[1] 
[1] [MC]: 22:37:16.398 [main] INFO  Arsenic - Registering Arsenic renderer!
[1] 
[1] [MC]: 22:37:16.420 [main] INFO  keyf3|Mod - keyf3
[1] 
[1] [MC]: 22:37:16.425 [main] INFO  dynamic_light|Mod - Dynamic Light Mod initialized.
[1] 
[1] [MC]: 22:37:16.431 [main] INFO  dynamic_light|Mod - 50
[1] 22:37:16.431 [main] INFO  dynamic_light|Mod - 89
[1] 
[1] [MC]: 22:37:16.431 [main] INFO  dynamic_light|Mod - 74
[1] 22:37:16.431 [main] INFO  dynamic_light|Mod - 348
[1] 22:37:16.431 [main] INFO  dynamic_light|Mod - 76
[1] 
[1] [MC]: 22:37:16.433 [main] INFO  Station|API - Finished Station API setup.
[1] 
[1] [MC]: 22:37:17.206 [AWT-EventQueue-0] INFO  Station|API - Added vanilla blocks to the registry.
[1] 
[1] [MC]: 22:37:17.420 [AWT-EventQueue-0] INFO  Station|API - Added vanilla items to the registry.
[1] 
[1] [MC]: 16 achievements
[1] 
[1] [MC]: 151 recipes
[1] 
[1] [MC]: 22:37:19.089 [AWT-EventQueue-0] INFO  GCAPI3 - Adding config screens to ModMenu...
[1] 
[1] [MC]: Setting user: zukerman_
[1] 
[1] [MC]: [LWJGL] Detected environment: Os:linux Arch: amd64 Java: 21.0.9
[1] 
[1] [MC]: 22:37:21.461 [Thread-2] INFO  Station|API - Reloading ResourceManager: vanilla, Fabric Mods, /home/zukerman/.config/blockycraft-launcher/instances/default/.minecraft/texturepacks/betaoverhauled_v0.5_preview1.zip
[1] 
[1] [MC]: 22:37:21.488 [AWT-EventQueue-0] INFO  GCAPI3 - Loading config translations.
[1] 
[1] [MC]: 22:37:21.491 [AWT-EventQueue-0] INFO  GCAPI3 - Loaded 0 translations.
[1] 
[1] [MC]: 22:37:21.684 [Thread-2] INFO  Station|API - Reloading ResourceManager: vanilla, Fabric Mods
[1] 
[1] [MC]: 22:37:22.164 [AWT-EventQueue-0] INFO  Station|API - Resource reload finished after 455 ms
[1] 22:37:22.164 [AWT-EventQueue-0] INFO  Station|API - TagManagerLoader took approximately 372 ms (355 ms preparing, 17 ms applying)
[1] 
[1] [MC]: 22:37:22.165 [AWT-EventQueue-0] INFO  Station|API - Total blocking time: 17 ms
[1] 
[1] [MC]: 22:37:22.415 [AWT-EventQueue-0] INFO  StationRenderer|API - Created: 512x512 minecraft:textures/atlas/game.png-atlas
[1] 
[1] [MC]: 22:37:22.512 [AWT-EventQueue-0] INFO  Station|API - Resource reload finished after 829 ms
[1] 
[1] [MC]: 22:37:22.512 [AWT-EventQueue-0] INFO  Station|API - LanguageManager took approximately 145 ms (142 ms preparing, 3 ms applying)
[1] 22:37:22.512 [AWT-EventQueue-0] INFO  Station|API - Shaders took approximately 159 ms (13 ms preparing, 146 ms applying)
[1] 22:37:22.512 [AWT-EventQueue-0] INFO  Station|API - BakedModelManager took approximately 2405 ms (2368 ms preparing, 37 ms applying)
[1] 22:37:22.513 [AWT-EventQueue-0] INFO  Station|API - ItemModels took approximately 2 ms (0 ms preparing, 2 ms applying)
[1] 
[1] [MC]: 22:37:22.514 [AWT-EventQueue-0] INFO  Station|API - BlockDestructionTextures took approximately 2 ms (0 ms preparing, 2 ms applying)
[1] 22:37:22.514 [AWT-EventQueue-0] INFO  Station|API - ModTextures took approximately 111 ms (56 ms preparing, 55 ms applying)
[1] 
[1] [MC]: 22:37:22.514 [AWT-EventQueue-0] INFO  Station|API - Total blocking time: 245 ms
[1] 
[1] [MC-Err]: Jan 11, 2026 10:37:22 PM net.java.games.input.DefaultControllerEnvironment getControllers
[1] INFO: Loading: net.java.games.input.LinuxEnvironmentPlugin
[1] 
[1] [MC-Err]: Jan 11, 2026 10:37:22 PM net.java.games.input.ControllerEnvironment log
[1] INFO: Linux plugin claims to have found 15 controllers
[1] 
[1] 
[1] [MC]: 
[1] Starting up SoundSystem...
[1] 
[1] [MC]: Initializing LWJGL OpenAL
[1]     (The LWJGL binding of OpenAL.  For more information, see http://www.lwjgl.org)
[1] 
[1] [MC]: OpenAL initialized.
[1] 
[1] [MC]: 
[1] 
[1] [MC]: Connecting to 185.100.215.195, 25565
[1] 
[1] [MC]: 22:37:23.826 [AWT-EventQueue-0] INFO  alwaysmoreitems|Mod - Button alwaysmoreitems:set_time_day registered.
[1] 
[1] [MC]: 22:37:23.827 [AWT-EventQueue-0] INFO  alwaysmoreitems|Mod - Button alwaysmoreitems:set_time_night registered.
[1] 
[1] [MC]: 22:37:23.828 [AWT-EventQueue-0] INFO  alwaysmoreitems|Mod - Button alwaysmoreitems:toggle_weather registered.
[1] 
[1] [MC]: 22:37:23.830 [AWT-EventQueue-0] INFO  alwaysmoreitems|Mod - Button alwaysmoreitems:heal registered.
[1] 
[1] [MC]: 22:37:23.831 [AWT-EventQueue-0] INFO  alwaysmoreitems|Mod - Button alwaysmoreitems:trash registered.
[1] 
[1] [MC]: 22:37:23.842 [AWT-EventQueue-0] INFO  alwaysmoreitems|Mod - Found method for class net.minecraft.class_479
[1] 
[1] [MC]: 22:37:23.845 [AWT-EventQueue-0] INFO  alwaysmoreitems|Mod - Found method for class net.minecraft.class_19
[1] 
[1] [MC]: 22:37:23.909 [AWT-EventQueue-0] INFO  alwaysmoreitems|Mod - Registered plugin: alwaysmoreitems:vanilla/net.glasslauncher.mods.alwaysmoreitems.plugins.vanilla.VanillaPlugin
[1] 
[1] [MC]: 22:37:23.911 [AWT-EventQueue-0] INFO  alwaysmoreitems|Mod - Registered plugin: alwaysmoreitems:always_more_items/net.glasslauncher.mods.alwaysmoreitems.plugins.ami.AMIPlugin
[1] 
[1] [MC]: 22:37:23.945 [AWT-EventQueue-0] INFO  alwaysmoreitems|Mod - Initializing plugin Vanilla
[1] 22:37:23.945 [AWT-EventQueue-0] INFO  alwaysmoreitems|Mod - Initializing plugin AMI
[1] 

(/usr/libexec/xdg-desktop-portal:610900): xdg-desktop-portal-WARNING **: 22:37:30.543: Failed to create secret proxy: Error calling StartServiceByName for org.freedesktop.secrets: Timeout was reached

(/usr/libexec/xdg-desktop-portal:610900): xdg-desktop-portal-WARNING **: 22:37:30.543: No skeleton to export
dbus-daemon[610729]: [session uid=1000 pid=610729] Successfully activated service 'org.freedesktop.portal.Desktop'
[1] [MC]: 22:37:38.658 [AWT-EventQueue-0] INFO  GCAPI3 - Unloading server synced config!
[1] 
[1] [MC]: 22:37:38.664 [AWT-EventQueue-0] INFO  GCAPI3 - Successfully read "alwaysmoreitems:config"'s mod configs, reading 1 categories, and 13 values.
[1] 
[1] [MC]: 22:37:38.667 [AWT-EventQueue-0] INFO  GCAPI3 - Successfully read "inventorytweaks:inventoryTweaks"'s mod configs, reading 5 categories, and 22 values.
[1] 
[1] [MC]: 22:37:38.668 [AWT-EventQueue-0] INFO  GCAPI3 - Successfully read "item_3d:item3d_config"'s mod configs, reading 1 categories, and 1 values.
[1] 
[1] [MC]: 22:37:38.669 [AWT-EventQueue-0] INFO  GCAPI3 - Successfully read "station-api-configuration:config"'s mod configs, reading 1 categories, and 1 values.
[1] 
[1] [MC]: 22:37:38.671 [AWT-EventQueue-0] INFO  GCAPI3 - Successfully read "unitweaks:general"'s mod configs, reading 1 categories, and 6 values.
[1] 
[1] [MC]: 22:37:38.673 [AWT-EventQueue-0] INFO  GCAPI3 - Successfully read "unitweaks:userinterface"'s mod configs, reading 4 categories, and 21 values.
[1] 
[1] [MC]: 22:37:38.675 [AWT-EventQueue-0] INFO  GCAPI3 - Successfully read "unitweaks:gameplay"'s mod configs, reading 1 categories, and 5 values.
[1] 
[1] [MC]: 22:37:38.678 [AWT-EventQueue-0] INFO  GCAPI3 - Successfully read "unitweaks:features"'s mod configs, reading 3 categories, and 13 values.
[1] 
[1] [MC]: 22:37:38.681 [AWT-EventQueue-0] INFO  GCAPI3 - Successfully read "unitweaks:tweaks"'s mod configs, reading 1 categories, and 16 values.
[1] 
[1] [MC]: 22:37:38.685 [AWT-EventQueue-0] INFO  GCAPI3 - Successfully read "unitweaks:bugfixes"'s mod configs, reading 1 categories, and 30 values.
[1] 
[1] [MC]: 22:37:38.687 [AWT-EventQueue-0] INFO  GCAPI3 - Successfully read "unitweaks:oldfeatures"'s mod configs, reading 1 categories, and 9 values.
[1] 
[1] [MC]: 22:37:38.689 [AWT-EventQueue-0] INFO  GCAPI3 - Successfully read "unitweaks:recipes"'s mod configs, reading 4 categories, and 26 values.
[1] 
[1] [MC]: Stopping!
[1] 
[1] [MC]: 
[1] SoundSystem shutting down...
[1] 
[1] [MC]:     Author: Paul Lamb, www.paulscode.com
[1] 
[1] 
[1] Minecraft exited with code 0
[1] [start-electron] Restored node_modules/electron
[1] wait-on http://localhost:4321 && VITE_DEV_SERVER_URL=http://localhost:4321 npm run electron:start exited with code 0
--> Sending SIGTERM to other processes..
[0] npm run svelte:dev exited with code SIGTERM
A connection to the bus can't be made