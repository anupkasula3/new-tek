
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.tsx',
            ],
            hotFile: 'public_html/hot',
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],

    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },

    build: {
        outDir: 'public/build',
        emptyOutDir: true,
        manifest: 'manifest.json',
    },
});
