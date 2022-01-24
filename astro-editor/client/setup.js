import App from './app.js';
import { splitAtFrontmatter } from '../utils.mjs';


export default async function setup(element, id) {
  const raw = await fetch(`/@fs${id}?content`).then(res => res.text());
  const [fm, content] = splitAtFrontmatter(raw);
  App({ element, id, content });
}
