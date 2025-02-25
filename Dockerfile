# -------------------------------------
# 1. BASE STAGE: Install Dependencies
# -------------------------------------
  FROM node:22-alpine AS base
  ARG NODE_AUTH_TOKEN
  
  WORKDIR /usr/src/app
  
  # Enable pnpm using Corepack
  RUN corepack enable && corepack prepare pnpm --activate
  
  # Copy dependency manifests
  COPY package.json pnpm-lock.yaml ./
  COPY .npmrc .npmrc
  
  # Use the NODE_AUTH_TOKEN during install
  # This ins't best practice and should be passed via secret
  ENV NODE_AUTH_TOKEN=${NODE_AUTH_TOKEN}
  
  # Install all dependencies (including dev dependencies)
  RUN chown -R node:node /usr/src/app
  USER node
  RUN pnpm install --frozen-lockfile
  
  
  # Use a non-root user for security
  USER node
  
  # -------------------------------------
  # 2. BUILD STAGE: Compile the Application
  # -------------------------------------
  FROM base AS build
  WORKDIR /usr/src/app
  
  # Copy source code and node_modules from base
  COPY --chown=node:node . .
  COPY --chown=node:node --from=base /usr/src/app/node_modules ./node_modules
  
  # Build the production bundle
  RUN pnpm run build
  
  # -------------------------------------
  # 3. PRODUCTION STAGE: Optimized for Production
  # -------------------------------------
  FROM node:22-alpine AS production
  ARG APP_VERSION
  ARG NODE_AUTH_TOKEN
  
  WORKDIR /usr/src/app
  
  # Set production environment
  ENV NODE_ENV=production
  ENV APP_VERSION=${APP_VERSION}
  ENV PORT=3000
  
  # Copy production dependencies only
  COPY --from=base /usr/src/app/node_modules ./node_modules
  COPY --from=build /usr/src/app/dist ./dist
  
  # Ensure the node user has permissions
  RUN chown -R node:node /usr/src/app
  USER node
  
  # Expose the server port
  EXPOSE 3000
  
  # Start the server using the production build
  CMD ["node", "-r", "newrelic", "dist/main"]
  