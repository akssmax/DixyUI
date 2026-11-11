---
"@dixy-ui/themes": patch
---

Fix Candy Clay (and the other No-frame starters, such as Ocean Depths) growing cards and dialogs when an ornament renderer is passed anyway. These starters ship plain cards, so their stylesheet now takes any `.dixy-skin-ornament` out of flow and hides it. Previously `ClayOrnament`'s wrapper and canvas stayed `position: static` and added a canvas below the content, wider than the card on narrow screens (#24).
