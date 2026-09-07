#!/usr/bin/env python3
import json
import re
import sys
from datetime import date, timedelta
from pathlib import Path


def fail(message):
    raise SystemExit(f"VALIDATION ERROR: {message}")


if len(sys.argv) != 2:
    fail("expected the source directory")

source = Path(sys.argv[1])
index = (source / "index.html").read_text(encoding="utf-8")
meals = (source / "meals.html").read_text(encoding="utf-8")
app = (source / "app.js").read_text(encoding="utf-8")
styles = (source / "styles.css").read_text(encoding="utf-8")
status = json.loads((source / "status.json").read_text(encoding="utf-8"))


def dated_cards(document):
    return re.findall(r'data-date="(\d{4}-\d{2}-\d{2})"', document)


index_dates = dated_cards(index)
meal_dates = dated_cards(meals)
if len(index_dates) != 7 or len(meal_dates) != 7:
    fail("both pages must contain exactly seven dated cards")
if index_dates != meal_dates:
    fail("event and meal pages do not cover the same dates")

parsed = [date.fromisoformat(value) for value in index_dates]
if parsed != [parsed[0] + timedelta(days=offset) for offset in range(7)]:
    fail("week dates are not seven contiguous days")
if parsed[0].weekday() != 0 or parsed[-1].weekday() != 6:
    fail("published range must run Monday through Sunday")
if status.get("week_start") != index_dates[0] or status.get("week_end") != index_dates[-1]:
    fail("status.json does not match the page dates")

for section in ("All week &amp; anytime", ">For Ronnie<", ">2026 horizon<", "Heads-up &amp; closures"):
    if section not in index:
        fail(f"missing required index section: {section}")

events = re.findall(r'<a class="event[\s\S]*?</a>', index)
if not events:
    fail("no dated event cards found")
for event in events:
    if not re.search(r'href="https://', event):
        fail("a dated event is missing a confirmed HTTPS source")
    if not re.search(r'<small>[^<]*(?:Free|\$)', event):
        fail("a dated event is missing a price label")
    if not re.search(r'<span>[^<]*(?:AM|PM|noon)', event):
        fail("a dated event is missing a time")

if meals.count("data-meal=") != 28:
    fail("meal plan must contain 28 checkable meal slots")

banned = ("thepla", "cabbage poha", "tomato toast", "tray roast")
for phrase in banned:
    if phrase in meals.lower():
        fail(f"unsupported or banned meal found: {phrase}")

recipe_keys = set(re.findall(r'data-recipe="([^"]+)"', meals))
for key in recipe_keys:
    declaration = rf"(?:^|\n)\s*(?:'{re.escape(key)}'|{re.escape(key)})\s*:\s*\{{"
    if not re.search(declaration, app):
        fail(f"missing recipe data for {key}")
if app.count("https://app.notion.com/p/") < len(recipe_keys):
    fail("one or more selected recipes is missing its original Notion URL")

if ".days,.meal-week{grid-template-columns:1fr}" not in styles:
    fail("mobile one-column grids are not protected")

print(
    f"Validated {index_dates[0]} to {index_dates[-1]}: "
    f"{len(events)} dated events, 28 meals, {len(recipe_keys)} Notion recipes."
)
