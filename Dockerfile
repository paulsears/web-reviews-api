###################
# BUILD FOR LOCAL DEVELOPMENT
###################
FROM node:22-alpine AS development
ARG NODE_AUTH_TOKEN

# Create app directory
WORKDIR /usr/src/app

# Installs pnpm
RUN corepack enable && corepack prepare pnpm --activate

# Copy application dependency manifests to the container image.
COPY --chown=node:node package.json ./
COPY --chown=node:node pnpm-lock.yaml ./
COPY --chown=node:node . .

# Install app dependencies
# TODO: we'll need to move the .npmrc file and deployment github workflow
# to use docker secrets: https://docs.npmjs.com/docker-and-private-modules
# until done, this dockerfile will require a working node_modules
RUN pnpm install --frozen-lockfile

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################
FROM node:22-alpine AS build
ARG NODE_AUTH_TOKEN

RUN corepack enable && corepack prepare pnpm --activate

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node pnpm-lock.yaml ./

# In order to run `pnpm run build` we need access to the Nest CLI which is a dev dependency.
# In the previous development stage we ran `pnpm install` which installed all dependencies,
# so we can copy over the node_modules directory from the development image
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN pnpm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `pnpm install --frozen-lockfile` removes the existing node_modules directory and passing in
# --only=production ensures that only the production dependencies are installed. This ensures that
# the node_modules directory is as optimized as possible
RUN pnpm install --frozen-lockfile --only=production

USER node

###################
# PRODUCTION
###################
FROM node:22-alpine AS production
ARG NODE_AUTH_TOKEN
ARG APP_VERSION

WORKDIR /usr/src/app

# newrelic tries to create a file in this directory on startup
RUN chown -R node:node /usr/src/app

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

USER node

ENV APP_VERSION=${APP_VERSION}
ENV PORT=80

EXPOSE 80

# Start the server using the production build
CMD ["node", "-r", "newrelic", "dist/main"]
