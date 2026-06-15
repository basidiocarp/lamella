# Plugins and Dependencies

Use this reference for optional feature groups and plugin loading.

## Optional Extras

```bash
pip install 'markitdown[pdf,docx,pptx]'
pip install 'markitdown[all]'
```

Common extras include:

- `pdf`
- `docx`
- `pptx`
- `xlsx`
- `az-doc-intel`
- `audio-transcription`
- `youtube-transcription`

## Plugins

```bash
markitdown --list-plugins
markitdown --use-plugins file.pdf -o output.md
```

Keep plugin usage deliberate. Do not enable third-party plugins by default in
automation unless you control the environment.
