module.exports = {
  env: {
    test: {
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
      ],
    },
    build: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            loose: true,
          },
        ],
      ],
    },
  },
};
