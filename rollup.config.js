import { babel } from '@rollup/plugin-babel';

export const config = {
  input: 'src/index.js',
  output: {
    file: 'dist/index.cjs.js',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    babel({
      exclude: '**/node_modules/**',
    }),
  ],
  external: ['axios'],
};

export default config;
