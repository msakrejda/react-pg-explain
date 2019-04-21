module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-react',
  ],
  env: {
    test: {
      plugins: [ 'require-context-hook' ]
    }
  }
}
