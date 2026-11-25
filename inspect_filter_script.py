# -*- coding: utf-8 -*-
with open('menu.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('dietary-tag-btn')
idx2 = text.find('</script>', idx)
print(text[idx-100:idx+1500])
