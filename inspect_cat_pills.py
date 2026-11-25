# -*- coding: utf-8 -*-
with open('menu.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('<!-- Category Pills Bar -->')
if idx == -1:
    idx = text.find('class="category-nav-link')
print(text[idx-100:idx+800])
