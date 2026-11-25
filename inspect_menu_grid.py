# -*- coding: utf-8 -*-
with open('menu.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx_start = text.find('<!-- Interactive Category Filter Chips Bar -->')
if idx_start == -1:
    idx_start = text.find('id="menu-category-tabs"')
if idx_start == -1:
    idx_start = text.find('<main')

print("Starting around main:")
print(text[idx_start:idx_start+800])
