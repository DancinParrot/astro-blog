# My Website

This repo contains my personal website built on Astro. Nothing much, just a simple site.

## Deployment

To deploy a dev build:
```bash
npm run dev
```

To build site for production:
```bash
npm run build
```

To deploy website for production on various hosting platforms, refer to [this guide](https://docs.astro.build/en/guides/deploy/). Or, deploy locally to nginx/apache.

## 🚀 Project Structure

Inside of this project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── blog
│   │   └── post.md
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── BaseLayout.astro
│   ├── pages
│   │   └── index.astro
│   ├── styles
│   │   └── global.css
│   ├── utils
│   │   └── getSortedPosts.ts
│   └── content.config.ts
└── package.json
```

Refer to [Astro's official guide on project structure](https://docs.astro.build/en/basics/project-structure/) for more information.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Future Plans

Some features I'd like to add:
- TOC for Blog Posts
- Headless CMS, i.e. Strapi
- Self-host MinIO as S3 alternative to store images
- Self-host Coolify to deploy like Vercel
- CI/CD
