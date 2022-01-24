# Experiment: Astro Editor

## Warning: VERY EXPERIMENTAL

This kinda works! It's a proof-of-concept using a local Vite plugin that allows you to edit your content in-context. Simply place a `use:editor` directive on your content's parent, and suddenly you have a live editor. 

**I skipped over the hard parts in favor of getting the basic idea working.** I'm hoping this serves as inspiration for other folks.

The plugin itself (located in `astro-editor/`) creates a middleware endpoint that handles editor updates and syncs them back to the sourcefile. The client is responsible for POSTing updates to that server endpoint. In order to maintain client-side state, the plugin also disables HMR/reloads for `.md` files.

### Setup

Add the Vite plugin to your Astro config.

```js
// astro.config.mjs
import editor from './astro-editor/plugin.mjs'

export default {
    vite: {
        plugins: [editor()]
    }
}
```

In your Layout file, wrap the `<slot>` contents in `<div use:editor>`. Styling and attributes will still apply when the editor is active.

```astro
---
// src/components/BlogPost.astro
---

<div class="post" use:editor>
    <slot />
</div>
```
