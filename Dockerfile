# Serves the site with nginx. Build: docker build -t homebookmarks .
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html
