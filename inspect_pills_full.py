# -*- coding: utf-8 -*-
with open('menu.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('<!-- Category Filter Pills -->')
print(text[idx:idx+1200])
