FROM node:20-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot

RUN mkdir -p /usr/src/bot/logs/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store NODE_ENV=development pnpm install


COPY . /usr/src/bot
RUN pnpm build

EXPOSE 4000
CMD ["node", "build/index.js"]