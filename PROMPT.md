# Implementação: Browser Overlay com Hotkey (Shift+Tab)

> **Modelo alvo**: Claude Opus 4.5 (Thinking)  
> **Projeto**: BlockyCRAFT-Launcher  
> **Objetivo**: Implementar overlay de navegador in-game acionado por hotkey

---

## 🎯 Objetivo Principal

Implementar um **overlay de navegador** integrado ao launcher BlockyCRAFT-Launcher que:

1. É acionado pela hotkey **Shift+Tab** (inspirado na Steam)
2. Abre diretamente no site **https://craft.blocky.com.br**
3. Funciona enquanto o jogo Minecraft Beta 1.7.3 está em execução
4. Permite navegação completa no browser embedded
5. Pode ser fechado com a mesma hotkey ou tecla Escape

---

## 📁 Contexto do Projeto

### Stack Tecnológica
- **Runtime**: Electron ^33.4.11
- **Frontend**: Svelte 5 (usando Runes: `$state`, `$effect`, `$derived`)
- **Build**: Vite + esbuild
- **Linguagem**: TypeScript

### Estrutura Relevante
```
BlockyCRAFT-Launcher/
├── electron/
│   ├── main.ts              # Entry point - criar overlay window aqui
│   ├── preload.ts           # Bridge IPC - expor toggle do overlay
│   └── handlers/
│       ├── GameHandler.ts   # Monitora processo do jogo
│       └── ...
├── src/
│   ├── App.svelte           # Componente raiz
│   ├── lib/
│   │   ├── electron.ts      # ElectronService - adicionar método
│   │   └── components/      # UI components
│   └── styles/
│       └── theme.css        # Design tokens
└── package.json
```

### Padrões Existentes a Seguir
1. **IPC via preload.ts**: Channels validados em allowlist
2. **Handlers modulares**: Lógica isolada em classes no diretório `handlers/`
3. **ElectronService**: Abstração para mock no browser mode
4. **CSS Variables**: Usar tokens de `theme.css`

---

## 🔧 Decomposição da Tarefa

### Subtarefa 1: Global Hotkey Listener (Main Process)

**Arquivo**: `electron/main.ts` ou novo `electron/handlers/OverlayHandler.ts`

**Requisitos**:
- Registrar hotkey global `Shift+Tab` usando `globalShortcut.register()`
- Hotkey deve funcionar **mesmo quando o jogo está em foco**
- Considerar desregistrar ao fechar app (`app.on('will-quit')`)

**Referência Electron**:
```typescript
import { globalShortcut } from 'electron';

globalShortcut.register('Shift+Tab', () => {
  // Toggle overlay visibility
});
```

---

### Subtarefa 2: Overlay BrowserWindow

**Arquivo**: Novo handler ou extensão de `main.ts`

**Requisitos**:
- Criar `BrowserWindow` secundária com configurações de overlay:
  - `transparent: true` (opcional, para efeitos visuais)
  - `frame: false` (sem barra de título)
  - `alwaysOnTop: true` (por cima do jogo)
  - `fullscreen: true` ou dimensões da tela
  - `skipTaskbar: true`
- Carregar URL: `https://craft.blocky.com.br`
- Inicialmente oculta (`show: false`)

**Exemplo de configuração**:
```typescript
const overlayWindow = new BrowserWindow({
  width: 1280,
  height: 720,
  frame: false,
  transparent: true,
  alwaysOnTop: true,
  skipTaskbar: true,
  show: false,
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    // Sem preload necessário para website externo
  }
});

overlayWindow.loadURL('https://craft.blocky.com.br');
```

---

### Subtarefa 3: Toggle Logic

**Arquivo**: Handler do overlay

**Requisitos**:
- Toggle visibilidade: `overlayWindow.show()` / `overlayWindow.hide()`
- Ao abrir overlay:
  - Pausar/minimizar input do jogo (se possível)
  - Trazer overlay para frente
  - Focar na webview
- Ao fechar overlay:
  - Esconder window
  - Devolver foco ao jogo
- Hotkey `Escape` também deve fechar

**Consideração importante**:
- O jogo (Minecraft) é um processo Java separado spawned pelo `GameHandler`
- Pode ser necessário comunicar via IPC com a janela do overlay

---

### Subtarefa 4: UI do Overlay

**Arquivo**: Novo arquivo HTML/Svelte ou inline no BrowserWindow

**Requisitos**:
- Header com:
  - Título "BlockyCRAFT Browser"
  - Botão de fechar (X)
  - Barra de navegação simples (opcional)
- Webview/iframe ocupando resto do espaço
- Estilização seguindo design system (cores escuras, `--color-bg-dark`)

**Alternativa simples**:
- Usar apenas `BrowserWindow.loadURL()` sem UI customizada
- Adicionar listener de `Escape` para fechar

---

### Subtarefa 5: Integração com GameHandler

**Arquivo**: `electron/handlers/GameHandler.ts`

**Requisitos**:
- Overlay só deve ser ativável quando `isGameRunning === true`
- Opcional: Notificar UI principal sobre estado do overlay
- Considerar cleanup se jogo fechar enquanto overlay está aberto

