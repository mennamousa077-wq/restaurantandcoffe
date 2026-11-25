# -*- coding: utf-8 -*-
with open('menu.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
dishes = re.findall(r'<div class="dish-item[^"]*"[^>]*>.*?</div>\s*</div>', text, re.DOTALL)
print('dish-item count in menu.html:', len(dishes))
if len(dishes) == 0:
    # search other dish cards
    print("Searching other dish containers...")
    cards = re.findall(r'<article[^>]*>.*?</article>', text, re.DOTALL)
    print("article count:", len(cards))
    # let's find onclick="addToCart
    cart_calls = re.findall(r"addToCart\([^)]+\)", text)
    print("addToCart calls:", len(cart_calls))
    for c in cart_calls[:5]:
        print(" ", c)
