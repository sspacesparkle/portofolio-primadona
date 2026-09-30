#!/usr/bin/env python3
"""Render all Coarse & Fine photos in compact, editable collage frames."""

from html import escape
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "public/work-coarse-and-fine-reference.html"
IMAGE_DIR = ROOT / "public/assets/projects/01-coarse-and-fine/images"
IMAGE_BASE = "/assets/projects/01-coarse-and-fine/images/"
VIDEO_BASE = "/assets/projects/01-coarse-and-fine/videos/"

GROUPS = [
    [("cover.webp", "Coarse & Fine cafe"), ("coffee-cups.webp", "Coarse & Fine coffee cups"), ("coffee-refreshing.webp", "Coffee and refreshing drinks"), ("gallery-coffee-refreshing.webp", "Coffee and refreshing drink detail")],
    [("roastery-interior.webp", "Coarse & Fine roastery interior"), ("barista.webp", "Barista at Coarse & Fine"), ("manual-brew.webp", "Manual brew coffee"), ("gallery-cupping.webp", "Coffee cupping")],
    [("ubud-ambience.webp", "Coarse & Fine Ubud atmosphere"), ("gallery-night-3.webp", "Cafe at night"), ("gallery-night-8.webp", "Night atmosphere"), ("gallery-ubud-product-21.webp", "Ubud ambience and product")],
    [("gallery-ubud-product.webp", "Ubud product detail"), ("gallery-coffee-split.webp", "Coffee detail"), ("gallery-ubud-drink.webp", "Drink at Coarse & Fine Ubud"), ("gallery-cascade-dates.webp", "Food and drinks")],
    [("food-product.webp", "Coarse & Fine food"), ("tiramisu.webp", "Tiramisu"), ("gallery-beef-quesadilla.webp", "Beef quesadilla"), ("gallery-salad.webp", "Salad")],
    [("kitchen-team.webp", "Kitchen team"), ("gallery-staff-ubud.webp", "Ubud staff"), ("gallery-cafe-team.webp", "Cafe team"), ("gallery-eats-food.webp", "Dining moment")],
    [("ubud-content.webp", "Coarse & Fine Ubud content"), ("gallery-ubud-content-33.webp", "Ubud atmosphere"), ("gallery-roastery-0306.webp", "Roastery photograph"), ("gallery-roastery-0331.webp", "Roastery photograph")],
    [("gallery-pizza-party-126.webp", "Pizza party"), ("gallery-pizza-party-145.webp", "Pizza party moment"), ("gallery-pizza-eating-12.webp", "Pizza dining"), ("gallery-pizza-eating-14.webp", "Pizza served")],
    [("merch.webp", "Coarse & Fine merchandise"), ("daily-roastery.webp", "Daily roastery moment"), ("gallery-anniversary-merch.webp", "Anniversary merchandise")],
]


def video_frame(name: str) -> str:
    return (
        '<div role="listitem" class="w-dyn-item"><div class="cs-section"><div class="featured-video-ratio">'
        '<div class="g_visual_wrap u-cover-absolute"><div class="g_visual_background u-cover-absolute"></div>'
        f'<video data-src="{VIDEO_BASE}{name}" autoplay=" " loop="" muted="" playsinline=" " '
        'class="g_visual_video u-cover-absolute"></video></div></div></div>'
        '<div class="cs-swiper"></div><div class="w-embed"><div data-video-controls="true"></div></div></div>'
    )


def collage_frame(group: list[tuple[str, str]], index: int) -> str:
    kind = ' is-trio' if len(group) == 3 else ' is-mixed' if index in (6, 7) else ''
    photos = ''.join(
        f'<a href="{IMAGE_BASE}{name}" target="_blank" rel="noopener" aria-label="Open full photo: {escape(alt, quote=True)}">'
        f'<img src="{IMAGE_BASE}{name}" loading="lazy" alt="{escape(alt, quote=True)}"/></a>'
        for name, alt in group
    )
    return (
        '<div role="listitem" class="w-dyn-item cnf-collage-item">'
        f'<div class="cs-section cnf-collage-section"><div class="cnf-collage{kind}">{photos}</div></div></div>'
    )


def main() -> None:
    names = [name for group in GROUPS for name, _ in group]
    assert [len(group) for group in GROUPS] == [4] * 8 + [3]
    assert len(names) == len(set(names)) == 35
    assert all((IMAGE_DIR / name).is_file() for name in names)

    frames = [video_frame('ubud-campaign.mp4')]
    for index, group in enumerate(GROUPS):
        if index == 6:
            frames.append(video_frame('valentine-campaign.mp4'))
        frames.append(collage_frame(group, index))

    content = PAGE.read_text()
    start_marker = '<div id="w-node-_8af7f211-4079-ff57-76e9-9e9195109780-5934a292" class="project-visuals-flex u-column-4">'
    start = content.index(start_marker)
    end = content.index('</section><section>', start)
    gallery = start_marker + '<div class="w-dyn-list"><div role="list" class="w-dyn-items">' + ''.join(frames) + '</div></div></div>'
    content = content[:start] + gallery + '</div></div></div>' + content[end:]

    stylesheet = '<link rel="stylesheet" href="/coarse-fine-collage.css"/>'
    if stylesheet not in content:
        content = content.replace('<head>', '<head>' + stylesheet, 1)
    PAGE.write_text(content)
    print('Project 01 gallery: 35 photos in 9 collage frames, plus 2 videos.')


if __name__ == '__main__':
    main()
