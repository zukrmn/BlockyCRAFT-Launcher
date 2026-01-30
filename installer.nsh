; Language detection and localized messages for BlockyCRAFT Launcher installer

!macro customInit
  ; Nothing needed here
!macroend

!macro customInstall
  ; Detect Windows language
  ; Portuguese (Brazil) = 1046, Portuguese (Portugal) = 2070
  ; Spanish = 1034, 2058, 3082, etc.
  ; English = 1033
  
  System::Call 'kernel32::GetUserDefaultUILanguage() i .r0'
  
  ; Check for Portuguese (1046 = pt-BR, 2070 = pt-PT)
  IntCmp $0 1046 portuguese_desktop
  IntCmp $0 2070 portuguese_desktop
  
  ; Check for Spanish variants (1034 = es-ES, 2058 = es-MX, 3082 = es-ES traditional)
  IntCmp $0 1034 spanish_desktop
  IntCmp $0 2058 spanish_desktop
  IntCmp $0 3082 spanish_desktop
  
  ; Default to English
  Goto english_desktop

  portuguese_desktop:
    MessageBox MB_YESNO "Criar atalho na Área de Trabalho?" IDNO check_startmenu_pt
    CreateShortCut "$DESKTOP\BlockyCRAFT Launcher.lnk" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  check_startmenu_pt:
    MessageBox MB_YESNO "Criar atalho no Menu Iniciar?" IDNO done
    CreateDirectory "$SMPROGRAMS\BlockyCRAFT"
    CreateShortCut "$SMPROGRAMS\BlockyCRAFT\BlockyCRAFT Launcher.lnk" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
    Goto done

  spanish_desktop:
    MessageBox MB_YESNO "¿Crear acceso directo en el Escritorio?" IDNO check_startmenu_es
    CreateShortCut "$DESKTOP\BlockyCRAFT Launcher.lnk" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  check_startmenu_es:
    MessageBox MB_YESNO "¿Crear acceso directo en el Menú Inicio?" IDNO done
    CreateDirectory "$SMPROGRAMS\BlockyCRAFT"
    CreateShortCut "$SMPROGRAMS\BlockyCRAFT\BlockyCRAFT Launcher.lnk" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
    Goto done

  english_desktop:
    MessageBox MB_YESNO "Create Desktop shortcut?" IDNO check_startmenu_en
    CreateShortCut "$DESKTOP\BlockyCRAFT Launcher.lnk" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  check_startmenu_en:
    MessageBox MB_YESNO "Create Start Menu shortcut?" IDNO done
    CreateDirectory "$SMPROGRAMS\BlockyCRAFT"
    CreateShortCut "$SMPROGRAMS\BlockyCRAFT\BlockyCRAFT Launcher.lnk" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"

  done:
!macroend

!macro customUnInstall
  ; Clean up shortcuts on uninstall
  Delete "$DESKTOP\BlockyCRAFT Launcher.lnk"
  RMDir /r "$SMPROGRAMS\BlockyCRAFT"
!macroend
