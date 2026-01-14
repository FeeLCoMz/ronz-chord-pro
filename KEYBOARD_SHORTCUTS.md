# Keyboard Shortcuts Guide

RoNz Chord Pro includes powerful keyboard shortcuts to enhance navigation and performance. Press `?` (or `Shift + ?`) at any time to view all available shortcuts.

## Navigation Shortcuts

| Shortcut          | Action        | Context                                              |
| ----------------- | ------------- | ---------------------------------------------------- |
| `Ctrl/Cmd + F`    | Focus Search  | Quickly search for songs by title, artist, or lyrics |
| `→` (Right Arrow) | Next Song     | Jump to the next song in current view                |
| `←` (Left Arrow)  | Previous Song | Jump to the previous song in current view            |

## Performance Mode

| Shortcut    | Action                  | Context                                         |
| ----------- | ----------------------- | ----------------------------------------------- |
| `Shift + P` | Toggle Performance Mode | Full-screen chord display for live performances |

## Display Controls

| Shortcut | Action             | Context                                            |
| -------- | ------------------ | -------------------------------------------------- |
| `T`      | Toggle Transpose   | Switch transpose mode on/off for quick key changes |
| `M`      | Toggle Lyrics Mode | Switch between compact and lyrics-focused view     |
| `Y`      | Toggle YouTube     | Show/hide YouTube video panel                      |
| `A`      | Toggle Auto-Scroll | Enable/disable automatic scrolling                 |

## Help & Information

| Shortcut | Action                  | Context                 |
| -------- | ----------------------- | ----------------------- |
| `?`      | Show Keyboard Shortcuts | Display this help modal |

## Tips for Using Shortcuts

### Input Field Safety

Keyboard shortcuts are **automatically disabled** when you're typing in search boxes or form fields. You can safely type special characters like `?` without triggering shortcuts.

### Performance Mode

When in Performance Mode (full-screen display):

- Keyboard shortcuts are still active for navigation
- Use `Shift + P` to exit performance mode
- Theme cycling and font size controls are available

### Mobile & Touch Devices

While keyboard shortcuts are optimized for desktop, mobile devices can:

- Use on-screen buttons for all functions
- Connect external keyboard for shortcut support
- Tap the ⌨️ Shortcuts button to view all available actions

## Customization

The keyboard shortcuts system is built with extensibility in mind:

- New shortcuts can be added via the `useKeyboardShortcuts` hook
- Shortcuts are centralized in `src/hooks/useKeyboardShortcuts.js`
- Each shortcut maps to app actions (state changes, navigation, etc.)

## Browser Compatibility

| Browser         | Support                                             |
| --------------- | --------------------------------------------------- |
| Chrome/Edge     | ✅ Full support                                     |
| Firefox         | ✅ Full support                                     |
| Safari          | ✅ Full support                                     |
| Mobile Browsers | ⚠️ Limited (no Ctrl/Cmd+key, some single keys work) |

## Future Enhancements

Planned keyboard shortcut improvements:

- [ ] Customizable keybinds
- [ ] Keyboard shortcut recording/macro system
- [ ] Context-aware shortcuts (different in setlist vs. song view)
- [ ] Accessibility: Screen reader announcements for shortcuts
- [ ] Documentation: Interactive tutorial for new users

## Troubleshooting

### Shortcuts Not Working?

1. **Check input focus**: Make sure you're not typing in a form field
2. **Browser conflicts**: Some browser extensions override keyboard events
3. **Performance mode**: Keyboard shortcuts work differently in full-screen mode
4. **Try full keyboard**: Some keys may not work on non-QWERTY keyboards

### Conflict with Browser Shortcuts

If a shortcut conflicts with your browser's shortcuts:

- The browser shortcut typically takes priority
- Try mapping to different keys in app settings (when customization is added)
- Report conflicts so we can find better default mappings

---

**Last Updated**: January 2025
**Hook Reference**: `src/hooks/useKeyboardShortcuts.js`
**Component Reference**: `src/components/KeyboardShortcutsHelp.jsx`
