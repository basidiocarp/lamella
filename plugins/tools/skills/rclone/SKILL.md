---
name: rclone
description: "Uploads, syncs, and manages files across cloud storage providers with rclone."
origin: lamella
---

# rclone File Transfer Skill


## Contents

- [Setup Check (Always Run First)](#setup-check-always-run-first)
- [Common Operations](#common-operations)
- [Useful Flags](#useful-flags)
- [Large File Uploads](#large-file-uploads)
- [Verify Upload](#verify-upload)
- [Troubleshooting](#troubleshooting)

## Setup Check (Always Run First)

Before any rclone operation, verify installation and configuration.

Use the POSIX commands below on macOS and Linux. On Windows, use the PowerShell variant.

```sh
# Check Installation
command -v rclone >/dev/null 2>&1 && echo "rclone installed: $(rclone version | head -1)" || echo "NOT INSTALLED"

# List Configured Remotes
rclone listremotes 2>/dev/null || echo "NO REMOTES CONFIGURED"
```

```powershell
$cmd = Get-Command rclone -ErrorAction SilentlyContinue
if ($cmd) {
  rclone version | Select-Object -First 1
} else {
  Write-Output "NOT INSTALLED"
}

try {
  rclone listremotes
} catch {
  Write-Output "NO REMOTES CONFIGURED"
}
```

### If rclone is NOT installed

Guide the user to install. On Windows, prefer the installer from `rclone.org` or the user's package manager.

```bash
# Install on macOS
brew install rclone

# Install on Linux
curl https://rclone.org/install.sh | sudo bash

# Install With a Package Manager
sudo apt install rclone  # Debian/Ubuntu
sudo dnf install rclone  # Fedora
```

### If NO remotes are configured

Walk the user through interactive configuration:

```bash
rclone config
```

**Common provider setup quick reference:**

| Provider | Type | Key Settings |
|----------|------|--------------|
| AWS S3 | `s3` | access_key_id, secret_access_key, region |
| Cloudflare R2 | `s3` | access_key_id, secret_access_key, endpoint (account_id.r2.cloudflarestorage.com) |
| Backblaze B2 | `b2` | account (keyID), key (applicationKey) |
| DigitalOcean Spaces | `s3` | access_key_id, secret_access_key, endpoint (region.digitaloceanspaces.com) |
| Google Drive | `drive` | OAuth flow (opens browser) |
| Dropbox | `dropbox` | OAuth flow (opens browser) |

**Example: Configure Cloudflare R2**
```bash
rclone config create r2 s3 \
  provider=Cloudflare \
  access_key_id=YOUR_ACCESS_KEY \
  secret_access_key=YOUR_SECRET_KEY \
  endpoint=ACCOUNT_ID.r2.cloudflarestorage.com \
  acl=private
```

**Example: Configure AWS S3**
```bash
rclone config create aws s3 \
  provider=AWS \
  access_key_id=YOUR_ACCESS_KEY \
  secret_access_key=YOUR_SECRET_KEY \
  region=us-east-1
```

## Common Operations

### Upload single file
```bash
rclone copy /path/to/file.mp4 remote:bucket/path/ --progress
```

### Upload directory
```bash
rclone copy /path/to/folder remote:bucket/folder/ --progress
```

### Sync directory (mirror, deletes removed files)
```bash
rclone sync /local/path remote:bucket/path/ --progress
```

### List remote contents
```bash
rclone ls remote:bucket/
rclone lsd remote:bucket/  # directories only
```

### Check what would be transferred (dry run)
```bash
rclone copy /path remote:bucket/ --dry-run
```

## Useful Flags

| Flag | Purpose |
|------|---------|
| `--progress` | Show transfer progress |
| `--dry-run` | Preview without transferring |
| `-v` | Verbose output |
| `--transfers=N` | Parallel transfers (default 4) |
| `--bwlimit=RATE` | Bandwidth limit (e.g., `10M`) |
| `--checksum` | Compare by checksum, not size/time |
| `--exclude="*.tmp"` | Exclude patterns |
| `--include="*.mp4"` | Include only matching |
| `--min-size=SIZE` | Skip files smaller than SIZE |
| `--max-size=SIZE` | Skip files larger than SIZE |

## Large File Uploads

For videos and large files, use chunked uploads:

```bash
# Use Multipart Uploads
rclone copy large_video.mp4 remote:bucket/ --s3-chunk-size=64M --progress

# Resume Interrupted Transfers
rclone copy /path remote:bucket/ --progress --retries=5
```

## Verify Upload

```bash
# Verify File Contents
rclone check /local/file remote:bucket/file

# Show File Metadata
rclone lsl remote:bucket/path/to/file
```

## Troubleshooting

```bash
# Test the Connection
rclone lsd remote:

# Debug Connection Issues
rclone lsd remote: -vv

# Show Active Config
rclone config show remote
```

## Reference Files

- [Check Setup](scripts/check_setup.sh)
