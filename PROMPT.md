# BlockyCRAFT Launcher - Troubleshooting Electron in DevContainer

## Objetivo

Fazer o `npm run dev` funcionar dentro do DevContainer para testar a aplicação Electron com GUI.

---

## Pré-requisitos no Host (Máquina Local)

O usuário já executou:
```bash
xhost +local:docker
```

Isso permite que o container acesse o display X11 do host.

---

## Problema Identificado

O Electron não consegue iniciar porque existe um conflito de resolução de módulos:

1. O `require('electron')` no código bundled (`dist-electron/main.cjs`) deve resolver para o **módulo built-in do Electron**
2. Porém, está resolvendo para o **npm package `electron`** em `node_modules/electron/index.js`
3. O npm package apenas retorna um path string, não o objeto `{app, BrowserWindow, ...}`

### Erro Específico:
```
TypeError: Cannot read properties of undefined (reading 'commandLine')
```

Isso acontece porque `app` é `undefined` (o npm package não exporta `app`).

---

## O que já foi tentado

1. ✅ Instalou bibliotecas gráficas (libnss3, libgtk-3-0, etc.) via `sudo apt-get install`
2. ✅ Verificou que X11 socket está disponível (`/tmp/.X11-unix/X0`)
3. ✅ Verificou que `DISPLAY=:0` está configurado
4. ❌ Banner no esbuild para shimmar o módulo electron - causou EISDIR error
5. ❌ Script `start-electron.mjs` renomeia `index.js` - Electron não encontra módulo built-in

---

## Próximos Passos para Resolver

### Opção 1: Modificar start-electron.mjs

O script atual apenas renomeia `index.js`, mas isso não é suficiente. Uma solução mais robusta seria:

```javascript
// Ao invés de apenas renomear, criar um shim que exporta o caminho esperado
// OU garantir que node_modules/electron não seja resolvido pelo Electron internamente
```

### Opção 2: Usar electron-forge ou vite-plugin-electron

Esses tools têm melhor handling do conflito de módulos.

### Opção 3: Variável de ambiente NODE_PATH

Testar se definir `NODE_PATH` para não incluir `node_modules/electron` resolve:
```bash
NODE_PATH="" DISPLAY=:0 ./node_modules/electron/dist/electron .
```

### Opção 4: Renomear node_modules/electron temporariamente

```bash
mv node_modules/electron node_modules/.electron-pkg
DISPLAY=:0 ./node_modules/.electron-pkg/dist/electron .
mv node_modules/.electron-pkg node_modules/electron
```

---

## Verificações Importantes

### 1. Testar se bibliotecas gráficas estão instaladas:
```bash
ldd node_modules/electron/dist/electron | grep "not found"
```
Se retornar algo, faltam bibliotecas.

### 2. Testar se X11 está funcionando:
```bash
DISPLAY=:0 xeyes
```
Se abrir uma janela com olhos, X11 funciona.

### 3. Verificar módulo electron:
```bash
cat node_modules/electron/index.js
# Deve mostrar um script que exporta getElectronPath()
```

---

## Código Implementado (Já Funcional)

A feature de **Java 17 auto-download** foi implementada nos arquivos:

- `electron/handlers/JavaManager.ts` - Baixa Java 17 via Adoptium API
- `electron/handlers/GameHandler.ts` - Usa JavaManager para garantir Java

O código compila sem erros. O problema é apenas para testar a GUI no container.

---

## Comandos Úteis

```bash
# Rebuild apenas o Electron
npm run electron:build

# Ver erros detalhados
DISPLAY=:0 ./node_modules/electron/dist/electron . 2>&1

# Testar sem o script start-electron.mjs problemático
npm run electron:build && npm run svelte:dev &
sleep 3
DISPLAY=:0 VITE_DEV_SERVER_URL=http://localhost:4321 ./node_modules/electron/dist/electron .
```

---

## Resumo

O usuário está rebuildando o container. Após rebuild, teste `npm run dev`. Se ainda falhar com o erro de módulo, implemente uma das opções acima para resolver o conflito `require('electron')`.
