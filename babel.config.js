module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        "targets": "> 0.25%, not dead",
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
