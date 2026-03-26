# BlockyCRAFT Launcher

> A modern, "zero-config" launcher for BlockyCRAFT (Minecraft Beta 1.7.3).

<details open>
<summary><strong>🇺🇸 English (Click to Expand)</strong></summary>

## About The Project

**BlockyCRAFT** is a geopolitics server running on Minecraft Beta 1.7.3. While the server aims for a "plug & play" experience using only server-side plugins, the client-side experience for this legacy version has historically been difficult for new players.

Existing solutions like **Betacraft** (too vanilla/buggy) or **Prism Launcher** (too complex to configure with Java versions) create a barrier to entry.

The **BlockyCRAFT Launcher** solves this by providing a unified, automatic, and modern experience. It handles everything from Java installation to mod management, ensuring players can just click "Play".

### Key Features

*   **Zero-Config Launch**: Automatically detects systems without Java or with incompatible versions and downloads/configures the correct **Eclipse Temurin Java 17+** runtime locally. No manual paths needed.
*   **Pre-Configured Instance**: Comes bundled (and auto-updates) with a specific **Babric** instance containing:
    *   **StationAPI**: For mod compatibility.
    *   **Performance Fixes**: Running smoothly on modern hardware.
    *   **Audio Fixes**: Automatic OpenAL Soft configuration to fix sound on Linux/Wayland.
*   **Native Linux Support**: Works flawlessly on Linux, including **Wayland** environments (where legacy launchers often struggle).
*   **Smart Updates**:
    *   **Self-Updating**: The launcher updates itself.
    *   **Content Updates**: Instantly pushes new mods, config changes, or library fixes via a VPS-hosted version manifest.
*   **Modern UI**: A beautiful implementation of Glassmorphism using **Svelte 5** and **TailwindCSS**, completely breaking away from the "gray window" standard of legacy launchers.

## Tech Stack

This project is an "Isomorphic" application, sharing logic between a web context and a native Electron context.

