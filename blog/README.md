# Writing a blog post

Posts are plain Markdown files. There is no build step: the post page loads the Markdown in the browser and renders it.

## Folder structure

```
blog/
├── README.md                 ← this guide
├── index.html                ← listing page (/blog/)
├── posts.json                ← list of posts: title, subtitle, author, date
├── _template/                ← copy this to start a new post
│   ├── index.html
│   ├── index.md
│   └── images/
└── <slug>/                   ← one folder per post, served at /blog/<slug>/
    ├── index.html            ← page shell, identical for every post (don't edit)
    ├── index.md              ← the article
    └── images/               ← this post's images only
```

Shared code lives in `/media/blog.css` (styles) and `/media/blog-post.js` (rendering).

## Add a new post

1. **Pick a slug.** It should be short, lowercase and hyphenated, e.g. `why-duckdb-is-fast`. It becomes the URL `/blog/why-duckdb-is-fast/` and can't change later without breaking links.

2. **Copy the template:**

   ```bash
   cp -r blog/_template blog/why-duckdb-is-fast
   ```

3. **Write the article** in `blog/why-duckdb-is-fast/index.md`. Start with the opening paragraph: the title, subtitle and byline are added automatically.

4. **Add the post** to the top of `blog/posts.json`:

   ```json
   {
     "slug": "why-duckdb-is-fast",
     "title": "Why DuckDB Is Fast",
     "subtitle": "One sentence that appears under the title and in the listing.",
     "author": "Jay Modi",
     "date": "2026-10-31"
   }
   ```

   Separate entries with a comma. The listing sorts by `date`, newest first.

5. **Preview locally:**

   ```bash
   python3 -m http.server 8000
   # open http://localhost:8000/blog/why-duckdb-is-fast/
   ```

6. **Publish:** commit and push to `master`. GitHub Pages updates in a minute or two.

## Blocks you can use

| Block | Markdown |
| ----- | -------- |
| Section heading | `## Heading` (`#` also works) |
| Sub-heading | `### Sub-heading` |
| Code block | fence with ```` ```python ```` … ```` ``` ```` |
| Image with caption | `![Alt text](images/file.png "Caption")` |
| Quote | `> Quoted text` |
| Lists, tables, links, **bold**, *italic*, `code` | standard Markdown |

`blog/_template/index.md` has an example of each.

**Contents sidebar:** every `#` and `##` heading is listed automatically. It sits beside the article on wide screens and becomes a collapsible "Contents" box above the article on phones. It appears once a post has two or more such headings. Use `###` for headings you want left out.

**Images:**
- Put the files in the post's own `images/` folder and reference them as `images/<file>`.
- An image on its own line becomes a full-width figure, and the text in quotes becomes its caption.
- Always write alt text describing the image.
- Prefer `.svg` for diagrams, `.webp` or `.jpg` for photos, and `.png` for screenshots. Keep each file under ~300 KB; resize to at most 1600px wide.
- Name files after their content, e.g. `query-plan.png`, not `image1.png`.

## Weekly rhythm (one post every 7 days)

- **Queue posts ahead.** A post with a future `date` stays hidden from the listing until that day, so you can push finished drafts early. Its URL still works if you share it directly, so treat it as unlisted, not secret.
- **Keep a backlog** of 4–5 topic ideas so a busy week doesn't break the streak.
- **Before publishing**, check:
  - The slug folder exists and contains `index.html`, `index.md` and `images/`.
  - The entry is in `posts.json`, with valid JSON (commas!) and the correct date.
  - Every image has alt text and loads in the local preview.
  - The post reads well on a phone-width window.
  - The root `README.md` "Blog Posts" list has the new link.
