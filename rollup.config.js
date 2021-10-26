import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

export const config = {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.min.js',
      format: 'cjs',
      plugins: [terser()],
    },
  ],
  plugins: [
    babel({
      exclude: '**/node_modules/**',
    }),
  ],
  external: ['axios'],
};

export default config;
