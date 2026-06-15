# Screen Reader Commands Reference

Use this reference for basic manual testing across the common screen readers.
It is a quick operator cheat sheet, not a full product manual.

## NVDA (Windows)

Setup:
- start: `Ctrl + Alt + N`
- quit: `Insert + Q`
- modifier key: `Insert`

Useful commands:
- `Down Arrow` / `Up Arrow` to read next or previous line
- `H` / `Shift + H` to move by heading
- `K` / `Shift + K` to move by link
- `D` / `Shift + D` to move by landmark
- `F` / `Shift + F` to move by form field
- `NVDA + F7` for elements list
- `NVDA + Space` to switch browse and focus mode

## JAWS (Windows)

Setup:
- start via shortcut or `Ctrl + Alt + J`

Useful commands:
- arrow keys for reading and navigation
- `H` for headings
- `Tab` / `Shift + Tab` for form controls and links
- `Insert + F7` for links list
- `Insert + F6` for headings list
- table navigation with `Ctrl + Alt + Arrow`

## TalkBack (Android)

Setup:
- enable in Android accessibility settings
- common toggle: hold both volume buttons for 3 seconds

Useful gestures:
- swipe right / left for next or previous item
- double tap to activate
- drag finger to explore
- two-finger swipe to scroll
- rotor-style reading controls for headings, links, controls, words, and lines

## VoiceOver (macOS)

Setup:
- toggle: `Cmd + F5`
- modifier: `Ctrl + Option`

Useful commands:
- `VO + Right Arrow` / `VO + Left Arrow` for next or previous item
- `VO + U` for rotor
- `VO + Cmd + H` next heading
- `VO + Cmd + L` next link
- `VO + Cmd + J` next form control
- `VO + Space` activate current item

## What to Check

Use the commands above to verify:
- heading order makes sense
- landmarks are present and useful
- controls have usable names
- form errors and status updates are announced
- tables and complex widgets are navigable

If navigation is tedious or confusing with these basic commands, the UI probably
needs structural accessibility fixes.
