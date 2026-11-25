# -*- coding: utf-8 -*-
with open('menu.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('<section')
idx_end = text.find('</section>', idx)
print(text[idx:idx_end+10])
