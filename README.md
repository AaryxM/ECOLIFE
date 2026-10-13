# EcoLife – website + installable app (PWA)

## Try it on your computer
The install and offline features only work over http(s), not by double-clicking the files.
From this folder run:

    python3 -m http.server 8000

then open http://localhost:8000/login.html

## Put it online (free, HTTPS is automatic)
Upload this whole folder to Netlify (drag and drop at app.netlify.com/drop), Vercel,
Cloudflare Pages or GitHub Pages. Open the link on your phone.

## Install it
- Android (Chrome): menu ⋮ → "Install app" / "Add to Home screen"
  (or use the "Install the EcoLife app" button in the footer).
- iPhone (Safari): Share button → "Add to Home Screen".
- Desktop (Chrome/Edge): install icon at the right of the address bar.

## Files added for the app
- manifest.json   app name, colours, icons, shortcuts
- sw.js           service worker (offline support). Change VERSION in it to make every device refresh its cache.
- icons/          app icons. Replace icon-192.png, icon-512.png, icon-maskable-512.png and
                  apple-touch-icon.png with your own logo (keep the sizes: 192, 512, 512, 180).
                  For icon-maskable keep the logo inside the centre 60% of the image.
