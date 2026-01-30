!macro customInit
  ; Nothing needed here
!macroend

!macro customInstall
  ; Create optional shortcuts with user prompts
  MessageBox MB_YESNO "Create Desktop shortcut?" IDNO skip_desktop
    CreateShortCut "$DESKTOP\BlockyCRAFT Launcher.lnk" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  skip_desktop:
  
  MessageBox MB_YESNO "Create Start Menu shortcut?" IDNO skip_startmenu
    CreateDirectory "$SMPROGRAMS\BlockyCRAFT"
    CreateShortCut "$SMPROGRAMS\BlockyCRAFT\BlockyCRAFT Launcher.lnk" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  skip_startmenu:
!macroend

!macro customUnInstall
  ; Clean up shortcuts on uninstall
  Delete "$DESKTOP\BlockyCRAFT Launcher.lnk"
  RMDir /r "$SMPROGRAMS\BlockyCRAFT"
!macroend
