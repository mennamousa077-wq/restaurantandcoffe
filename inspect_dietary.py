# -*- coding: utf-8 -*-
with open('menu.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('<!-- Dietary Toggles -->')
print(text[idx:idx+1200])
