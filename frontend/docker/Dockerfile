FROM node:8.11-alpine

WORKDIR /srv
COPY . /srv/

RUN yarn
RUN npm rebuild node-sass
RUN yarn run build


FROM nginx

# move project files into container
COPY ./docker/sites-enabled /etc/nginx/
COPY --from=0 /srv/dist /srv/static
COPY --from=0 /srv/dist/index.html /

# move static assets into place
CMD ["nginx", "-g", "daemon off;"]