FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

# Instala todas as dependências do Electron/Chromium e Java GUI
RUN apt-get update && apt-get install -y --no-install-recommends \
    # NSS e NSPR (criptografia)
    libnss3 \
    libnspr4 \
    # GTK3 e dependências de UI
    libgtk-3-0 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libatspi2.0-0 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libcairo2 \
    # Renderização e gráficos
    libdrm2 \
    libgbm1 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libxkbcommon0 \
    libxshmfence1 \
    libglu1-mesa \
    # X11 e XCB
    libx11-xcb1 \
    libxcb-dri3-0 \
    libxcursor1 \
    libxss1 \
    # Sistema
    libcups2 \
    libasound2 \
    libdbus-1-3 \
    dbus \
    # Java AWT/Swing dependencies
    libxrender1 \
    libxtst6 \
    fontconfig \
    libfreetype6 \
    libxxf86vm1 \
    libgl1 \
    libglx-mesa0 \
    libopenal1 \
    # Configura permissões do usuário
    && usermod -aG audio,video,plugdev node || true \
    && groupadd -f input \
    && usermod -aG input node || true \
    # Limpeza de cache
    && rm -rf /var/lib/apt/lists/*

