import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import configureServer from './server.mjs';

const virtualId = 'virtual:astro-editor'

export default function editor() {
    let files = new Set();
    return {
		name: '@astrojs/vite-plugin-editor',
        enforce: 'post',
        resolveId(id = '') {
            if (id === virtualId) {
                return fileURLToPath(new URL('./client/index.js', import.meta.url))
            }
        },
		async transform(content, id) {
            if (id.endsWith('.md?html-proxy&index=0.js')) {
                const file = id.slice(0, '?html-proxy&index=0.js'.length * -1);
                files.add(file);
                return `import setup from "${virtualId}";\nsetup("${file}");\n${content}`;
            }
        },
        configureServer(server) {
            configureServer(server)
        },
        async handleHotUpdate({ file, server, read }) {
            if (files.has(file)) {
                const content = await read();
                server.ws.send({
                    type: 'custom',
                    event: 'astro-editor:update',
                    data: { id: file, content }
                })
                return []
            }
        }
    }
}
