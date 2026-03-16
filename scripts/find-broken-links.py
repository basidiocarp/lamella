#!/usr/bin/env python3
"""Find broken markdown references in the skills directory."""

import re
from pathlib import Path

def find_broken_links():
    skills_dir = Path(__file__).parent.parent / 'skills'
    broken_refs = []

    # Find all markdown files
    md_files = list(skills_dir.rglob('*.md'))

    for md_file in md_files:
        try:
            content = md_file.read_text()
        except Exception:
            continue

        # Remove code blocks (fenced and inline) to avoid false positives
        # Remove fenced code blocks first
        content_no_code = re.sub(r'```[\s\S]*?```', '', content)
        # Remove inline code
        content_no_code = re.sub(r'`[^`]+`', '', content_no_code)

        # Find markdown links: [text](path.md) or [text](./path.md)
        links = re.findall(r'\[([^\]]*)\]\(([^)]+\.md[^)]*)\)', content_no_code)

        for link_text, link_path in links:
            # Skip external URLs
            if link_path.startswith('http'):
                continue

            # Clean up the path (remove anchors like #section)
            clean_path = link_path.split('#')[0]
            if not clean_path:
                continue

            # Resolve relative to the markdown file's directory
            if clean_path.startswith('/'):
                target = Path(clean_path)
            else:
                target = md_file.parent / clean_path

            # Check if target exists
            try:
                target = target.resolve()
                if not target.exists():
                    broken_refs.append((str(md_file), link_path))
            except Exception:
                broken_refs.append((str(md_file), link_path))

    return broken_refs

if __name__ == '__main__':
    broken = find_broken_links()
    print(f'Found {len(broken)} broken references:\n')
    for src, link in broken:
        # Make paths relative
        src = src.replace(str(Path(__file__).parent.parent) + '/', '')
        print(f'{src}')
        print(f'  -> {link}')
        print()
