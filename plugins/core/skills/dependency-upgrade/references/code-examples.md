# Dependency Upgrade Code Examples

## Compatibility Matrix

```javascript
const compatibilityMatrix = {
  react: {
    "16.x": {
      "react-dom": "^16.0.0",
      "react-router-dom": "^5.0.0",
    },
    "18.x": {
      "react-dom": "^18.0.0",
      "react-router-dom": "^6.0.0",
    },
  },
};
```

## Codemod for Automated Fixes

```bash
npx jscodeshift -t <transform-url> <path>
npx jscodeshift -t <transform-url> --parser=tsx src/
npx jscodeshift -t <transform-url> --dry src/
```

## Custom Migration Script

```javascript
const fs = require("fs");
const glob = require("glob");

glob("src/**/*.tsx", (err, files) => {
  files.forEach((file) => {
    let content = fs.readFileSync(file, "utf8");
    content = content.replace(/oldAPI/g, "newAPI");
    fs.writeFileSync(file, content);
  });
});
```

## Rollback Script

```bash
git stash
git checkout -b upgrade-branch
npm install package@latest
if npm run test; then
  git add package.json package-lock.json
  git commit -m "chore: upgrade package"
else
  git checkout main
  git branch -D upgrade-branch
  npm install
fi
```
