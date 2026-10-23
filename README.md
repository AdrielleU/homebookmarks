# Homebookmarks

A bookmark start page for a team or company, in the style of [Homepage](https://gethomepage.dev) and Okta's app dashboard. Plain files: no server, no build step, no database. Host it anywhere that serves static files.

The page never loads anything from another site. Links only leave the site when clicked.

## What to edit

Everything you change is in **`config/`**. Leave the rest alone.

```
config/
  bookmarks.yaml     your pages and links
  settings.yaml      title, light/dark mode, colors, background
  icons/             your own icons (optional)
  (your background image, if you use one)

lib/                 the app's code, default icons and background photos
index.html           the page itself
icon.svg             the browser-tab icon (replace it to brand your site)
everything else      hosting files (Docker, Firebase, Cloudflare, …)
```

Never put passwords, API keys or tokens in `config/`. Everything in it is visible to anyone who opens the site.

## Bookmarks

Each top-level key in `config/bookmarks.yaml` is a page. `home` is the start page.

```yaml
home:
  title: Company Home
  sections:
    - title: Apps
      layout: tiles          # an app grid; leave out for a list
      links:
        - name: GitHub
          url: https://github.com
          icon: github.svg

sales:                       # a page at #/sales, linked from home
  title: Sales
  icon: mdi-chart-line
  sections:
    - title: Tools
      links:
        - name: Salesforce
          url: https://login.salesforce.com
          desc: CRM          # optional line under the name
          abbr: SF           # optional letters shown if there's no icon
```

- Pages and links show in the order you write them. Add `parent: sales` to a page to nest it under Sales.
- Optional link fields: `desc`, `abbr`, `tags` (extra search words), `newTab: true`.
- Indent with spaces, not tabs. Put a value in quotes if it contains `: ` or ` #`.
- A typo shows the error and its line number on the page.

**Icons.** Write an icon's name: `github.svg`, `mdi-bank` ([Material Design](https://pictogrammers.com/library/mdi/)), `si-canva` ([Simple Icons](https://simpleicons.org)), or an emoji. About 140 common ones are in `lib/icons/`. For anything else, save the file into `config/icons/` and use its file name. Good sources: [dashboard-icons](https://github.com/homarr-labs/dashboard-icons), [selfh.st](https://selfh.st/icons/), or the app's own website. No icon? The link shows its `abbr` or first letter.

## Settings

`config/settings.yaml` explains each option in comments. The main ones:

| Setting | Options |
|---|---|
| `title` | The site's name |
| `theme` | `light`, `dark`, or `auto` (follow the device) |
| `view` | `all`: every link on the home screen, up to 4 columns per row. `pages`: one page at a time |
| `size` | `small`, `medium`, `large` |
| `color`, `accent` | `slate`, `blue`, `emerald`, … or a hex like `"#4f46e5"` |
| `background.image` | A bundled photo (`forest`, `beach`, `night-sky`, …), your own file in `config/`, or `""` for none. Use `{ light: beach, dark: night-sky }` for one per mode |

**What visitors can change.** The gear button (top right) lets each visitor pick their own mode, background and colors, saved in their own browser. It also gives them a **seed**: a number that holds their whole look, which they can share. Anyone who pastes it into the gear menu, or opens the page with `?seed=<number>`, gets the same look. `customize: false` hides the gear, and `viewToggle: false` hides the view button.

## Preview on your computer

Browsers won't let a page opened by double-click read `config/`, so run a tiny web server in the project folder:

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000>. Edit, save, refresh. Ctrl+C stops it.

## Publish

Upload the whole folder as it is. There's no build command, and the folder itself is what gets published.

| Host | Terminal | Website |
|---|---|---|
| **Cloudflare** | `npx wrangler deploy --assets . --name my-bookmarks --compatibility-date 2026-10-01` | Workers & Pages → Create → Upload, drag in the folder |
| **Netlify** | `npx netlify-cli deploy --dir . --prod` | Drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop) |
| **GitHub Pages** | push the repo | Repo → Settings → Pages → Deploy from a branch → `main`, `/ (root)` |
| **Firebase** | `firebase deploy --only hosting` (`firebase.json` is included) | Needs the terminal once |
| **Your own server** | `docker compose up -d`, then open <http://localhost:8080> | Portainer: Stacks → Add stack → Repository |

Connecting a host to your GitHub repo makes every commit update the site.

**Keep it private.** All of these publish to anyone who has the address. For a login, put [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/applications/) in front of it (free for small teams, works with Google, Microsoft or email codes).

<details>
<summary><b>More publishing details</b></summary>

