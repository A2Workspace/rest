module.exports = {
  env: {
    test: {
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
        // '@babel/plugin-transform-typescript',
      ],
      // presets: ['@babel/preset-env'],
    },
    build: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: 'commonjs',
            // loose: true,
          },
        ],
      ],
    },
  },
};
