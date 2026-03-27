# Input Validation and XSS

Use this reference for payload validation and safe broadcasting.

## Schema Validation

```javascript
const Joi = require("joi");

const messageSchema = Joi.object({
  roomId: Joi.string().uuid().required(),
  text: Joi.string().min(1).max(1000).required(),
  mentions: Joi.array().items(Joi.string()).default([])
});

io.on("connection", (socket) => {
  socket.on("message", (payload) => {
    const { error, value } = messageSchema.validate(payload);
    if (error) {
      socket.emit("error", { code: "INVALID_MESSAGE", details: error.details });
      return;
    }

    io.to(value.roomId).emit("message", value);
  });
});
```

## Sanitization

```javascript
const sanitizeHtml = require("sanitize-html");

function sanitizeMessage(text) {
  return sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} });
}
```

## Rules

- validate before persistence or broadcast
- cap message size and field lengths
- strip or encode HTML if the client renders user text
- reject unknown event shapes instead of silently tolerating them