---

### Subtarefa 6: IPC Bridge (Opcional)

**Arquivo**: `electron/preload.ts`

**Se necessário** expor ao renderer:
```typescript
// Adicionar ao validChannels
const validChannels = [..., 'toggle-overlay', 'overlay-status'];

// Expor método
toggleOverlay: () => ipcRenderer.invoke('toggle-overlay'),
onOverlayChange: (callback) => ipcRenderer.on('overlay-status', callback)
```

---

## ⚠️ Considerações Técnicas

### 1. Linux/Wayland Compatibility
O launcher já usa flags Wayland:
```typescript
app.commandLine.appendSwitch('ozone-platform-hint', 'auto');
```
- Testar se overlay `alwaysOnTop` funciona no Wayland
- Fallback para X11 se necessário

### 2. Foco entre Janelas
- Minecraft é processo separado (Java)
- `BrowserWindow.focus()` pode não roubar foco do jogo
- Considerar usar `globalShortcut` consistentemente

### 3. Performance
- Overlay deve ser leve para não impactar FPS do jogo
- Considerar `backgroundThrottling: false` se necessário
- Lazy load: criar window apenas no primeiro uso

### 4. Segurança
- Website externo não precisa de preload
- Garantir que `nodeIntegration: false` no overlay
- Considerar CSP para a webview

### 5. AppImage (Linux) - CRÍTICO
- O launcher é distribuído como **AppImage** no Linux
- AppImages rodam em ambiente sandbox com filesystem virtual
- Testar com `npm run dist` e executar o `.AppImage` gerado
- Verificar se `globalShortcut` funciona no contexto AppImage
- Considerar permissões de acesso a rede no sandbox
- Usar paths relativos ou `app.getPath()` ao invés de paths absolutos

---

## 📋 Critérios de Aceitação

- [ ] Hotkey `Shift+Tab` abre overlay quando jogo está rodando
- [ ] Overlay exibe https://craft.blocky.com.br funcional
- [ ] Navegação no site funciona (links, scroll, forms)
- [ ] `Shift+Tab` ou `Escape` fecha o overlay
- [ ] Overlay aparece por cima do jogo fullscreen
- [ ] Foco retorna ao jogo após fechar overlay
- [ ] **Funciona no Linux AppImage** (distribuição principal do launcher)
- [ ] Funciona em Linux (X11 e Wayland) e Windows
- [ ] Sem memory leaks (overlay é reutilizado, não recriado)

> ⚠️ **IMPORTANTE**: O formato de distribuição principal para Linux é **AppImage**. 
> Toda a implementação deve ser testada e funcionar corretamente quando executada como AppImage.

---

## 🧠 Estratégia de Implementação (Inspirada em RLMs)

> Baseado no paper "Recursive Language Models" (arXiv:2512.24601v1)

### Abordagem Recomendada

1. **Explore o ambiente primeiro**
   - Leia `electron/main.ts` para entender o bootstrap
   - Examine `GameHandler.ts` para ver como o processo do jogo é gerenciado
   - Verifique `preload.ts` para padrões de IPC existentes

2. **Decomponha recursivamente**
   - Implemente o GlobalShortcut isoladamente primeiro
   - Teste a BrowserWindow overlay separadamente
   - Integre os componentes incrementalmente

3. **Use código para filtrar contexto**
   - Se precisar entender um arquivo grande, busque por keywords relevantes
   - Foque nas funções que interagem com `BrowserWindow` e `spawn`

4. **Verifique iterativamente**
   - Após cada subtarefa, teste o comportamento
   - Use `console.log` estratégico para debug
   - Valide no ambiente real (com jogo rodando)

---

## 📎 Arquivos para Modificar

| Arquivo | Ação | Prioridade |
|---------|------|------------|
| `electron/main.ts` | Adicionar globalShortcut e overlay window | Alta |
| `electron/handlers/GameHandler.ts` | Expor estado do jogo para overlay | Média |
| `electron/preload.ts` | Novos channels IPC (se necessário) | Baixa |
| `src/lib/electron.ts` | Métodos para overlay (se UI precisar) | Baixa |

---

## 🚀 Comando para Testar

```bash
npm run dev
# 1. Abra o launcher
# 2. Inicie o jogo com um username
# 3. Quando o jogo estiver rodando, pressione Shift+Tab
# 4. O overlay deve aparecer com o site
# 5. Pressione Escape ou Shift+Tab para fechar
```

---

## 💡 Dicas Finais

1. **Comece simples**: Primeiro faça funcionar, depois refine
2. **Electron docs**: https://www.electronjs.org/docs/latest/api/global-shortcut
3. **Reutilize padrões**: O projeto já tem boa estrutura, siga-a
4. **Teste em Linux**: O público-alvo usa muito Linux, verifique Wayland
5. **Log tudo**: Use o `Logger` existente em `handlers/Logger.ts`

---

*Prompt criado em 2026-01-16 para implementação de overlay browser no BlockyCRAFT-Launcher*
