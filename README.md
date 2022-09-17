# Pixel Peeps (working title)

## Running
1. Open `chrome://extensions/`
2. Enable developer mode (top right toggle)
3. Load unpacked (top left) and select this folder
4. Refresh or open a https url and it should be activated
5. To reload the extension after making changes, hit the reload button in `chrome://extensions/`

## Debugging
1. In `chrome://extensions/` you can view errors as they happen
2. Or you can print to console in .js and see it in the dev pane

## Known issues:
- Uncaught Error: Extension context invalidated.
  - Good luck solving this one. One easy workaround is to close the tab that's running the extension before reloading the extension. For forum hell that offers some wacky solutions, look [here](https://stackoverflow.com/questions/53939205/how-to-avoid-extension-context-invalidated-errors-when-messaging-after-an-exte)
- Character flickering
  - Probably due to the way they're being drawn, maybe there's a better way (caching?) than loading in each image every frame
