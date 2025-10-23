import type { CollectionEntry } from "astro:content";

const getSortedPosts = (posts: CollectionEntry<"blog">[]) => {
  return posts
    .sort(
      (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
    );
}

export default getSortedPosts;
