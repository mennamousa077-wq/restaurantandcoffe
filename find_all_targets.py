# -*- coding: utf-8 -*-
import glob, re

for fn in glob.glob('*.html'):
    with open(fn, 'r', encoding='utf-8') as f:
        text = f.read()
    
    for m in re.finditer(r'<a[^>]*data-path="qr-menu"[^>]*>.*?</a>', text, re.DOTALL):
        print(f"{fn} qr-menu: {m.group(0)}")
    
    for m in re.finditer(r'<a[^>]*data-path="terms-and-conditions"[^>]*>.*?</a>', text, re.DOTALL):
        print(f"{fn} terms: {m.group(0)}")
