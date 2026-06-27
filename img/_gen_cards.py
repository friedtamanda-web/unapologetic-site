#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

W=H=1080
BOLD="/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
REG="/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
ITAL="/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf"
GLYPH="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

def grad(top,bot):
    img=Image.new("RGB",(W,H),top)
    d=ImageDraw.Draw(img)
    for y in range(H):
        t=y/H
        c=tuple(int(top[i]+(bot[i]-top[i])*t) for i in range(3))
        d.line([(0,y),(W,y)],fill=c)
    return img

def fit(draw,text,fontpath,maxw,start,mins):
    size=start
    while size>=mins:
        f=ImageFont.truetype(fontpath,size)
        words=text.split()
        lines=[]; cur=""
        for w in words:
            t=(cur+" "+w).strip()
            if draw.textlength(t,font=f)<=maxw: cur=t
            else:
                if cur: lines.append(cur)
                cur=w
        if cur: lines.append(cur)
        # check max line width
        if all(draw.textlength(l,font=f)<=maxw for l in lines):
            return f,lines,size
        size-=2
    return f,lines,size

def card(text, path):
    img=grad((233,56,123),(193,24,92))   # brand pink -> deep magenta
    d=ImageDraw.Draw(img,"RGBA")
    M=110
    # eyebrow
    eb=ImageFont.truetype(REG,26)
    ebt="THE UNAPOLOGETIC LEADER"
    sp="".join(ch+" " for ch in ebt)  # light letterspacing
    d.text((M,96), "LINES TO CARRY", font=ImageFont.truetype(REG,26), fill=(255,255,255,200))
    # headline (uppercase), auto-fit
    up=text.upper()
    f,lines,size=fit(d,up,BOLD,W-2*M,118,54)
    lh=int(size*1.08)
    block=lh*len(lines)
    y=(H-block)//2 - 20
    for ln in lines:
        w=d.textlength(ln,font=f)
        d.text(((W-w)/2, y), ln, font=f, fill=(255,255,255,255))
        y+=lh
    # accent rule (pink-light) under the block
    ry=y+18
    d.line([((W-120)/2,ry),((W+120)/2,ry)], fill=(255,255,255,150), width=4)
    # heart glyph
    hg=ImageFont.truetype(GLYPH,46)
    hw=d.textlength("♥",font=hg)
    d.text(((W-hw)/2, ry+34), "♥", font=hg, fill=(255,255,255,205))
    # stars bottom-right doodle
    sg=ImageFont.truetype(GLYPH,40)
    d.text((W-150, H-150), "✦", font=sg, fill=(255,255,255,150))
    d.text((W-110, H-115), "✦", font=sg, fill=(255,255,255,110))
    # handle footer
    hf=ImageFont.truetype(BOLD,30)
    handle="@unapologetic_leader"
    d.text((M, H-92), handle, font=hf, fill=(255,255,255,235))
    img.save(path,"PNG")

LINES={
"set-free":"Sometimes things must be set free to fall into place.",
"rest-is-integrity":"Rest is integrity for yourself.",
"let-the-circus-be-theirs":"Let other people's circus be theirs.",
"i-am-the-pilot":"I am the pilot. I trust me more than anything.",
"loving-me-first":"I can be proud of me for loving me first.",
"nothing-meant-to-be-mine":"There is nothing I can lose that was meant to be mine.",
"content-built-empires":"Content built empires.",
"a-purpose-everywhere":"I have a purpose everywhere.",
"too-much-love":"There's no such thing as too much love.",
"be-the-lighthouse":"Be the lighthouse.",
"exactly-where-you-need-to-be":"You are exactly where you need to be.",
"the-light-never-moved":"The light never moved. You just needed time to see it again.",
}
import sys
if len(sys.argv)>1 and sys.argv[1]=="one":
    card(LINES["be-the-lighthouse"],"_preview_card.png"); print("preview made")
else:
    for slug,t in LINES.items():
        card(t, f"card-{slug}.png")
    print("generated", len(LINES), "branded cards")