*   **Core**: [Electron](https://www.electronjs.org/) (Chromium + Node.js)
*   **Frontend**: [Svelte 5](https://svelte.dev/) (Runes/Reactive State)
*   **Styling**: [TailwindCSS](https://tailwindcss.com/)
*   **Build System**: [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Prerequisites

*   **Node.js** (v20 or higher recommended)
*   **npm**

### Installation

1.  Clone the repo:
    ```bash
    git clone https://github.com/your-username/blockycraft-launcher.git
    cd blockycraft-launcher
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Development Modes

#### Full Electron Mode (Native)
Runs the full desktop experience. This will behave exactly like the final executable.
```bash
npm run dev
```
*Note: Includes a hot-reload dev server.*

#### Browser Mock Mode (UI Only)
Runs the interface in your web browser. Useful for quick UI tweaks.
```bash
npm run svelte:dev
```
*Note: Game launch and file system operations are mocked in this mode.*

## Building for Production

To create the standalone executable (installer/AppImage/etc.):

```bash
npm run dist
```
The output will be in the `dist/` directory.

## Architecture Highlights

*   **GameHandler.ts**: The brain of the operation. Manages the complex state machine of downloading assets, verifying hashes, constructing the Java classpath, and spawning the game process with specific JVM arguments to fix legacy bugs (S3, connection issues).
*   **UpdateManager.ts**: Handles the robust dual-mirror update system (`craft.blocky.com.br` / `marina.rodrigorocha.art.br`), ensuring high availability for game updates.
*   **JavaManager.ts**: Provides the "it just works" factor by intelligently managing the Java runtime environment.

## Code Signing Policy

Free code signing provided by [SignPath.io](https://signpath.io), certificate by [SignPath Foundation](https://signpath.org).

### Team Roles
*   **Committers and Reviewers**: [Repository Contributors](https://github.com/zukrmn/BlockyCRAFT-Launcher/graphs/contributors)
*   **Approvers**: Repository Owners

### Privacy Policy
This program will not transfer any information to other networked systems unless specifically requested by the user. The launcher downloads game files from official Mojang servers and BlockyCRAFT update servers (`craft.blocky.com.br`) only.

</details>

<details>
<summary><strong>🇧🇷 Português (Clique para Expandir)</strong></summary>

## Sobre o Projeto

**BlockyCRAFT** é um servidor de geopolítica rodando no Minecraft Beta 1.7.3. Enquanto o servidor busca uma experiência "plug & play" usando apenas plugins, a experiência do lado do cliente (client-side) para essa versão legada tem sido historicamente difícil para novos jogadores.

Soluções existentes como **Betacraft** (muito vanilla/bugado) ou **Prism Launcher** (muito complexo para configurar versões do Java) criam uma barreira de entrada.

O **BlockyCRAFT Launcher** surge para resolver isso, oferecendo uma experiência unificada, automática e moderna. Ele gerencia tudo, desde a instalação do Java até o gerenciamento de mods, garantindo que o jogador precise apenas clicar em "Jogar".

### Funcionalidades Principais

*   **Lançamento "Zero-Config"**: Detecta automaticamente sistemas sem Java ou com versões incompatíveis e baixa/configura o runtime **Eclipse Temurin Java 17+** correto localmente. Sem caminhos manuais.
*   **Instância Pré-Configurada**: Vem com uma instância **Babric** específica (e auto-atualizável) contendo:
    *   **StationAPI**: Para compatibilidade de mods.
    *   **Correções de Performance**: Rodando suavemente em hardware moderno.
    *   **Correções de Áudio**: Configuração automática do OpenAL Soft para corrigir som no Linux/Wayland.
*   **Suporte Nativo a Linux**: Funciona perfeitamente no Linux, incluindo ambientes **Wayland** (onde launchers legados costumam falhar).
*   **Atualizações Inteligentes**:
    *   **Auto-Update**: O launcher se atualiza sozinho.
    *   **Atualização de Conteúdo**: Envia instantaneamente novos mods, configs, ou correções de bibliotecas através de um manifesto de versão hospedado em VPS.
*   **UI Moderna**: Uma bela implementação de Glassmorphism usando **Svelte 5** e **TailwindCSS**, quebrando completamente o padrão de "janela cinza" dos launchers antigos.

## Stack Tecnológica

Este projeto é uma aplicação "Isomórfica", compartilhando lógica entre um contexto web e um contexto nativo Electron.

*   **Core**: [Electron](https://www.electronjs.org/) (Chromium + Node.js)
*   **Frontend**: [Svelte 5](https://svelte.dev/) (Runes/Reactive State)
*   **Estilo**: [TailwindCSS](https://tailwindcss.com/)
*   **Build System**: [Vite](https://vitejs.dev/)
*   **Linguagem**: [TypeScript](https://www.typescriptlang.org/)

## Começando

### Pré-requisitos

*   **Node.js** (v20 ou superior recomendado)
*   **npm**

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/seu-usuario/blockycraft-launcher.git
    cd blockycraft-launcher
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```

### Modos de Desenvolvimento

#### Modo Full Electron (Nativo)
Roda a experiência completa de desktop. Comporta-se exatamente como o executável final.
```bash
npm run dev
```
*Nota: Inclui servidor de hot-reload.*

#### Modo Browser Mock (Apenas UI)
Roda a interface no seu navegador. Útil para ajustes rápidos de UI.
```bash
npm run svelte:dev
```
*Nota: Lançamento do jogo e operações de sistema de arquivos são simulados neste modo.*

## Compilando para Produção

Para criar o executável standalone (instalador/AppImage/etc.):

```bash
npm run dist
```
O arquivo de saída estará no diretório `dist/`.

## Destaques da Arquitetura

*   **GameHandler.ts**: O cérebro da operação. Gerencia a máquina de estados complexa de baixar assets, verificar hashes, construir o classpath do Java e iniciar o processo do jogo com argumentos JVM específicos para corrigir bugs legados (S3, problemas de conexão).
*   **UpdateManager.ts**: Mantém um sistema robusto de atualizações com espelho duplo (`craft.blocky.com.br` / `marina.rodrigorocha.art.br`), garantindo alta disponibilidade para atualizações do jogo.
*   **JavaManager.ts**: Fornece o fator "simplesmente funciona" gerenciando inteligentemente o ambiente de execução Java.

## Política de Assinatura de Código

Assinatura de código gratuita fornecida por [SignPath.io](https://signpath.io), certificado por [SignPath Foundation](https://signpath.org).

### Funções da Equipe
*   **Committers e Revisores**: [Contribuidores do Repositório](https://github.com/zukrmn/BlockyCRAFT-Launcher/graphs/contributors)
*   **Aprovadores**: Proprietários do Repositório

### Política de Privacidade
Este programa não transferirá nenhuma informação para outros sistemas em rede, a menos que especificamente solicitado pelo usuário. O launcher baixa arquivos do jogo apenas dos servidores oficiais da Mojang e dos servidores de atualização do BlockyCRAFT (`craft.blocky.com.br`).

</details>

## License

Distributed under the MIT License. See `LICENSE` for more information.

---
