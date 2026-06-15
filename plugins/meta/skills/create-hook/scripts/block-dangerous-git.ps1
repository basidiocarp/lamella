$raw = [Console]::In.ReadToEnd()

if ([string]::IsNullOrWhiteSpace($raw)) {
  exit 0
}

$payload = $raw | ConvertFrom-Json
$command = [string]$payload.tool_input.command
$normalized = ($command -replace "\s+", " ").Trim()

if ([string]::IsNullOrWhiteSpace($normalized)) {
  exit 0
}

$patterns = @(
  '^git push(\s|$)',
  '^git reset --hard(\s|$)',
  '^git clean -f(d)?(\s|$)',
  '^git branch -D(\s|$)',
  '^git checkout \.(\s|$)',
  '^git restore(\s+--staged)?(\s+--worktree)?\s+\.(\s|$)'
)

foreach ($pattern in $patterns) {
  if ($normalized -match $pattern) {
    [Console]::Error.WriteLine("Blocked dangerous git command: $command")
    exit 2
  }
}

exit 0
