FROM node:20-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /bot
COPY . .

RUN mkdir ./logs/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store NODE_ENV=development pnpm install
RUN pnpm build

EXPOSE 4000
CMD ["node", "build/index.js"]