# Render Blocks

A framework-agnostic, isomorphic library for rendering a dynamic array of objects, which we call blocks.

How can a renderer be framework-agnostic? You provide the render function. You can use React, Vue, Svelte, whatever you want! `@kaelan/render-blocks` provides all the logic leading up to the point of rendering. Framework-specific wrapper packages can optionally be built on top of `@kaelan/render-blocks` to provide a sensible default rendering mechanism.

Everything is handled by the highly-configurable `BlockRenderer` class. You provide a dictionary that maps data objects to your custom UI components.