- **Cloudflare:** the terminal command above makes a Workers static site; `.assetsignore` keeps `.git` and other tooling out of it, and `_headers` adds the security headers. Run it again after each change. To use your own domain, add `--route "bookmarks.example.com"` or set one in the dashboard.
- **Netlify:** to update a manual upload, open the project → Deploys → drag the folder again. `_headers` is applied automatically.
- **GitHub Pages:** the site is public even on a private repo, and Pages ignores `_headers`. The main protections live in `index.html`, so they still apply.
- **Firebase:** once: `npm install -g firebase-tools`, `firebase login`, `firebase use --add <project>`. To update from the browser afterwards, run `firebase init hosting:github` once; it deploys on every merge to `main`.
- **Docker / Podman:** the compose file serves this folder directly, so edits in `config/` show up on refresh. Change the port in `docker-compose.yml`. A prebuilt image is published as `ghcr.io/adrielleu/homebookmarks:1`; mount your `config/` folder over `/usr/share/nginx/html/config`.

</details>

## Make a new site

Each site is its own copy of this template.

- **GitHub:** on this repo, click **Use this template** → **Create a new repository**. Edit `config/` on github.com (pencil icon → Commit changes), then connect the repo to a host.
- **Terminal:** `npx degit adrielleu/homebookmarks my-bookmarks`, then edit `config/`.

To pick up template updates later, keep it as a git remote (`git remote add template <url>`, then `git pull template main`). Your `config/` stays yours; if there's a conflict there, keep your version.

<details>
<summary><b>Fill in <code>config/</code> with AI (copy this prompt)</b></summary>

Paste this into an AI assistant and fill in the three `<…>` parts. Your links can be a plain list, a browser bookmarks export, or a Homepage `bookmarks.yaml`.

````text
Turn my links into two YAML files for a static bookmarks start page: config/bookmarks.yaml and config/settings.yaml.

bookmarks.yaml
- Top-level keys are pages, written lowercase-with-dashes (they become addresses like #/sales). The first page must be `home`.
- A page has: title, sections, and optionally icon, description, and parent (another page's key; nests it under that page).
- A section has: title, links, and optionally icon and `layout: tiles` (an app grid for apps people open daily).
- A link has: name, url, and optionally icon, abbr (2–3 letters shown when there's no icon), desc (one short line), and tags (extra search words).
- icon is a Material Design icon written mdi-<name> (e.g. mdi-bank) or a dashboard-icons name written <name>.svg (e.g. github.svg, slack.svg). Only use names you're sure exist; otherwise leave icon out and set abbr.
- Use full product names (Google Calendar, not GCal). Group related links into sections. Don't invent links.
- Indent with 2 spaces. Quote a value if it contains ": " or " #".

settings.yaml (only the settings I ask for)
- title, size (small | medium | large), view (all | pages), theme (light | dark | auto),
  color and accent (slate, gray, zinc, neutral, stone, red, orange, amber, emerald, teal, sky, blue,
  indigo, violet, purple, rose, or a hex), background.image (forest, beach, night-sky, alps-clouds, … or "").

Then give me short numbered steps to publish, for how I said I'll publish (below). Facts for those steps:
- Plain static files, no build step. Only the config/ folder changes; the whole folder is what gets published.
- Preview: `python3 -m http.server 8000`, then open http://localhost:8000.
- GitHub website: open the file → pencil icon → paste → Commit changes. A connected host redeploys on each commit.
- Upload without GitHub: Cloudflare (Workers & Pages → Create → Upload) or Netlify (app.netlify.com/drop).
- Terminal: `npx wrangler deploy --assets . --name <name> --compatibility-date 2026-10-01`,
  `npx netlify-cli deploy --dir . --prod`, `firebase deploy --only hosting`, or `docker compose up -d`.
- Never put passwords, API keys or tokens in these files; they're public.
Don't suggest anything that needs a build step, a server-side script, or environment variables.

Reply with the two files, each in its own code block, then the steps.

About my site: <e.g. "Sales team start page, blue, light mode">
How I'll publish: <"website only" or "terminal">, on <Cloudflare / Netlify / GitHub Pages / Firebase / my own server / not sure>
My links:
<paste here>
````

</details>

<details>
<summary><b>Releases</b></summary>

Tag a site's version as `<site>-v<version>` (e.g. `sales-v1.0.0`) and a GitHub Action attaches the whole site as a `.zip` to a GitHub Release, ready to unzip and upload. Terminal: `git tag sales-v1.0.0 && git push origin sales-v1.0.0`. Website: Releases → Draft a new release → type the tag → pick the site's branch → Publish.

On this template repo, plain tags (`v1.2.3`) publish the Docker image `ghcr.io/adrielleu/homebookmarks`.

</details>

## License

[MIT](LICENSE): free to use, change and share, including commercially. Bundled icons, photos and the YAML reader keep their own licenses, listed in [LICENSE](LICENSE).
