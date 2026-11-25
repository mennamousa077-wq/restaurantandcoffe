# -*- coding: utf-8 -*-
with open('menu.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('<main')
idx2 = text.find('</main>')
print("Main content length:", idx2 - idx)
# Find the sections inside main
import re
sections = re.findall(r'<section[^>]*>.*?</section>', text[idx:idx2], re.DOTALL)
print("Sections in main:", len(sections))
for i, s in enumerate(sections[:6]):
    m = re.search(r'<h[1-4][^>]*>(.*?)</h[1-4]>', s)
    h = m.group(1) if m else "No header"
    print(f"Section {i+1}: length {len(s)} | Header: {h[:60]}")
