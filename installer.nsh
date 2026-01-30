!macro customInstallMode
  ; Add custom page for shortcut options
  !insertmacro MUI_PAGE_COMPONENTS
!macroend

!macro customHeader
  ; Custom section for Desktop shortcut
  Section "Desktop Shortcut" SEC_DESKTOP
    CreateShortCut "$DESKTOP\BlockyCRAFT Launcher.lnk" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  SectionEnd

  ; Custom section for Start Menu shortcut  
  Section "Start Menu Shortcut" SEC_STARTMENU
    CreateDirectory "$SMPROGRAMS\BlockyCRAFT"
    CreateShortCut "$SMPROGRAMS\BlockyCRAFT\BlockyCRAFT Launcher.lnk" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  SectionEnd

  ; Set sections as optional (unchecked by default is SectionSetFlags SEC_NAME 0)
  Function .onInit
    ; Make both checked by default but optional
    SectionSetFlags ${SEC_DESKTOP} 1
    SectionSetFlags ${SEC_STARTMENU} 1
  FunctionEnd
!macroend

!macro customUnInstall
  ; Clean up shortcuts on uninstall
  Delete "$DESKTOP\BlockyCRAFT Launcher.lnk"
  RMDir /r "$SMPROGRAMS\BlockyCRAFT"
!macroend
