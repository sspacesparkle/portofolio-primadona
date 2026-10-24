"""Run against npm run dev: python3 tests/browser-smoke.py (requires Playwright)."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

origin = os.environ.get('PORTFOLIO_TEST_URL', 'http://localhost:3000').rstrip('/')
projects = json.loads((Path(__file__).parents[1] / 'app/project-data.json').read_text())


def current_frame(page):
    return page.frames[-1]


def ready(page, desktop=False):
    frame = current_frame(page)
    frame.wait_for_function("typeof updateVisibleMedia === 'function'")
    if desktop:
        frame.wait_for_function("!document.querySelector('.loader') || getComputedStyle(document.querySelector('.loader')).pointerEvents === 'none'")
    return frame


with sync_playwright() as runtime:
    browser = runtime.chromium.launch()
    failures = []
    for width, height in [(390, 844), (1440, 900)]:
        context = browser.new_context(viewport={'width': width, 'height': height},
                                      is_mobile=width < 992, has_touch=width < 992)
        page = context.new_page()
        page.on('pageerror', lambda error: failures.append(str(error)))
        page.on('response', lambda response: failures.append(f'{response.status} {response.url}')
                if response.status >= 400 else None)
        page.goto(origin + '/')
        frame = ready(page, width > 992)
        # Every preview has a source immediately, before a scroll transition reveals it.
        assert frame.locator('.home-projects-item video:not([poster])').count() == 0
        assert frame.locator('.home-projects-item img:not([src])').count() == 0
        frame.wait_for_function("[...document.querySelectorAll('.home-projects-item:first-child video')].every(v=>!!v.poster)")
        frame.evaluate('window.scrollTo(0,innerHeight*0.7)')
        page.wait_for_timeout(350)
        assert frame.evaluate("[...document.querySelectorAll('.home-projects-item video[src]')].length") <= 4
        frame.locator('.footer-links-flex.is-nav a[href="/work"]').click()
        page.wait_for_url(origin + '/work')
        frame = ready(page, width > 992)
        for label, expected in [('Quality Assurance', 1), ('Social Media Specialist', 14),
                                ('Content Creator', 14), ('All Work', 15)]:
            frame.locator('.filter-btn').filter(has_text=label).click()
            assert frame.locator('.work-grid-coll-item:visible').count() == expected
        frame.locator('.footer-links-flex.is-nav a[href="/"]').click()
        page.wait_for_url(origin + '/')
        ready(page, width > 992)
        page.go_back()
        page.wait_for_url(origin + '/work')
        ready(page, width > 992)
        page.go_back()
        page.wait_for_url(origin + '/')
        frame = ready(page, width > 992)
        if width > 992:
            page.set_viewport_size({'width': 390, 'height': 844})
            frame.wait_for_function("document.querySelectorAll('.home-projects-item').length === 15")
            assert frame.locator('.home-projects-item:visible').count() == 15
            assert frame.evaluate("[...document.querySelectorAll('.home-projects-item')].every(e=>getComputedStyle(e).visibility==='visible')")
            page.set_viewport_size({'width': 1440, 'height': 900})
            frame.wait_for_function("document.querySelectorAll('.home-projects-item').length === 16")
        else:
            for slug in list(projects) + ['info', 'contact']:
                route = '/' + slug if slug in ['info', 'contact'] else '/work/' + slug
                page.goto(origin + route)
                frame = ready(page)
                assert not frame.evaluate('document.documentElement.scrollWidth > innerWidth'), route
                assert not frame.evaluate('[...document.images].some(i=>i.complete&&!i.naturalWidth)'), route
            assert frame.locator('a[href="mailto:dedharyaa@gmail.com"]').count() >= 1
            toggle = frame.locator('.contact-sound-toggle').first
            toggle.click()
            frame.wait_for_function("!document.getElementById('contact-music').paused")
            toggle.click()
            frame.wait_for_function("document.getElementById('contact-music').paused")
        context.close()
    browser.close()
    assert not failures, failures
    print('PASS: 19 routes, all Work filters, Home/Back, responsive resizing, preview sources, email, music, and no asset/JavaScript errors')
