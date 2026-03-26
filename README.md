# Express + TypeScript - *(Backend Skeleton)*

Simple backend starter using **Express**, **TypeScript**, **ESLint**, and **Prettier**.

---

## Features

- **Express** server written in TypeScript
- **ts-node-dev** for auto‑reload during development
- **ESLint** for code quality
- **Prettier** for consistent formatting

---
</br>

## Additional information about dependencies

### Node modules package:
```
npm init -y
```

### Express:
```
npm install express
npm install -D typescript ts-node-dev @types/node @types/express
```
- Create **tsconfig.json**

### Prettier:
```
npm install -D prettier 
```
- Create **.prettierrc**

### ESLint
```
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D jiti
npx eslint --init
```
- Use ESLint with **Strict** | **Medium** | **Loose** rules
- Create **.eslintrc.json**
- Optional **VS Code** lint‑on‑save setup. Create **.vscode** folder and **settings.json**
- Add **exclude** list to **tsconfig.json** 