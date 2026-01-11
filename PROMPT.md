# BlockyCRAFT Launcher - Status e Instruções de Teste

## ✅ Objetivo Alcançado

Fazer o `npm run dev` funcionar dentro do DevContainer para testar a aplicação Electron com GUI.

---

## Status Atual (Atualizado: 2026-01-11)

| Componente | Status | Notas |
|------------|--------|-------|
| `npm run dev` | ✅ Funciona | Electron GUI abre via Wayland |
| Launcher Electron GUI | ✅ Funciona | Usa `--ozone-platform=wayland` |
| Java 17 auto-download | ✅ Funciona | Baixa do Adoptium automaticamente |
| Minecraft (Java AWT) | ⏳ Testar | Aguardando rebuild do container |

---

## Instruções para Testar (Pós-Rebuild)

### 1. Pré-requisito no Host

Execute no terminal do **host** (fora do container):
```bash
xhost +local:docker
```

### 2. Testar o Launcher

```bash
npm run dev
```

Deve abrir a janela do BlockyCRAFT Launcher.

### 3. Testar o Minecraft

1. Digite um username no launcher
2. Clique em "Jogar"
3. O Minecraft deve abrir

Se falhar com erro X11, verifique:
- O container foi rebuildado após as alterações em `devcontainer.json`?
- O comando `xhost +local:docker` foi executado no host?

---

## Portabilidade (Para outros desenvolvedores)

O `devcontainer.json` foi configurado para funcionar em qualquer Linux com Wayland.

### Pré-requisitos para clonar e rodar:
1. Linux com Wayland (GNOME Wayland, KDE Plasma Wayland, Sway, etc.)
2. Docker instalado
3. VS Code com extensão Dev Containers

### Antes de abrir o container:
```bash
xhost +local:docker
```

### Nota sobre UID
O mount do `XDG_RUNTIME_DIR` usa `${localEnv:XDG_RUNTIME_DIR}` para detectar automaticamente o diretório do usuário. 

**Versão antiga (não portável)** usava UID hardcoded:
```json
"source=/run/user/1000,target=/tmp/xdg-runtime,type=bind"
```

**Versão atual (portável)**:
```json
"source=${localEnv:XDG_RUNTIME_DIR},target=/tmp/xdg-runtime,type=bind"
```

---

## Problemas Resolvidos

### 1. ELECTRON_RUN_AS_NODE=1

**Problema**: O container tinha `ELECTRON_RUN_AS_NODE=1` definido, forçando o Electron a rodar como Node.js puro. Isso impedia o registro do módulo `electron` built-in.

**Solução**: O script `scripts/start-electron.mjs` agora remove essa variável antes de iniciar o Electron.

### 2. Conflito de Módulo Electron

**Problema**: `require('electron')` no código bundled resolvia para o npm package (`node_modules/electron/index.js`) que retorna apenas um path, não o objeto `{app, BrowserWindow, ...}`.

**Solução**: O script `scripts/start-electron.mjs` renomeia temporariamente `node_modules/electron` para `.electron-npm` enquanto o Electron está rodando.

### 3. X11 vs Wayland

**Problema**: O Electron não conseguia conectar ao X11 (authorization error).

**Solução**: Configurado para usar Wayland com `--ozone-platform=wayland`.

---

## Arquivos Modificados

- `scripts/start-electron.mjs` - Script de inicialização do Electron com:
  - Remoção de `ELECTRON_RUN_AS_NODE` do ambiente
  - Renomeio temporário de `node_modules/electron`
  - Flag `--ozone-platform=wayland`
  - Configuração de `WAYLAND_DISPLAY` e `XDG_RUNTIME_DIR`

- `.devcontainer/devcontainer.json` - Configuração do container com:
  - Mount de `/run/user/1000` para `/tmp/xdg-runtime`
  - Variáveis de ambiente para X11/Wayland
  - Permissões corretas para X11 socket

---

## Comandos Úteis

```bash
# Testar se X11 está funcionando
DISPLAY=:0 xeyes

# Liberar porta ocupada
lsof -ti:4321 | xargs -r kill

# Ver logs detalhados do Electron
ELECTRON_ENABLE_LOGGING=1 npm run dev
```

---

## Código Implementado (Funcional)

A feature de **Java 17 auto-download** foi implementada nos arquivos:

- `electron/handlers/JavaManager.ts` - Baixa Java 17 via Adoptium API
- `electron/handlers/GameHandler.ts` - Usa JavaManager para garantir Java

O código compila sem erros.
