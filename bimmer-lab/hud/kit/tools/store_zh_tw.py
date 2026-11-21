#!/usr/bin/env python3
"""Build the fixed zh-TW HUD Widgets package with the numeric Store version.

This is a source-package entry, not an update-persistence agent. The head-unit updater supplies its own SDK
before it invokes this script; nothing here talks to a vehicle.
"""
import hashlib
from pathlib import Path
import sys

TOOLS = Path(__file__).resolve().parent
EXPECTED = {
    'build.py': '93aa41146a68927a1cb526acc186238db4708a7abb0a61762b091d12ca42573a',
    'localize.py': '96bbaf50d8c34448f90f06c9ab9ddf143affed1ad941dbbd83eac4073dcdd2dd',
}


def main():
    args = sys.argv[1:]
    if args != ['idrive_hud_widgets', '--language', 'zh-TW']:
        raise SystemExit('This package builds only idrive_hud_widgets --language zh-TW; no language fallback.')
    for name, digest in EXPECTED.items():
        if hashlib.sha256((TOOLS / name).read_bytes()).hexdigest() != digest:
            raise SystemExit('Builder compatibility check failed (' + name + '); rebuild the source package.')
    if not (TOOLS.parent / 'runtime/locales/zh-TW.json').is_file():
        raise SystemExit('Traditional-Chinese catalog is missing; no language fallback.')
    sys.path.insert(0, str(TOOLS))
    import localize
    original = localize.package_version
    localize.package_version = lambda version, language: version if language == 'zh-TW' else original(version, language)
    import build
    print('HUD Widgets: 繁體中文 / zh-TW; source package; SDK supplied by the head-unit updater', flush=True)
    build.main()


if __name__ == '__main__':
    main()
