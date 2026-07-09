import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/deck-card.ts',
  output: {
    file: 'dist/deck-card.js',
    format: 'es',
    sourcemap: false,
  },
  plugins: [
    nodeResolve(),
    typescript(),
    terser({ format: { comments: false } }),
  ],
};
