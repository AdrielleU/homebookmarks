# Homebookmarks

A template for static bookmark start pages, in the style of [Homepage](https://gethomepage.dev) and Okta's app dashboard.
Plain files: no server, no build step, no database. Make one site per team, org or website, and host it anywhere that serves static files.

```
bookmarks.yaml   pages and links          ← change per site (anyone can edit)
settings.yaml    title, search, colors    ← change per site
icons/           your own icons           ← add per site
icons/default/   ~130 common app icons    ← shared, leave alone
index.html       the app                  ← shared, leave alone
lib/             theme code, YAML reader  ← shared, leave alone
_headers         security headers (Cloudflare Pages / Netlify)
firebase.json    Firebase Hosting config
.nojekyll        tells GitHub Pages to serve files as-is
```

The page never loads anything from another site. Links only leave the site when clicked.

## Start a new site from this template

Each site is its own copy (its own repo) of this template. You only ever change `bookmarks.yaml`, `settings.yaml`, and `icons/`.

**In the browser (GitHub):**

1. Once: on the template repo, open **Settings** → tick **Template repository**.
2. For each new site: on the template repo, click **Use this template** → **Create a new repository** → name it (e.g. `sales-bookmarks`).
3. In the new repo, open `bookmarks.yaml` → pencil icon → edit → **Commit changes**. Same for `settings.yaml`. To add icons, open `icons/` → **Add file** → **Upload files**.
4. Connect the repo to a host (see [Deploy](#deploy)). From then on, every commit updates the site.

**In the terminal:**

```sh
npx degit <your-org>/homebookmarks sales-bookmarks   # copy the template without its git history
cd sales-bookmarks
git init && git add . && git commit -m "New bookmarks site"
# edit bookmarks.yaml and settings.yaml, then deploy
```

(Or `git clone` the template and keep it as a remote, so you can pull template fixes later: `git remote rename origin template`, then later `git pull template main`. If there's a conflict in `bookmarks.yaml` or `settings.yaml`, keep your version.)

### Why not a `.env` file?

A `.env` file only works when something reads it: a build step or a server. This site has neither; hosts serve the files exactly as they are. Nothing here is secret either: everything in `bookmarks.yaml` and `settings.yaml` is visible to anyone who opens the site. So per-site values live in those two YAML files, and the template ships working samples that each site overwrites.

**Never put passwords, API keys or tokens in any of these files.**

## Fill it in with AI (copy this prompt)

Don't want to write YAML by hand? Paste this prompt into an AI assistant (Claude, ChatGPT, …), replace the two `<…>` parts at the bottom, and it gives you `bookmarks.yaml` and `settings.yaml`.

Your links can be a plain list, a browser bookmarks export (Chrome/Edge: Bookmarks manager → ⋮ → **Export bookmarks**; Firefox: Bookmarks → Manage → **Import and Backup** → Export to HTML), or a Homepage `bookmarks.yaml`.

````text
Turn my links into two YAML files for a static bookmarks start page.

bookmarks.yaml
- Top-level keys are pages, written lowercase-with-dashes (they become addresses like #/sales). The first page must be `home`.
- A page has: title, sections, and optionally icon, description, and parent (another page's key; nests it under that page).
- A section has: title, links, and optionally icon and `layout: tiles` (an app grid; use it for apps people open daily, leave it out for lists of docs and links).
- A link has: name, url, and optionally icon, abbr (2–3 letters shown when there's no icon), desc (one short line), and tags (a list of extra search words).
- icon is either a Material Design icon written mdi-<name> (from pictogrammers.com/library/mdi, e.g. mdi-bank) or a dashboard-icons name written <name>.svg (from github.com/homarr-labs/dashboard-icons, e.g. github.svg, slack.svg, google-drive.svg). Only use names you're sure exist; otherwise leave icon out and set abbr.
- Use full product names (Google Calendar, not GCal). Group related links into sections. Don't invent links or URLs.
- Indent with 2 spaces. Put a value in quotes if it contains ": " or " #".

settings.yaml (only include settings I ask for)
- title, size (small | medium | large), view (pages | all), search (popup | inline),
  theme (light | dark | auto), color and accent (slate, gray, zinc, neutral, stone, red, orange,
  amber, emerald, teal, sky, blue, indigo, violet, purple, rose).

Reply with only the two files, each in its own code block.

About my site: <e.g. "Sales team start page, blue, light mode, everything on one screen">

My links:
<paste your links, bookmarks export, or Homepage bookmarks.yaml here>
````

Check the result, then put the files in your site, either way:

**On a website (no tools needed):**

- *GitHub:* open your site's repo → `bookmarks.yaml` → pencil icon → select all, paste the new file → **Commit changes**. Same for `settings.yaml`. For new icons: open `icons/` → **Add file** → **Upload files**. If the repo is connected to a host, the site updates by itself.
- *No GitHub:* on the template repo click **Code** → **Download ZIP**, unzip it, replace `bookmarks.yaml` and `settings.yaml` with the new files, and drag the folder onto [Netlify Drop](https://app.netlify.com/drop) or Cloudflare's **Upload assets** (see [Deploy](#deploy)).

**In the terminal:**

```sh
# save the two files into your site's folder, then preview:
python3 -m http.server 8000          # open http://localhost:8000, Ctrl+C to stop

# publish: commit and push (if the repo is connected to a host)...
git add bookmarks.yaml settings.yaml icons
git commit -m "Update bookmarks"
git push
# ...or deploy straight from the folder, e.g.
npx wrangler pages deploy . --project-name my-bookmarks
```

## Editing bookmarks

Everything is in `bookmarks.yaml`. Each top-level key is a page:

```yaml
home:                        # the start page, at #/
  title: Company Home
  sections:
    - title: Apps
      layout: tiles          # app grid; leave out for a list
      links:
        - name: GitHub
          url: https://github.com
          icon: github.svg

sales:                       # a page at #/sales, shown as a tile on home
  title: Sales
  icon: mdi-chart-line
  sections:
    - title: Tools
      links:
        - name: Salesforce
          url: https://login.salesforce.com
          abbr: SF           # text shown if there's no icon
          desc: CRM          # shown under the name

sales-emea:                  # nested page: appears on the Sales page
  title: EMEA
  parent: sales
  sections: []
```

- **Add a page:** add a new top-level key. It shows up on `home` automatically (or under its `parent`).
- **Order:** pages and links appear in the order they're written.
- **Search** covers every page. Press `/` (or just start typing) to open it.
- **Mistakes:** if the file has a typo, the page shows the error and its line number instead of the bookmarks.
- Indent with spaces, not tabs. Put a value in quotes if it contains `: ` or ` #`.

Page fields: `title`, `icon`, `description`, `parent`, `childrenTitle` (heading for sub-pages, default "Pages"), `sections`.
Section fields: `title`, `icon`, `layout`, `links`.
Link fields: `name`, `url`, `icon`, `abbr`, `desc`, `tags` (extra search words), `newTab: true`.

## Icons

- `icons/default/` holds common app icons (GitHub, Slack, Google, Microsoft, AWS, Okta, …) plus Material Design `mdi-*` and Simple Icons `si-*`. Run `ls icons/default` to see them.
- `icons/` is for your site's own. A file here wins over one with the same name in `default/`.

| `icon:` value | Result |
|---|---|
| `github` or `github.svg` | `icons/github.*`, then `icons/default/github.*` |
| `mdi-bank`, `si-canva` | Material Design / Simple Icons, tinted to match the theme |
| `📊` | emoji |
| *(none)* | a file named after the link (`AWS Console` → `aws-console.svg`), else `abbr`, else the first letter |

To add an icon, save the file into `icons/` and use its file name. Sources (the same ones Homepage uses): [dashboard-icons](https://github.com/homarr-labs/dashboard-icons), [Material Design Icons](https://pictogrammers.com/library/mdi/) (save as `mdi-<name>.svg`), [Simple Icons](https://simpleicons.org) (save as `si-<name>.svg`), [selfh.st](https://selfh.st/icons/), or the app's own website.

## Theme

`settings.yaml` sets the title, the search engine, the page `size` (`small`, `medium`, `large`), the starting light/dark mode, colors (`slate`, `blue`, `emerald`, …) and an optional background image (put the image in the project root and set `background.image`). Anything you leave out uses the default from `lib/site.js`. A typo shows the error and line number on the page, same as `bookmarks.yaml`.

### Views and buttons

Three buttons in the top-right corner let each visitor switch modes. Their choices are remembered in their own browser; `settings.yaml` sets the starting mode, and `<name>Toggle: false` hides a button.

| Setting | Options | Button |
|---|---|---|
| `view` | `pages`: one page at a time, team pages as tiles (Okta style)<br>`all`: the home screen lists every link from every page, one column per page (Homepage style); team pages still open on their own | grid / rows |
| `search` | `popup`: press `/` or just start typing; a quick-launch box lists matches from every page. ↑↓ to move, Enter to open, Ctrl+Enter for a new tab, Esc to close (Homepage style)<br>`inline`: the search box filters the page as you type | popup / text box |
| `theme` | `light`, `dark`, `auto` (follow the device) | sun / moon |

## Test locally

Browsers won't let a page opened from disk read the YAML files, so preview through a tiny local web server. From the project folder, run one of:

```sh
python3 -m http.server 8000      # Python (built into macOS/Linux)
npx serve .                      # Node
```

Then open <http://localhost:8000> (or the address `serve` prints). Edit `bookmarks.yaml`, save, refresh. Stop the server with Ctrl+C.

If you double-click `index.html` instead, the page tells you to run the command above.

## Deploy

Upload the whole folder as-is. No build command; the output/publish directory is the project root.
Dashboards get redesigned often, so button names below may differ slightly.

### Cloudflare Pages

**Terminal:**

```sh
npx wrangler login
npx wrangler pages deploy . --project-name sales-bookmarks
```

Run the second command again after each change.

**Web dashboard:**

- *Upload:* [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create application** → **Pages** → **Upload assets** (drag and drop) → name the project → drag in the folder → **Deploy site**. To update, open the project → **Create deployment** → drag the folder again.
- *From git (auto-updates):* **Workers & Pages** → **Create application** → **Pages** → **Connect to Git** → pick the repo → leave **Build command** empty, **Build output directory** `/` → **Save and Deploy**. Every commit redeploys.
- *Quick throwaway preview:* drag the folder onto [Cloudflare Drop](https://developers.cloudflare.com/changelog/post/2026-07-08-cloudflare-drag-and-drop/). It stays live for 1 hour unless you claim it.

Address: `https://<project>.pages.dev`. `_headers` is applied automatically.

### Firebase Hosting

**Terminal:** (`firebase.json` is included, so skip `firebase init`)

```sh
npm install -g firebase-tools          # once
firebase login                         # once
firebase projects:create sales-bookmarks
firebase use --add sales-bookmarks     # saves the project in .firebaserc
firebase deploy --only hosting         # every time you change something
```

Preview with Firebase's own server: `firebase emulators:start --only hosting`.

**Web dashboard:** Firebase has no drag-and-drop upload; the first deploy needs the CLI. You can make later updates browser-only by connecting GitHub once:

1. [console.firebase.google.com](https://console.firebase.google.com) → **Create a project** (Google Analytics not needed).
2. Once, in the terminal: `firebase init hosting:github`. It adds GitHub Actions to the repo that deploy on every merge to `main` (and post a preview link on pull requests).
3. From then on, edit `bookmarks.yaml` on github.com and commit; the site updates. The Firebase console's **Hosting** page shows every release and has one-click **Rollback**.

Address: `https://<project-id>.web.app`.

### Netlify

**Terminal:**

```sh
npx netlify-cli login
npx netlify-cli deploy --dir . --prod
```

**Web dashboard:**

- *Upload:* drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop), or in [app.netlify.com](https://app.netlify.com) → **Add new project** → **Deploy manually** → drag the folder. To update, open the project → **Deploys** → drag the folder onto the drop zone.
- *From git (auto-updates):* **Add new project** → **Import an existing project** → GitHub → pick the repo → leave **Build command** empty, **Publish directory** `.` → **Deploy**.

Address: `https://<project>.netlify.app`. `_headers` is applied automatically.

### GitHub Pages

**Terminal** (with the [GitHub CLI](https://cli.github.com)):

```sh
gh repo create sales-bookmarks --public --source . --push
gh api -X POST repos/{owner}/sales-bookmarks/pages -f "source[branch]=main" -f "source[path]=/"
```

**Web dashboard:** in the repo → **Settings** → **Pages** → **Build and deployment** → Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)` → **Save**. The address appears at the top of that page after a minute.

Address: `https://<user-or-org>.github.io/<repo>/`. Pages on a private repo needs a paid GitHub plan, and the published site is public either way. GitHub Pages ignores `_headers`; the main protections are in `index.html`, so they still apply.

### Docker / Podman (self-host)

For running it on your own server, e.g. next to a Homepage container. It serves the files with nginx (a ~50 MB image) and sends the same security headers as `_headers`.

**Terminal:**

```sh
docker compose up -d          # or: podman compose up -d
```

Open <http://localhost:8080>. The compose file serves the project folder directly, so editing `bookmarks.yaml`, `settings.yaml` or `icons/` only needs a browser refresh, not a rebuild. Change the port in `docker-compose.yml` (`"8080:80"`). Stop it with `docker compose down`.

Without compose, build an image with everything baked in:

```sh
docker build -t homebookmarks .
docker run -d --name homebookmarks -p 8080:80 --restart unless-stopped homebookmarks
```

**Published image:** each [release](https://github.com/AdrielleU/homebookmarks/releases) publishes `ghcr.io/adrielleu/homebookmarks` with tags `1.2.3`, `1.2`, `1` and `latest`. Run it with your own files mounted on top (pin a major version so updates don't surprise you):

```yaml
services:
  bookmarks:
    image: ghcr.io/adrielleu/homebookmarks:1
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./bookmarks.yaml:/usr/share/nginx/html/bookmarks.yaml:ro,z
      - ./settings.yaml:/usr/share/nginx/html/settings.yaml:ro,z
      - ./icons:/usr/share/nginx/html/icons:ro,z   # only if you have your own icons; keep icons/default/ in it
```

Single-file mounts can miss edits from editors that save by replacing the file; run `docker compose restart` if a change doesn't show.

**Making a release** (maintainers): `git tag v1.2.3 && git push origin v1.2.3`. GitHub Actions builds the image for amd64 and arm64, pushes it, and creates the release.

**Web UI:** in Portainer (or similar), **Stacks** → **Add stack** → **Repository**, point it at your site's git repo with compose path `docker-compose.yml` → **Deploy the stack**.

You don't need Docker for Cloudflare Pages, Firebase, Netlify or GitHub Pages; upload the folder as above.

### Any other web server

Copy the folder into the web root (nginx, Apache, S3 + CloudFront, an intranet server, …).

### Keeping it private

All of these publish the site to anyone with the address. To require a login:

- **Cloudflare Pages:** put Cloudflare Access in front of it (Zero Trust → Access → Applications). Free for small teams; works with Google, Okta, GitHub sign-in.
- **Netlify:** password protection is on paid plans.
- **Firebase / GitHub Pages:** no built-in login for static sites. Use Cloudflare Pages if you need one.

## License

[MIT](LICENSE): free to use, copy, change and share, including commercially. Bundled third-party files (the YAML reader and icon sets) keep their own licenses, listed in [LICENSE](LICENSE). Product names and logos belong to their owners.
