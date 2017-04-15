# atomic-lint-loader
A linter for Atomic Jolt that lints files changed and integrates with the webpack build process

### Usage
`yarn add -dev atomic-lint-loader` or `npm install --save-dev atomic-lint-loader`
Add atomic-lint-loader as a loader to your `.js` and `.jsx` files in your webpack config.
Make sure to add it so that it runs before babel! (Webpack runs loaders from right to left)
