import body from 'body-parser';
import { parseURL } from 'ufo';
import { readFile, writeFile } from 'fs/promises';
import { splitAtFrontmatter } from './utils.mjs';
import { schema, defaultMarkdownSerializer } from 'prosemirror-markdown';


export default function configureServer(server) {
    server.middlewares.use(body.json())
    server.middlewares.use('/__astro_editor', editorBackend);
}

const current = new Map();
function editorBackend(req, res) {
    const { search } = parseURL(req.url);
    const { id, content } = req.body;
    const doc = schema.nodeFromJSON(content.doc);
    const md = defaultMarkdownSerializer.serialize(doc);
    current.set(id, md);
    if (search === '?action=save') {
        updateFile(id, md);
    }
    res.end();
}

let frontmatter = new Map();
async function updateFile(id, content) {
    let fm = frontmatter.get(id);
    if (typeof fm === 'undefined') {
        const raw = await readFile(id, { encoding: 'utf8' }).then(res => res.toString());
        const [_fm] = splitAtFrontmatter(raw);
        frontmatter.set(id, _fm);
        fm = _fm;
    }
    await writeFile(id, `${fm}\n\n${content}`);
}

// async function saveArchive(id) {
//     const base = basename(id, '.md');
//     console.log(base);
// }

// function docToMD(doc) {
//     walk(doc);
//     const result = toMarkdown(doc);
//     console.log(result);
// }
