# -*- coding: utf-8 -*-
with open('menu.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('data-tag-value="halal"')
print(text[idx:idx+800])
