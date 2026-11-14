Not everything in a video comes from a camera. Title cards, quote graphics, a "part 2 tomorrow" end screen: these are pictures you draw in code and then turn into a few seconds of video. Python's **Pillow** library is the tool, and you met it in the Python track when you made thumbnails. This time you'll draw text, and learn the one rule that matters for vertical video.

## A frame is an image

```python
from PIL import Image, ImageDraw, ImageFont

img = Image.new("RGB", (1080, 1920), (15, 15, 30))   # width, height, colour
draw = ImageDraw.Draw(img)
font = ImageFont.load_default(108)                   # 108 pixel text
draw.text((100, 400), "Hello", font=font, fill=(255, 255, 255))
img.save("card.png")
```

`1080 x 1920` is the standard 9:16 frame for Reels, Shorts and TikTok. `ImageFont.load_default(size)` gives you a built-in font at any size (Pillow 10.1 or newer). For your own brand font, use `ImageFont.truetype("Font.ttf", 108)` with a font file you have the right to use.

## Measuring text

To centre text or wrap it, you need its width:

```python
width = draw.textlength("Hello", font=font)
x = (1080 - width) / 2
```

Pillow doesn't wrap text for you. You do it by hand: add words to a line one at a time, and when the next word would push the line past the maximum width, start a new line. That's the classic **greedy wrap**. A single word wider than the whole line (a long URL) can't be split, so it just gets its own line.

## Safe zones

Phone apps lay their own interface over a vertical video: the account name and a progress bar near the top, and the caption, buttons and music title near the bottom. Text in those areas gets covered or looks cramped. The zone that's always clear is called the **safe zone**.

The exact numbers differ by app and change over time, so check each platform's current guide. As a working rule for 9:16, keep text out of roughly the top 13%, the bottom 20% and 6% on each side:

```
1080 x 1920  ->  left 65, top 250, right 1015, bottom 1536
```

Define the zone as fractions of the frame, not fixed pixels, so the same code works at 1080 x 1920 for publishing and 360 x 640 for quick tests. Always draw inside it.

## Frame to clip

ffmpeg can hold one image still for a few seconds:

```bash
ffmpeg -framerate 25 -loop 1 -i card.png -t 2 -pix_fmt yuv420p card.mp4
```

`-loop 1` repeats the single image, and `-t 2` stops after two seconds. `-pix_fmt yuv420p` makes the video play on phones and browsers. Next lesson you'll glue a card like this onto the front of a clip.

## Your turn

The font and the zone fractions are set up for you in `main.py`. Write:

1. `safe_box(width, height)` returns `(left, top, right, bottom)` in pixels.
2. `wrap_text(draw, text, font, max_width)` returns a list of lines.
3. `title_card(text, size, bg, fg)` draws the text centred, and wrapped, inside the safe box.
4. `card_to_clip(png, out, seconds)` makes the video from the image.

To look at your card, add `title_card("Cron jobs, explained").save("card.png")` at the bottom of `main.py`, run it, and open `card.png` in the Explorer.

> The checks find the text by comparing the card with a blank one, then measuring the box it covers. If your text creeps into a margin, you'll see exactly which edge.
