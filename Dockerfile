FROM node:20-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /bot
COPY . .

RUN mkdir ./logs/

RUN npm install
RUN npm build

EXPOSE 4000
CMD ["node", "build/index.js"]