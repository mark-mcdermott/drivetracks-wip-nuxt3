# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=21.7.2
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Nuxt"

# Nuxt app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"
ENV HOST=0.0.0.0
ENV PORT=3000

# Ensure /etc/apt/sources.list exists and set up alternative Debian mirrors
RUN [ -f /etc/apt/sources.list ] || echo 'deb http://deb.debian.org/debian bookworm main' > /etc/apt/sources.list && \
    sed -i 's|http://deb.debian.org|https://mirror.slu.cz|g' /etc/apt/sources.list && \
    apt-get update && \
    apt-get install --no-install-recommends -y curl && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3 && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

# Install node modules
COPY package-lock.json package.json ./
RUN npm ci --include=dev

# Copy application code
COPY . .

# Build application
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Expose port and set start command
EXPOSE 3000
CMD [ "node", ".output/server/index.mjs" ]