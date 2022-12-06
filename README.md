# zora-gallery-next

This project is a demo of displaying an Ethereum wallet's NFT balance in a gallery style UI, with data returned from [Zora](https://zora.co).

We use Next.js and a custom server on the backend using Express.js.

## Getting Started

Install dependencies:

```bash
npm install
# or
yarn install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

## Linting / Code Style

Code style is maintained by ESLint & Prettier, see the respective configs in `.eslintrc.json` & `.prettierrc.json`

Husky is used to run a pre-commit script to validate.

Run linter manually with:

```bash
npm run lint
# or
yarn lint
```

## TODO

- Productionize
- Tests
- Continue componentizing frontend
- Hot reload dev config w/ Next.js custom server (detect frontend and backend changes?)
- Resolve issues with Zora API & bad pagination in certain cases
