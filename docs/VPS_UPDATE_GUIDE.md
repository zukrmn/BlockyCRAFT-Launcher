# Sistema de Atualização - Instruções VPS

## 📁 Estrutura de Arquivos na VPS

Você precisa disponibilizar os seguintes arquivos na URL principal:
`https://craft.blocky.com.br/launcher-assets/`

```
launcher-assets/
├── version.json        ← OBRIGATÓRIO - Contém versões atuais
├── instance.zip        ← Instância completa do Minecraft
├── libraries.zip       ← Bibliotecas Fabric/Babric
└── mods.zip            ← (Opcional) Atualização apenas de mods
```

---

## 🔗 URLs do Sistema

### URL Principal (Produção)
```
https://craft.blocky.com.br/launcher-assets/
```

### URL de Fallback (Backup automático)
```
https://marina.rodrigorocha.art.br/launcher-assets/
```

> **Nota:** O launcher tenta primeiro a URL principal. Se falhar (timeout de 10s ou erro HTTP), automaticamente tenta o fallback.

---

## 📄 Formato do `version.json`

Crie o arquivo `version.json` com este formato:

```json
{
    "launcher_version": "0.1.0",
    "instance": {
        "version": "2026.01.12",
        "url": "https://craft.blocky.com.br/launcher-assets/instance.zip"
    },
    "libraries": {
        "version": "2026.01.12",
        "url": "https://craft.blocky.com.br/launcher-assets/libraries.zip"
    },
    "mods": {
        "version": "1.0.0",
        "url": "https://craft.blocky.com.br/launcher-assets/mods.zip",
        "notes": "Descrição da atualização de mods"
    }
}
```

### Campos Obrigatórios

| Campo | Descrição |
|-------|-----------|
| `launcher_version` | Versão do launcher (para futuras verificações de compatibilidade) |
| `instance.version` | Versão da instância - MUDE quando atualizar instance.zip |
| `instance.url` | URL de download do instance.zip |
| `libraries.version` | Versão das bibliotecas - MUDE quando atualizar libraries.zip |
| `libraries.url` | URL de download do libraries.zip |

### Campos Opcionais

| Campo | Descrição |
|-------|-----------|
| `mods` | Bloco inteiro opcional - para atualizar apenas mods |
| `mods.version` | Versão dos mods |
| `mods.url` | URL do zip contendo a pasta `mods/` |
| `mods.notes` | Notas da atualização (exibidas ao usuário) |

---

## 🔄 Como Fazer Atualizações

### Atualizar a Instância Completa

1. Gere o novo `instance.zip` com todas as alterações
2. Faça upload para `https://craft.blocky.com.br/launcher-assets/instance.zip`
3. Edite `version.json`:
   ```json
   "instance": {
       "version": "2026.01.13",  ← MUDE ESTA VERSÃO
       "url": "https://craft.blocky.com.br/launcher-assets/instance.zip"
   }
   ```

### Atualizar as Bibliotecas

1. Gere o novo `libraries.zip`
2. Faça upload para `https://craft.blocky.com.br/launcher-assets/libraries.zip`
3. Edite `version.json`:
   ```json
   "libraries": {
       "version": "2026.01.13",  ← MUDE ESTA VERSÃO
       "url": "https://craft.blocky.com.br/launcher-assets/libraries.zip"
   }
   ```

### Atualizar Apenas Mods (Sem Rebuild Completo)

1. Crie um zip contendo a pasta `mods/`:
   ```
   mods.zip
   └── mods/
       ├── mod1.jar
       ├── mod2.jar
       └── ...
   ```
2. Faça upload para `https://craft.blocky.com.br/launcher-assets/mods.zip`
3. Edite `version.json`:
   ```json
   "mods": {
       "version": "1.0.1",  ← MUDE ESTA VERSÃO
       "url": "https://craft.blocky.com.br/launcher-assets/mods.zip",
       "notes": "Adicionado mod XYZ, corrigido bug ABC"
   }
   ```

---

## 🚀 Primeiro Deploy

Para o primeiro deploy, crie o `version.json` inicial:

```json
{
    "launcher_version": "0.1.0",
    "instance": {
        "version": "2026.01.12",
        "url": "https://craft.blocky.com.br/launcher-assets/instance.zip"
    },
    "libraries": {
        "version": "2026.01.12",
        "url": "https://craft.blocky.com.br/launcher-assets/libraries.zip"
    }
}
```

> **Nota:** O bloco `mods` é opcional e pode ser omitido se você não precisar de atualizações separadas de mods.

---

## 🔀 Sistema de Fallback

O launcher automaticamente tenta múltiplas URLs se a principal falhar:

```
1. Tenta: https://craft.blocky.com.br/launcher-assets/version.json
   ↓ Falha? (timeout 10s ou erro HTTP)
2. Tenta: https://marina.rodrigorocha.art.br/launcher-assets/version.json
   ↓ Sucesso? Usa esta URL para downloads também
```

Para manter o fallback funcionando, mantenha os mesmos arquivos em ambas as URLs:
- `https://craft.blocky.com.br/launcher-assets/` (principal)
- `https://marina.rodrigorocha.art.br/launcher-assets/` (backup)

---

## ✅ Checklist de Verificação

Antes de publicar uma atualização, verifique:

- [ ] Os arquivos `.zip` estão acessíveis publicamente (teste no navegador)
- [ ] O `version.json` está com JSON válido (use um validador online se necessário)
- [ ] A versão no JSON é DIFERENTE da versão anterior
- [ ] O CORS está configurado no servidor (se necessário)
- [ ] Os arquivos têm o Content-Type correto:
  - `version.json` → `application/json`
  - `*.zip` → `application/zip`

---

## 🔍 Comportamento do Launcher

Quando o usuário clica em "Jogar":

1. Launcher busca `version.json` da VPS (tenta principal, depois fallback)
2. Compara versões locais com remotas
3. Se houver diferença:
   - Baixa o(s) arquivo(s) atualizado(s)
   - Extrai e substitui os arquivos locais
   - Salva as novas versões localmente
4. Continua com o lançamento do jogo

As versões locais são salvas em:
`~/.config/blockycraft-launcher/versions.json`

---

## 🛠️ Troubleshooting

### "Não está baixando a atualização"
- Verifique se a versão no `version.json` é DIFERENTE da versão local
- O launcher só baixa se as versões forem diferentes

### "Erro de download"
- Verifique se a URL está correta e acessível
- Teste acessar a URL diretamente no navegador
- Verifique se o servidor não está bloqueando requests do Electron (CORS)
- O launcher tentará automaticamente o fallback se a URL principal falhar

### "Atualização corrompida"
- O arquivo zip pode estar corrompido
- Regenere o zip e faça upload novamente

### "Fallback não funciona"
- Certifique-se de que os mesmos arquivos estão disponíveis em ambas as URLs
- Verifique se o timeout de 10 segundos é suficiente para sua conexão
