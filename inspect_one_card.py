# -*- coding: utf-8 -*-
with open('menu.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('<article')
idx_end = text.find('</article>', idx)
print(text[idx:idx_end+10])
