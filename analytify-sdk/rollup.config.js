import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/analytify-sdk.cjs.js',
      format: 'cjs',
      exports: 'named'
    },
    {
      file: 'dist/analytify-sdk.esm.js',
      format: 'esm'
    },
    {
      file: 'dist/analytify-sdk.umd.js',
      format: 'umd',
      name: 'AnalytifySDK',
      exports: 'named'
    }
  ],
  plugins: [resolve(), commonjs(), terser()]
};