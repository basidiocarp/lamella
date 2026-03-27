# Tracked Changes and Comments

Use this reference for tracked edit rules, comment handling, and rejection
flows.

## Non-Negotiable Rules

- mark only changed text, not surrounding unchanged text
- keep `<w:ins>` and `<w:del>` at paragraph level around full runs
- never directly rewrite another author's inserted or deleted content
- use nested deletions when rejecting someone else's insertion

## Insertion Pattern

```xml
<w:ins w:id="1" w:author="Scientific-Writer">
  <w:r>
    <w:t>inserted text</w:t>
  </w:r>
</w:ins>
```

## Deletion Pattern

```xml
<w:del w:id="2" w:author="Scientific-Writer">
  <w:r>
    <w:delText>deleted text</w:delText>
  </w:r>
</w:del>
```

## Reject Another Author's Insertion

```xml
<w:ins w:author="Jane Smith" w:id="16">
  <w:del w:author="Scientific-Writer" w:id="40">
    <w:r><w:delText>monthly</w:delText></w:r>
  </w:del>
</w:ins>
<w:ins w:author="Scientific-Writer" w:id="41">
  <w:r><w:t>weekly</w:t></w:r>
</w:ins>
```

## Comments

```python
start_node = doc["word/document.xml"].get_node(tag="w:del", attrs={"w:id": "1"})
end_node = doc["word/document.xml"].get_node(tag="w:ins", attrs={"w:id": "2"})
doc.add_comment(start=start_node, end=end_node, text="Explain this change")
doc.reply_to_comment(parent_comment_id=0, text="Acknowledged")
```

## Helper Methods

- reject insertion: `revert_insertion()`
- restore deletion: `revert_deletion()`
- remove regular untracked content: `suggest_deletion()`

Use the method that matches the original content state. That keeps the document
valid and makes reviewer intent obvious.
