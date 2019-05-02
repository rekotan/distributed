FROM node:boron

ADD . /retro
WORKDIR /retro

RUN npm install && \
  npm install -g gulp && \
  adduser --disabled-password --gecos "retro" --home /retro --no-create-home retro && \
  chown -R retro:retro /retro

EXPOSE 4000

USER retro

CMD ["gulp"]
