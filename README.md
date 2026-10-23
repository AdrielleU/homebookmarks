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

Don't want to write YAML by hand? Paste this prompt into an AI assistant (Claude, ChatGPT, …) and fill in the three `<…>` parts at the bottom. It gives you `bookmarks.yaml` and `settings.yaml`, plus step-by-step instructions for publishing them the way you work: clicking through a website, or typing commands in a terminal.

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
- title, size (small | medium | large), view (pages | all),
  theme (light | dark | auto), color and accent (slate, gray, zinc, neutral, stone, red, orange,
  amber, emerald, teal, sky, blue, indigo, violet, purple, rose).

Then give me short numbered steps to publish the files, written for how I said I'll publish (below).
Facts about this template, for those steps:
- It's plain static files with no build step. The site folder (its root) is what gets published.
  Only bookmarks.yaml, settings.yaml and icons/ change per site; leave index.html and lib/ alone.
- Preview locally: `python3 -m http.server 8000`, then open http://localhost:8000
  (double-clicking index.html doesn't work; browsers block it from reading the YAML files).
- Website only, with GitHub: open the file on github.com → pencil icon → paste → Commit changes.
  Icons: open icons/ → Add file → Upload files. A host connected to the repo redeploys on each commit.
- Website only, without GitHub: download the site's latest release .zip (or the template's
  Code → Download ZIP), unzip, replace the two YAML files, then upload the folder:
  Cloudflare: Workers & Pages → Create → Pages → Upload assets.  Netlify: app.netlify.com/drop.
  Firebase Hosting has no upload page; it needs the terminal once (`firebase deploy --only hosting`).
  GitHub Pages: Settings → Pages → Deploy from a branch → main, / (root).
