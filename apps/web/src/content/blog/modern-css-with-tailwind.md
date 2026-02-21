---
title: Modern CSS with Tailwind
date: 2024-09-10
tags: [css, tailwind, styling]
excerpt: Discover how Tailwind CSS can streamline your development workflow and create beautiful UIs.
slug: modern-css-with-tailwind
---

# Modern CSS with Tailwind

Tailwind CSS has revolutionized how we write styles. Instead of writing custom CSS, you compose utility classes directly in your markup.

## The Utility-First Approach

Traditional CSS:
```css
.btn {
  background-color: blue;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}
```

Tailwind CSS:
```html
<button class="bg-blue-500 text-white px-4 py-2 rounded">
  Click me
</button>
```

## Benefits

**Rapid Development**: Build UIs faster without context switching between files

**Consistent Design**: Use a design system built into the framework

**Smaller Bundle**: Purge unused styles in production

**Responsive Design**: Built-in responsive modifiers make mobile-first design easy

## Customization

Tailwind is highly customizable through `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        brand: '#0066cc',
      },
    },
  },
}
```

## Dark Mode

Built-in dark mode support:

```html
<div class="bg-white dark:bg-gray-900">
  <h1 class="text-gray-900 dark:text-white">Title</h1>
</div>
```

## Conclusion

Tailwind CSS offers a pragmatic approach to styling that scales well and keeps teams productive. Give it a try on your next project!
