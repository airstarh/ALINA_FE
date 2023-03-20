// https://ckeditor.com/docs/ckeditor5/latest/installation/frameworks/vuejs-v2.html
// vite.config.js
import { createRequire } from 'node:module';
const require = createRequire( import.meta.url );
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5';

export default defineConfig( {
	plugins: [
		vue(),
		ckeditor5( { theme: require.resolve( '@ckeditor/ckeditor5-theme-lark' ) } )
	],
} )