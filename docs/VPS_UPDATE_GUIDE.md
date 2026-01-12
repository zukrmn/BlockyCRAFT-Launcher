# Sistema de Atualização - Instruções VPS

## 📁 Estrutura de Arquivos na VPS

Você precisa disponibilizar os seguintes arquivos:

**URL Principal:** `https://craft.blocky.com.br/launcher-assets/`
**URL de Backup:** `https://marina.rodrigorocha.art.br/launcher-assets/`

```
launcher-assets/
├── version.json        ← OBRIGATÓRIO - Contém versões e URLs
├── instance.zip        ← Instância completa do Minecraft
├── libraries.zip       ← Bibliotecas Fabric/Babric
└── mods.zip            ← (Opcional) Atualização apenas de mods
```

---

## � Formato do `version.json` (Com URLs de Fallback)

O launcher agora suporta **múltiplas URLs** para cada recurso. Se a primeira falhar, tenta a próxima automaticamente.

```json
{
    "launcher_version": "0.2.0",
    "instance": {
        "version": "2026.01.12",
        "url": [
            "https://craft.blocky.com.br/launcher-assets/instance.zip",
            "https://marina.rodrigorocha.art.br/launcher-assets/instance.zip"
        ]
    },
    "libraries": {
        "version": "2026.01.12",
        "url": [
            "https://craft.blocky.com.br/launcher-assets/libraries.zip",
            "https://marina.rodrigorocha.art.br/launcher-assets/libraries.zip"
        ]
    },
    "mods": {
        "version": "1.0.0",
        "url": [
            "https://craft.blocky.com.br/launcher-assets/mods.zip",
            "https://marina.rodrigorocha.art.br/launcher-assets/mods.zip"
        ],
        "notes": "Descrição da atualização"
    }
}
```

### Formatos Suportados para `url`:

**Array de URLs (recomendado):**
```json
"url": [
    "https://servidor-principal.com/arquivo.zip",
    "https://servidor-backup.com/arquivo.zip"
]
```

**URL única (compatibilidade):**
```json
"url": "https://servidor.com/arquivo.zip"
```

---

## 🔄 Como o Fallback Funciona

```
1. Launcher busca version.json:
   → Tenta: craft.blocky.com.br/version.json
   → Se falhar: marina.rodrigorocha.art.br/version.json

2. Para cada download (instance, libraries, mods):
   → Tenta URL[0] do array (principal)
   → Se falhar: Tenta URL[1] (backup)
   → Se falhar: Tenta URL[2]... etc
```

---

## � Exemplo Completo para Deploy

Crie o `version.json` em **ambos** os servidores:

```json
{
    "launcher_version": "0.2.0",
    "instance": {
        "version": "2026.01.12",
        "url": [
            "https://craft.blocky.com.br/launcher-assets/instance.zip",
            "https://marina.rodrigorocha.art.br/launcher-assets/instance.zip"
        ]
    },
    "libraries": {
        "version": "2026.01.12",
        "url": [
            "https://craft.blocky.com.br/launcher-assets/libraries.zip",
            "https://marina.rodrigorocha.art.br/launcher-assets/libraries.zip"
        ]
    }
}
```

---

## 📝 Como Atualizar

### Atualizar a Instância

1. Faça upload do `instance.zip` para **ambos** os servidores
2. Atualize o `version.json`:
   ```json
   "instance": {
       "version": "2026.01.13",  ← MUDE A VERSÃO
       "url": [...]
   }
   ```

### Atualizar as Bibliotecas

1. Faça upload do `libraries.zip` para **ambos** os servidores
2. Atualize o `version.json`:
   ```json
   "libraries": {
       "version": "2026.01.13",  ← MUDE A VERSÃO
       "url": [...]
   }
   ```

---

## ✅ Checklist de Verificação

- [ ] `version.json` está com JSON válido
- [ ] A versão é **DIFERENTE** da anterior (para forçar update)
- [ ] Os arquivos `.zip` estão em **todas** as URLs listadas
- [ ] Teste acessar cada URL diretamente no navegador

---

## 🔍 Comportamento do Launcher

1. Busca `version.json` (tenta principal, depois fallback)
2. Compara versões locais vs remotas
3. Para cada recurso desatualizado:
   - Tenta baixar da primeira URL
   - Se falhar, tenta a próxima URL do array
   - Continua até sucesso ou todas falharem
4. Extrai e atualiza
5. Continua com o lançamento do jogo

---

## 🛠️ Troubleshooting

### "Update failed" / Download falhou
- Verifique se o arquivo existe em **pelo menos uma** das URLs
- Teste cada URL no navegador

### "Versão não atualiza"
- A versão local já é igual à remota
- Mude a string de versão no `version.json`

### "Arquivo corrompido"
- O .zip pode estar incompleto
- Regenere e faça upload novamente
