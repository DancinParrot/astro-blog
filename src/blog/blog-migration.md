---
title: "Blog Migration"
pubDate: 2025-11-01
description: "My new website, and you're already on it!"
author: "Kai"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "Sample image"
tags: ["general"]
---

Previously, my oldest website, kernelized.xyz was hosted on Vercel at about $5 per month. After quite a while of inactivity, I decided to take it down and replace it with a newer website built on Next.js with Nextra, as seen below.

![hodlablog](https://res.cloudinary.com/dq7mgdskm/image/upload/v1761989300/hodlablog_vihcfd.png)

I figured it was a waste of money hosting an inactive site, so I migrated it to Vercel which is free. Now, I've migrated my blog posts again to this site and opted for on-premise hosting instead. Without this site, my domain name points to a Cloudflare error page which is not exactly something nice to see 🤡.

Since I'm kinda lazy, I chose not to bother myself with hosting MinIO as an AWS S3 alternative for serving images for my blog. A headless CMS could be a nice alternative with way less maintenance overhead required to secure the service, but it's on my backlog, which will be there for n days. In the end, I chose Cloudinary, an S3 alternative with a generous free tier that doesn't require a credit card during sign up which works great, for now.
