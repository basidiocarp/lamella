#!/usr/bin/env python3
"""
Sync plugin manifests with actual skill folders.
Updates manifests to match exactly what's in each category folder.
"""

import json
import os
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
SKILLS_DIR = BASE_DIR / "skills"
MANIFESTS_DIR = BASE_DIR / "plugin-manifests"

SKIP_MANIFESTS = {"schema.json", "index.json"}


def load_manifest(path: Path) -> dict:
    with open(path) as f:
        return json.load(f)


def save_manifest(path: Path, data: dict):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
        f.write("\n")


def get_skills_in_folder(category: str) -> list[str]:
    """Get list of skill directories in a category folder."""
    category_dir = SKILLS_DIR / category
    if not category_dir.exists():
        return []

    skills = []
    for item in sorted(category_dir.iterdir()):
        if item.is_dir() and not item.name.startswith("."):
            # Check it has a SKILL.md (valid skill)
            if (item / "SKILL.md").exists():
                skills.append(f"{category}/{item.name}")
    return skills


def sync_manifest(manifest_path: Path):
    """Sync a manifest's skills array with actual folder contents."""
    manifest = load_manifest(manifest_path)
    category = manifest.get("name")

    if not category:
        print(f"  Skipped: {manifest_path.name} (no name field)")
        return

    # Get actual skills in folder
    actual_skills = get_skills_in_folder(category)

    # Get current skills from manifest
    current_skills = manifest.get("resources", {}).get("skills", [])

    if set(actual_skills) == set(current_skills):
        print(f"  {category}: No changes needed ({len(actual_skills)} skills)")
        return

    # Calculate diff
    added = set(actual_skills) - set(current_skills)
    removed = set(current_skills) - set(actual_skills)

    # Update manifest
    if "resources" not in manifest:
        manifest["resources"] = {}
    manifest["resources"]["skills"] = actual_skills

    save_manifest(manifest_path, manifest)

    print(f"  {category}: Updated ({len(actual_skills)} skills)")
    if added:
        print(f"    + Added: {len(added)} skills")
        for s in sorted(added)[:5]:
            print(f"      + {s}")
        if len(added) > 5:
            print(f"      ... and {len(added) - 5} more")
    if removed:
        print(f"    - Removed: {len(removed)} (not in folder)")
        for s in sorted(removed)[:5]:
            print(f"      - {s}")
        if len(removed) > 5:
            print(f"      ... and {len(removed) - 5} more")


def update_index():
    """Update index.json with current stats."""
    index_path = MANIFESTS_DIR / "index.json"
    if not index_path.exists():
        return

    index = load_manifest(index_path)

    total_skills = 0
    plugins = []

    for manifest_path in sorted(MANIFESTS_DIR.glob("*.json")):
        if manifest_path.name in SKIP_MANIFESTS:
            continue

        manifest = load_manifest(manifest_path)
        skill_count = len(manifest.get("resources", {}).get("skills", []))
        total_skills += skill_count

        # Update or add plugin entry
        found = False
        for p in index.get("plugins", []):
            if p.get("name") == manifest.get("name"):
                p["skills"] = skill_count
                p["version"] = manifest.get("version", "1.0.0")
                p["description"] = manifest.get("description", "")
                found = True
                break

        if not found:
            plugins.append({
                "name": manifest.get("name"),
                "version": manifest.get("version", "1.0.0"),
                "skills": skill_count,
                "description": manifest.get("description", ""),
                "tags": manifest.get("tags", []),
                "manifest": manifest_path.name
            })

    # Merge new plugins
    existing_names = {p.get("name") for p in index.get("plugins", [])}
    for p in plugins:
        if p["name"] not in existing_names:
            index.setdefault("plugins", []).append(p)

    index["stats"]["totalSkills"] = total_skills
    index["stats"]["totalPlugins"] = len([p for p in MANIFESTS_DIR.glob("*.json") if p.name not in SKIP_MANIFESTS])

    save_manifest(index_path, index)
    print(f"\n  index.json updated: {total_skills} total skills, {index['stats']['totalPlugins']} plugins")


def main():
    print("=" * 60)
    print("Syncing Plugin Manifests with Skill Folders")
    print("=" * 60)

    print("\nSyncing manifests...")
    for manifest_path in sorted(MANIFESTS_DIR.glob("*.json")):
        if manifest_path.name in SKIP_MANIFESTS:
            continue
        sync_manifest(manifest_path)

    print("\nUpdating index...")
    update_index()

    print("\n" + "=" * 60)
    print("Sync complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
