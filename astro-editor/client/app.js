import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema, defaultMarkdownParser, defaultMarkdownSerializer } from 'prosemirror-markdown';
import css from 'prosemirror-view/style/prosemirror.css';
import { exampleSetup } from "prosemirror-example-setup";
import { splitAtFrontmatter } from '../utils.mjs';

// if (import.meta.hot) {
//   import.meta.hot.on('astro-editor:update', ({ id, content: _content}) => {
//     const [fm, content] = splitAtFrontmatter(_content);
//     const currentContent = contents.get(id);
//     if (content.trim() === currentContent.trim()) {
//       return;
//     } else {
//       import.meta.hot.invalidate()
//     }
//   })
// }

function sync(body) {
    const headers = new Headers();
    headers.set('content-type', 'application/json');
    return fetch(`/__astro_editor`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })
}
function save(body) {
    const headers = new Headers();
    headers.set('content-type', 'application/json');
    return fetch(`/__astro_editor?action=save`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })
}

function injectStyle(css) {
  const style = document.createElement('style');
  style.innerHTML = css;
  document.head.appendChild(style);
}

let contents = new Map();

export default function App({ element, id, content }) {
  injectStyle(css)
  const editor = new EditorView({ mount: element }, {
    state: EditorState.create({
      doc: defaultMarkdownParser.parse(content),
      plugins: exampleSetup({ schema, menuBar: false }),
    }),
    dispatchTransaction(transaction) {
        const newState = this.state.apply(transaction);
        this.updateState(newState);
        const content = newState.toJSON();
        contents.set(id, defaultMarkdownSerializer.serialize(editor.state.doc));
        save({ id, content });
    } 
  });
  editor.dom.addEventListener('blur', () => {
    save({ id, content: editor.state.toJSON() })
  })
  return editor;
}