- Terminal: git add / commit / push (if a host is connected to the repo), or
  `npx wrangler pages deploy . --project-name <name>`, `npx netlify-cli deploy --dir . --prod`,
  `firebase deploy --only hosting`, or `docker compose up -d` to self-host (http://localhost:8080).
- Releases: tag `<site>-v<version>` (e.g. sales-v1.0.0) and a .zip of the site is attached to a GitHub
  Release. Terminal: `git tag sales-v1.0.0 && git push origin sales-v1.0.0`. Website: Releases →
  Draft a new release → type the new tag → pick the site's branch → Publish release.
- Never put passwords, API keys or tokens in these files; everything in them is public on the site.
Don't suggest anything that needs a build step, a server-side script, or environment variables.

Reply with the two files, each in its own code block, then the steps.

About my site: <e.g. "Sales team start page, blue, light mode, everything on one screen">

How I'll publish: <"website only" or "terminal">, on <Cloudflare Pages / Netlify / Firebase / GitHub Pages / Docker on my server / not sure yet>

My links:
<paste your links, bookmarks export, or Homepage bookmarks.yaml here>
````

Check the result, then follow the steps it gives you. For reference, the two ways to put the files in your site:

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

`settings.yaml` sets the title, the search engine, the page `size` (`small`, `medium`, `large`), the starting light/dark mode, colors (`slate`, `blue`, `emerald`, …) and an optional background image: pick one of the photos in `backgrounds/` (`background.image: backgrounds/forest.jpg`) or add your own file and point to it. Text stays readable in both modes: dark mode dims the image and light mode fades it toward white, by the amount set in `background.brightness`. Anything you leave out uses the default from `lib/site.js`. A typo shows the error and line number on the page, same as `bookmarks.yaml`.

### Views and buttons

Two buttons in the top-right corner let each visitor change how the page looks. Their choices are remembered in their own browser only; `settings.yaml` sets what everyone starts with.

| Setting | Options | Button |
|---|---|---|
| `view` | `pages`: one page at a time, team pages as tiles (Okta style)<br>`all`: the home screen lists every link from every page, one column per page (Homepage style); team pages still open on their own. `viewToggle: false` hides the button | grid / rows |
| `customize` | The gear opens a menu with the mode (`light`, `dark`, `auto` to follow the device), a background (any photo in `backgrounds/`, the site's own image, or none), and five colors under **Colors** (click to open), each set with the color picker or a hex code: **Primary** (title, date, links and buttons), **Secondary** (descriptions), **Accent** (section headings and highlights, starts as `accent`), **Background** (page tint, starts as `color`) and **Card** (tiles, lists and the search box). Colors are saved separately for light and dark mode, so each mode keeps its own look; clearing a color's hex box puts it back to the default. "Reset settings" clears everything the visitor chose. `customize: false` hides the gear | gear |

**Seeds.** The gear menu also shows a *seed*: one number that holds a visitor's whole look: mode, view, background, and their light and dark colors. It's short when little is changed (4 digits for all defaults) and up to about 75 digits with every color set. Copy it and anyone can paste it into their own gear menu and press Load, or open the page with `?seed=<number>` (for example `https://bookmarks.example.com/?seed=1915596660606387240772682015078810327`) to get the exact same look. Nothing is stored on a server: the number *is* the settings, and the last two digits are a check, so a mistyped seed is rejected instead of loading the wrong colors. A seed's background means the same photo on any site built from this template; "the site's own image" means that site's `background.image`.

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

New image versions come from template releases; see [Releases](#releases).

**Web UI:** in Portainer (or similar), **Stacks** → **Add stack** → **Repository**, point it at your site's git repo with compose path `docker-compose.yml` → **Deploy the stack**.

You don't need Docker for Cloudflare Pages, Firebase, Netlify or GitHub Pages; upload the folder as above.

### Any other web server

Copy the folder into the web root (nginx, Apache, S3 + CloudFront, an intranet server, …).

### Keeping it private

All of these publish the site to anyone with the address. To require a login:

- **Cloudflare Pages:** put Cloudflare Access in front of it (Zero Trust → Access → Applications). Free for small teams; works with Google, Okta, GitHub sign-in.
- **Netlify:** password protection is on paid plans.
- **Firebase / GitHub Pages:** no built-in login for static sites. Use Cloudflare Pages if you need one.

## Releases

### Release a site as a .zip

Each release attaches the whole site folder as a `.zip`, ready to unzip and upload to any host (or run with `docker compose up -d` inside it). The GitHub Action `.github/workflows/release-zip.yml` does the work; it's included in every repo made from this template.

Tags name the site and its version: `<site>-v<version>`, e.g. `sales-v1.0.0`. If one repo holds several sites on different branches, the name keeps each site's releases apart.

**Terminal** (from the site's folder, on its branch):

```sh
git pull                                   # make sure you're releasing the latest
git tag sales-v1.0.0
git push origin sales-v1.0.0
```

**Website (GitHub):**

1. In the repo, open **Releases** (right-hand sidebar) → **Draft a new release**.
2. **Choose a tag** → type `sales-v1.0.0` → **Create new tag on publish**.
3. **Target**: pick the site's branch (e.g. `main`, or `sales` if each site has its own branch).
4. Click **Publish release**.

Within a minute, `homebookmarks-sales-v1.0.0.zip` shows up under the release's **Assets** (refresh the page). The zip leaves out only `.git` and `.github`.

**Using a release:** open **Releases**, download the `.zip` under **Assets**, unzip it, and upload the `homebookmarks-<site>` folder to your host (see [Deploy](#deploy)): drag it onto Netlify Drop or Cloudflare's **Upload assets**, or run `docker compose up -d` inside it.

### Release the Docker image (template maintainers)

On this template repo, plain version tags build the image instead: `git tag v1.2.3 && git push origin v1.2.3` publishes `ghcr.io/adrielleu/homebookmarks:1.2.3` (plus `1.2`, `1`, `latest`) via `.github/workflows/release.yml`, and creates a release.

## License

[MIT](LICENSE): free to use, copy, change and share, including commercially. Bundled third-party files (the YAML reader and icon sets) keep their own licenses, listed in [LICENSE](LICENSE). Product names and logos belong to their owners.
