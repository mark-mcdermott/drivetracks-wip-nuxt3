# Rails API & Nuxt 3 App
- Rails 7 postgres backend, Nuxt 3 frontend using tailwindcss
- Hosted on fly.io

# To Run Locally
- clone this repo (`git clone <reponame>`)
- `cd` into repo
- `cd frontend`
- `npm install`
- `npm run dev`
- split your terminal and in the new terminal pane do:
  - `cd ../backend`
  - `bundle install`
  - `rails server`
- in a browser, go to `http://localhost:3001`
- `^ + c` (to kill server)

# To Create This Project From Scratch

## Init App
- Our app is made to be in one github repo with two main folders - a `frontend` and `backend` folder.
- `cd ~`
- `mkdir app`
- `cd app`
- `wget https://raw.githubusercontent.com/mark-mcdermott/drivetracks-wip-nuxt3/main/README.md`
- `npx nuxi@latest init frontend`
  - modules: eslint, fonts, icon, image, test-utils
  - package manager: `npm`
  - init git repo: `no`
- `rails new backend --api --database=postgresql`
- `rm -rf backend/.git`
- `touch .gitignore`
- make `~/app/.gitignore` look like this:
```
.DS_Store
node_modules
.secrets
```
- `touch .secrets`
- make `~/app/.secrets` look like this:
```
fly.io url details:
  frontend url: 
  backend url: 

fly.io postgres cluster details
  name: 
  Username: 
  Password: 
  Hostname: 
  Flycast: 
  Proxy port: 
  Postgres port: 
  Connection string: 

AWS details:
  aws acct id: 
  aws region:  
  s3 user policy: 
  s3 user: 
  s3 user access key: 
  s3 user secret access key: 
  s3 bucket dev: 
  s3 bucket prod: 
```
- `mkdir .circleci`
- `touch .circleci/config.yml`
- make `.circleci/config.yml` look like this:
```
version: 2.1

jobs:
  say-hello:
    docker:
      - image: cimg/base:current

    steps:
      - checkout
      - run:
          name: "Say hello"
          command: "echo Hello, World!"

workflows:
  say-hello-workflow:
    jobs:
      - say-hello
```
- `git init`
- `git add .`
- `git commit -m "Init app"`
- create an empty repo on github and note the git url (something like https://github.com/mark-mcdermott/ruxtmin-nuxt3.git)
- `git remote add origin <git url>`
- `git push --set-upstream origin main`
- go to your CircleCI projects page (something like `https://app.circleci.com/projects/project-dashboard/github/mark-mcdermott/`)
- next to repo name (`drivetracks-api`), click Set Up Project
- click `Fastest` -> `main` -> `Set Up Project`

### Init On fly.io
- We'll host our app on [Fly.io](https://fly.io). It's not free, but relatively cheap and is more headache-free than AWS for a toy app like this. We'll actually have two apps one fly.io, one for the backend and one for the frontend. And since we use postgres for the database, fly.io automatically will create a third fly.io app for that, but we don't have to mess with the fly.io database app much or think about it too much for now.
- make sure you have a [fly.io](https://fly.io) account and have the [fly.io CLI program](https://fly.io/docs/flyctl/install) installed. Follow their docs if you run into trouble, I haven't done those parts in awhile.
- `cd ~/app/backend`
  - we have to make a small addition to the default `backend/Dockerfile` that rails made us. At the end of the `apt-get install` line on line 22, add one more package to install, `libjemalloc2`
  - let's init our backend fly.io app. The name part has to be unique in their system I think, so if you run the below line as is, it will probably tell you your app name is already chosen and you'll have to keep trying with more obscure app names until you find a unique one that works.
  - `fly launch --name app-backend`
    - (if this ever hangs at `Waiting for depot`, kill the launch with `control + c`, delete the partially-installed app in the fly.io dashboard and then relaunch with `fly launch --name app-backend --depot=false`)
    - hit enter (for "no") when it asks a question about wanting to tweak the settings
    - watch the output and look for the `Postgres cluster` details, which end with the line, `Save your credentials in a secure place -- you won't be able to see them again!` When you see it, copy and paste it to the corresponding section in your `~/app/.secrets` file.
    - at the end of all the output it will say, `Visit your newly deployed app at https://<your backend app name>.fly.dev/` - copy/paste the backend app name url it gives you to the `backend url:` part of your `.secrets` file
    - if you go to your backend url in a browser it will say `page not found` / `http error 404`. This is expected because it's an API only backend and we haven't set up the root url "/" as an endpoint.
- `cd ~/app/frontend`
  - like in the backend `fly launch` line above, your fly.io frontend app name has to be unique in their system, so you may have to run this a few times with different names after the `--name ` part until you find a unique one that works
  - `fly launch --name app-frontend`
    - (if this ever hangs at `Waiting for depot`, kill the launch with `control + c`, delete the partially-installed app in the fly.io dashboard and then relaunch with `fly launch --name app-frontend --depot=false`)
    - hit enter (for "no") when it asks a question about wanting to tweak the settings
    - copy the frontend app url it gives you at the end of all the output and paste it into your `.secrets` file at the `frontend url:` line
- in a browser, go to your fly.io frontend app url. You should see the default Nuxt placeholder homepage.

### Set Bundler Version
- TODO: I'm pretty sure this section can be deleted
- check your bundler version - this is at the bottom of ~/app/backend/Gemfile.lock. We want it to say `2.4.19`. If it doesn't, try this:
  - `gem install bundler -v 2.4.19`
  - `bundle _2.4.19_ lock --update`

## Placeholder Backend API
- Mostly we're going to get the frontend up and running first, but to make sure everything's wired up correctly, we're going to first quickly build out a small placeholder backend API with rpec tests.

### Rubocop
- `cd ~/app/backend`
- install VSCode extentions `Ruby LSP` and `Rubocop`
- `bundle add rubocop-rails`
- `bundle install`
- `touch .rubocop.yml`
- to `.rubocop.yml` add:
```
require: rubocop-rails
Style/Documentation:
  Enabled: false
```
- `rubocop -A`

### RSpec
- `cd ~/app/backend`
- `bundle add rspec-rails shoulda-matchers --group "development, test"`
- `bundle install`
- `rails generate rspec:install`
- make `~/app/backend/spec/rails_helper.rb` look like this:
```
# frozen_string_literal: true

require 'spec_helper'
ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
abort("The Rails environment is running in production mode!") if Rails.env.production?
require 'rspec/rails'
require 'shoulda/matchers'

begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  abort e.to_s.strip
end

RSpec.configure do |config|
  config.include FactoryBot::Syntax::Methods

  config.use_transactional_fixtures = false

  config.before(:each) do
    Rails.application.routes.default_url_options[:host] = 'http://localhost:3000'
  end

  config.infer_spec_type_from_file_location!
  config.filter_rails_from_backtrace!
end

Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :rspec
    with.library :rails
  end
end
```

### Factory Bot
- `cd ~/app/backend`
- `bundle add factory_bot_rails --group "development, test"`
- `bundle install`
- `mkdir spec/factories`
- we will wait to create the user factory until Devise creates it for us automatically when we use Devise to generate the user model

### CORS
- `cd ~/app/backend`
- `bundle add rack-cors`
- `bundle install`
- make `~/app/backend/config/initializers/cors.rb` (if it doesn't exist, then make it) look like this (we'll restrict the origins some more later):
```
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'
    resource "*",
    headers: :any,
    expose: ['access-token', 'expiry', 'token-type', 'Authorization'],
    methods: [:get, :patch, :put, :delete, :post, :options, :show]
  end
end
```

### Health Status Controller
- Rails comes with a built-in health controller api at `/up`. We're going to move it to `/api/v1/up` because all our API urls will be prefixed with `/api/v1`, which is pretty common for APIs.
- `cd ~/app/backend`
- `mkdir -p app/controllers/api/v1`
- `touch app/controllers/api/v1/health_controller.rb`
- make `~/app/controllers/api/v1/health_controller.rb` look like this:
```
class Api::V1::HealthController < ApplicationController
  def show
    render json: { status: 'OK' }, status: :ok
  end
end
```
- make `~/app/backend/config/routes.rb` look like this:
```
# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'up' => 'health#show'
    end
  end
end
```

### Health Status Controller Test
- `cd ~/app/backend`
- `mkdir -p spec/requests/api/v1`
- `touch spec/requests/api/v1/health_controller_spec.rb`
- make `~/app/backend/spec/requests/api/v1/health_controller_spec.rb` look like this:
```
require 'rails_helper'

RSpec.describe "Api::V1::HealthController", type: :request do
  describe "GET /api/v1/up" do
    it "returns http success" do
      get "/api/v1/up"
      expect(response).to have_http_status(:success)
    end
  end
end
```
- `rspec spec/requests/api/v1/health_controller_spec.rb` -> should pass

## Deploy Backend And Run RSpec Tests

### Deploy Backend To Fly.io
- `cd ~/app/backend`
- make `~/app/backend/fly.toml` look like this (replacing `<backend url>` with your backend url from `.secrets` and `<backend app name>` with the backend app name, which is the the backend url with out `https://` at the beginning and without `.fly.dev` at the end):
```
app = '<backend app name>'
primary_region = 'dfw'
console_command = '/rails/bin/rails console'

[build]

[deploy]
  release_command = './bin/rails db:prepare'

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = 'stop'
  auto_start_machines = true
  min_machines_running = 0
  processes = ['app']
   
  [[http_service.health_checks]]
    path = "/api/v1/up"
    interval = 10000
    timeout = 2000

[[vm]]
  memory = '1gb'
  cpu_kind = 'shared'
  cpus = 1

[[statics]]
  guest_path = '/rails/public'
  url_prefix = '/'

[env]
  PORT = "8080"
  DEFAULT_URL_HOST = "<backend url>"
  DEFAULT_URL_PORT = "443"
```
- change the last two lines of the `Dockerfile` (`EXPOSE` and `CMD`) to:
```
EXPOSE 8080
CMD ["./bin/rails", "server", "-b", "0.0.0.0", "-p", "8080"]
```
- `fly deploy` <- this may show a couple errors mid-deploy, but should not hang (ie, it should complete and bring you back to the terminal prompt) and it should not show `WARNING The app is not listening on the expected address` at any point
- `curl <backend url from .secrets>/api/v1/up` <- should return `{"status":"OK"}`

### Run RSpec On Fly.io
- `cd ~/app/backend`
- `fly ssh console`
  - `RAILS_ENV=test bundle exec rspec` <- should pass
  - `exit`

## RSpec Docker Setup

### Docker Prelimnary Setup
- `cd ~/app`
- `touch .dockerignore`
- make `~/app/.dockerignore` look like this:
```
.env
.secrets
log/*
tmp/*
```
- `cd backend`
- `EDITOR="code --wait" rails credentials:edit` <-- copy the secret_key_base
- `touch .env`
- make `backend/.env` look like this:
```
POSTGRES_PASSWORD=<paste postgres password from ~/app/.secrets here>
SECRET_KEY_BASE=<paste secret_key_base value here>
```
- copy/paste the `secret_key_base` value from the open creds file into the `.env` file and then 
close the file
- copy/paste the `postgres_password` value from `~/app/.secrets` into the `.env` file
- `touch wait-for-it.sh`
- make `~/app/backend/wait-for-it.sh` look like this:
```
#!/usr/bin/env bash
# Use this script to test if a given TCP host/port are available

WAITFORIT_cmdname=${0##*/}

echoerr() { if [[ $WAITFORIT_QUIET -ne 1 ]]; then echo "$@" 1>&2; fi }

usage()
{
    cat << USAGE >&2
Usage:
    $WAITFORIT_cmdname host:port [-s] [-t timeout] [-- command args]
    -h HOST | --host=HOST       Host or IP under test
    -p PORT | --port=PORT       TCP port under test
                                Alternatively, you specify the host and port as host:port
    -s | --strict               Only execute subcommand if the test succeeds
    -q | --quiet                Don't output any status messages
    -t TIMEOUT | --timeout=TIMEOUT
                                Timeout in seconds, zero for no timeout
    -- COMMAND ARGS             Execute command with args after the test finishes
USAGE
    exit 1
}

wait_for()
{
    if [[ $WAITFORIT_TIMEOUT -gt 0 ]]; then
        echoerr "$WAITFORIT_cmdname: waiting $WAITFORIT_TIMEOUT seconds for $WAITFORIT_HOST:$WAITFORIT_PORT"
    else
        echoerr "$WAITFORIT_cmdname: waiting for $WAITFORIT_HOST:$WAITFORIT_PORT without a timeout"
    fi
    WAITFORIT_start_ts=$(date +%s)
    while :
    do
        if [[ $WAITFORIT_ISBUSY -eq 1 ]]; then
            nc -z $WAITFORIT_HOST $WAITFORIT_PORT
            WAITFORIT_result=$?
        else
            (echo -n > /dev/tcp/$WAITFORIT_HOST/$WAITFORIT_PORT) >/dev/null 2>&1
            WAITFORIT_result=$?
        fi
        if [[ $WAITFORIT_result -eq 0 ]]; then
            WAITFORIT_end_ts=$(date +%s)
            echoerr "$WAITFORIT_cmdname: $WAITFORIT_HOST:$WAITFORIT_PORT is available after $((WAITFORIT_end_ts - WAITFORIT_start_ts)) seconds"
            break
        fi
        sleep 1
    done
    return $WAITFORIT_result
}

wait_for_wrapper()
{
    # In order to support SIGINT during timeout: http://unix.stackexchange.com/a/57692
    if [[ $WAITFORIT_QUIET -eq 1 ]]; then
        timeout $WAITFORIT_BUSYTIMEFLAG $WAITFORIT_TIMEOUT $0 --quiet --child --host=$WAITFORIT_HOST --port=$WAITFORIT_PORT --timeout=$WAITFORIT_TIMEOUT &
    else
        timeout $WAITFORIT_BUSYTIMEFLAG $WAITFORIT_TIMEOUT $0 --child --host=$WAITFORIT_HOST --port=$WAITFORIT_PORT --timeout=$WAITFORIT_TIMEOUT &
    fi
    WAITFORIT_PID=$!
    trap "kill -INT -$WAITFORIT_PID" INT
    wait $WAITFORIT_PID
    WAITFORIT_RESULT=$?
    if [[ $WAITFORIT_RESULT -ne 0 ]]; then
        echoerr "$WAITFORIT_cmdname: timeout occurred after waiting $WAITFORIT_TIMEOUT seconds for $WAITFORIT_HOST:$WAITFORIT_PORT"
    fi
    return $WAITFORIT_RESULT
}

# process arguments
while [[ $# -gt 0 ]]
do
    case "$1" in
        *:* )
        WAITFORIT_hostport=(${1//:/ })
        WAITFORIT_HOST=${WAITFORIT_hostport[0]}
        WAITFORIT_PORT=${WAITFORIT_hostport[1]}
        shift 1
        ;;
        --child)
        WAITFORIT_CHILD=1
        shift 1
        ;;
        -q | --quiet)
        WAITFORIT_QUIET=1
        shift 1
        ;;
        -s | --strict)
        WAITFORIT_STRICT=1
        shift 1
        ;;
        -h)
        WAITFORIT_HOST="$2"
        if [[ $WAITFORIT_HOST == "" ]]; then break; fi
        shift 2
        ;;
        --host=*)
        WAITFORIT_HOST="${1#*=}"
        shift 1
        ;;
        -p)
        WAITFORIT_PORT="$2"
        if [[ $WAITFORIT_PORT == "" ]]; then break; fi
        shift 2
        ;;
        --port=*)
        WAITFORIT_PORT="${1#*=}"
        shift 1
        ;;
        -t)
        WAITFORIT_TIMEOUT="$2"
        if [[ $WAITFORIT_TIMEOUT == "" ]]; then break; fi
        shift 2
        ;;
        --timeout=*)
        WAITFORIT_TIMEOUT="${1#*=}"
        shift 1
        ;;
        --)
        shift
        WAITFORIT_CLI=("$@")
        break
        ;;
        --help)
        usage
        ;;
        *)
        echoerr "Unknown argument: $1"
        usage
        ;;
    esac
done

if [[ "$WAITFORIT_HOST" == "" || "$WAITFORIT_PORT" == "" ]]; then
    echoerr "Error: you need to provide a host and port to test."
    usage
fi

WAITFORIT_TIMEOUT=${WAITFORIT_TIMEOUT:-15}
WAITFORIT_STRICT=${WAITFORIT_STRICT:-0}
WAITFORIT_CHILD=${WAITFORIT_CHILD:-0}
WAITFORIT_QUIET=${WAITFORIT_QUIET:-0}

# Check to see if timeout is from busybox?
WAITFORIT_TIMEOUT_PATH=$(type -p timeout)
WAITFORIT_TIMEOUT_PATH=$(realpath $WAITFORIT_TIMEOUT_PATH 2>/dev/null || readlink -f $WAITFORIT_TIMEOUT_PATH)

WAITFORIT_BUSYTIMEFLAG=""
if [[ $WAITFORIT_TIMEOUT_PATH =~ "busybox" ]]; then
    WAITFORIT_ISBUSY=1
    # Check if busybox timeout uses -t flag
    # (recent Alpine versions don't support -t anymore)
    if timeout &>/dev/stdout | grep -q -e '-t '; then
        WAITFORIT_BUSYTIMEFLAG="-t"
    fi
else
    WAITFORIT_ISBUSY=0
fi

if [[ $WAITFORIT_CHILD -gt 0 ]]; then
    wait_for
    WAITFORIT_RESULT=$?
    exit $WAITFORIT_RESULT
else
    if [[ $WAITFORIT_TIMEOUT -gt 0 ]]; then
        wait_for_wrapper
        WAITFORIT_RESULT=$?
    else
        wait_for
        WAITFORIT_RESULT=$?
    fi
fi

if [[ $WAITFORIT_CLI != "" ]]; then
    if [[ $WAITFORIT_RESULT -ne 0 && $WAITFORIT_STRICT -eq 1 ]]; then
        echoerr "$WAITFORIT_cmdname: strict mode, refusing to execute subprocess"
        exit $WAITFORIT_RESULT
    fi
    exec "${WAITFORIT_CLI[@]}"
else
    exit $WAITFORIT_RESULT
fi
```
- `chmod +x wait-for-it.sh`

### Rspec Docker Setup
- `cd ~/app/backend`
- `touch Dockerfile.backend`
- make `~/app/backend/Dockerfile.backend look like this:`
```
FROM ruby:3.3.0

# Create a non-root user named circleci
RUN useradd -m circleci

# Switch to root user to perform setup tasks
USER root

# Set the working directory
WORKDIR /app/backend

# Copy Gemfile and Gemfile.lock first to leverage Docker layer caching
COPY Gemfile Gemfile.lock ./

# Install dependencies
RUN bundle install

# Change ownership of the application directory to the circleci user
RUN chown -R circleci:circleci /app/backend

# Switch to non-root circleci user
USER circleci

# Default command
CMD ["bash"]
```
- `cd ~/app`
- `touch docker-compose.yml`
- make `~/app/docker-compose.yml` look like this:
```
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_DB: backend_${RAILS_ENV:-development}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 20s
      timeout: 10s
      retries: 10

  backend:
    user: "${DOCKER_USER:-circleci}"
    build:
      context: ./backend
      dockerfile: Dockerfile.backend
    image: backend_image
    environment:
      BACKEND_PATH: /app/backend
      RAILS_ENV: ${RAILS_ENV:-development}
      DATABASE_URL: "postgres://postgres:${POSTGRES_PASSWORD}@db:5432/backend_${RAILS_ENV:-development}"
    volumes:
      - ./backend:/app/backend
    working_dir: /app/backend  # Align with WORKDIR in Dockerfile
    env_file:
      - ./backend/.env
    ports:
      - '3000:3000'
    depends_on:
      db:
        condition: service_healthy
    command: >
      bash -c '
        rm -f /app/backend/tmp/pids/server.pid &&
        bundle exec rails db:prepare &&
        bundle exec rails s -b 0.0.0.0 -p 3000
      '
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:3000/ || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5

  rspec:
    image: backend_image
    environment:
      RAILS_ENV: test
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      DATABASE_URL: "postgres://postgres:${POSTGRES_PASSWORD}@db:5432/backend_test"
      SECRET_KEY_BASE: ${SECRET_KEY_BASE}
    volumes:
      - bundle_data:/usr/local/bundle
      - ./backend:/app/backend
    working_dir: /app/backend
    env_file:
      - ./backend/.env
    depends_on:
      db:
        condition: service_healthy
    user: "${DOCKER_USER:-circleci}"
    command: >
      bash -c '
        # echo "SECRET_KEY_BASE is: $SECRET_KEY_BASE" && # Debug line to confirm visibility
        ./wait-for-it.sh db:5432 -- bundle exec rails db:drop db:create db:migrate &&
        bundle exec rspec
      '

volumes:
  postgres_data:
  bundle_data:
  backend_data:
    driver: local
```

### Run Docker RSpec
- `cd ~/app`
- `docker compose down -v --remove-orphans`
  - if that command fails, saying it can't find the POSTGRES_PASSWORD, in an empty file paste
```
export POSTGRES_PASSWORD=<postgres password>
export SECRET_KEY_BASE=<secret key base>
```
  - now fill in the correct postgres password and secret key base 
  - now copy/paste those two lines into terminal and run them
- `docker volume ls`
- `docker compose build`
- `docker compose up -d db backend`
- `docker compose ps` <- should see `db` and `backend` services running
- `docker compose run --rm rspec` <-- should pass

### Initialize CircleCI
- `cd ~/app`
- in CircleCI add the environment variables:
  - go to your CircleCI project
  - click Project Settings
  - click Environment Variables
    - add the postgres password:
      - click Add Environment Variable
      - Name: `POSTGRES_PASSWORD`
      - Value: <copy/paste the fly.io cluster postgres password from `~/.secrets` here>
      - click Add Environment Variable
    - add the rails secret key base:
      - click Add Environment Variable
      - Name: `SECRET_KEY_BASE`
      - Value: <paste the rails secret_key_base you used above. run `EDITOR="code --wait" rails credentials:edit` again if you need to copy it.>
      - click Add Environment Variable
- make `.circleci/config.yml` look like this:
```
version: 2.1

executors:
  ubuntu_machine_executor:
    machine:
      image: ubuntu-2004:current

commands:
  install_docker_compose:
    steps:
      - run:
          name: Install Docker Compose
          command: |
            DOCKER_COMPOSE_VERSION=2.20.2
            sudo curl -L "https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
            sudo chmod +x /usr/local/bin/docker-compose
            docker-compose version

  create_env_file:
    steps:
      - run:
          name: Create .env File
          command: |
            echo "POSTGRES_PASSWORD=${POSTGRES_PASSWORD}" > backend/.env
            echo "RAILS_ENV=test" >> backend/.env
      - run:
          name: Display .env for Verification
          command: cat backend/.env

  ensure_permissions:
    steps:
      - run:
          name: Ensure Permissions for Backend Files
          command: |
            chmod -R 777 backend/log
            chmod -R 777 backend/tmp
            chmod +x backend/wait-for-it.sh
            touch backend/log/test.log
            touch backend/tmp/local_secret.txt
            chmod 666 backend/log/test.log
            chmod 666 backend/tmp/local_secret.txt

  build_backend_image:
    steps:
      - run:
          name: Build Backend Image
          command: docker build --no-cache -t backend_image -f backend/Dockerfile.backend backend

jobs:
  rspec:
    executor: ubuntu_machine_executor
    steps:
      - checkout
      - install_docker_compose
      - create_env_file
      - ensure_permissions
      - build_backend_image
      - run:
          name: Confirm .env File Exists in Docker
          command: docker-compose run --rm rspec ls -l /app/backend/.env
      - run:
          name: Check First Few Characters of SECRET_KEY_BASE
          command: echo "SECRET_KEY_BASE=${SECRET_KEY_BASE:0:6}"
      - run:
          name: Adjust Backend Folder Permissions on Host
          command: sudo chmod -R 777 /home/circleci/project/backend
      - run:
          name: Remove Existing Containers (if any)
          command: docker-compose down -v
      - run:
          name: Run RSpec Tests
          command: |
            cd backend
            docker-compose up --no-build --abort-on-container-exit rspec
      - run:
          name: Verify Permissions Inside Backend Container
          command: |
            docker-compose run --rm rspec bash -c 'ls -la /app/backend/log /app/backend/tmp'
      - store_test_results:
          path: backend/tmp/rspec_results
      - store_artifacts:
          path: backend/log

workflows:
  version: 2
  test:
    jobs:
      - rspec
```
- `git add .` 
- `git commit -m "Add RSpec To CircleCI"`
- `git push`
- check your CircleCI project page <-- it should have started a build which will run RSpec and it should pass

## Frontend

### ESLint AutoSave
- We'll use [ESLint](https://eslint.org) to keep our JavaScript clean looking. We want to set it up so it runs ESLint auto-fix every time we save our file.
- `cd ~/app/frontend`
- `npm install -D eslint eslint-plugin-nuxt`
- `npx eslint --init`
- make `~/app/frontend/eslint.config.mjs` look like this:
```
import nuxt from 'eslint-plugin-nuxt'
import js from '@eslint/js'

export default [
  js.configs.recommended,
  nuxt.configs.recommended,
  {
    rules: {
      'vue/multi-word-component-names': 'off', // Disable if you use single-word components
      'no-console': 'warn', // Warn instead of error for console.logs
      'no-unused-vars': 'warn', // Warn for unused variables
    },
  },
]
```
- in `~/app/frontend/package.json`, add these two script lines:
```
"lint": "eslint . --ext .js,.ts,.vue",
"lint:fix": "eslint . --ext .js,.ts,.vue --fix"
```
- `cd ..`
- `mkdir .vscode`
- `touch .vscode/settings.json`
```
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact", "vue"],
  "editor.formatOnSave": false,
  "files.eol": "\n",
  "editor.tabSize": 2,
  "editor.insertSpaces": true
}
```

### Vitest (Component Tests)
- We'll use Nuxt testing as [described in the Nuxt docs](https://nuxt.com/docs/getting-started/testing), which uses `@nuxt/test-utils` and [Vitest](https://vitest.dev). The only departure we're taking for the Nuxt testing documentation is that we won't be running Playwright as a vitest test runner. We'll just run Playwright directly as a standalone testing package (I like its functionality better this way).
- install VSCode `Vitest` extension
- `cd ~/app/frontend`
- `npm i --save-dev vitest @vue/test-utils happy-dom`
- `touch vitest.config.ts`
- make `~/app/frontend/vitest.config.ts` look like this:
```
import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
  },
})
```
- add vitest settings to `~/app/frontend/eslint.config.js` so it looks like this:
```
import js from '@eslint/js'
import nuxt from 'eslint-plugin-nuxt'
import vitest from 'eslint-plugin-vitest'

export default [
  js.configs.recommended,
  nuxt.configs.recommended,
  {
    files: ['**/*.{test,spec}.{js,ts}'], // Only apply Vitest rules to test files
    plugins: { vitest },
    rules: vitest.configs.recommended.rules
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off', // Disable single-word component warning
      'no-console': 'warn',
      'no-unused-vars': 'warn'
    }
  }
]
```
- to `~/app/frontend/package.json` in the `scripts` section add:
```
    "vitest": "npx vitest",
    "component-tests": "npx vitest run spec/components/*",
```
- `npm run component-tests` -> vitest should run (it will try to run the component tests, but there are no tests yet)
- `^ + c` -> to kill the server

### Playwright (End-To-End Tests)
- We'll be using [Playwright](https://playwright.dev) for end-to-end tests. As mentioned above, we won't be running Playwright as a vitest test runner. We'll just run Playwright directly as a standalone testing package. We'll also use pixelmatch for Playwright visual regression testing.
- `cd ~/app/frontend`
- `npm install @playwright/test pixelmatch playwright-expect`
- `npx playwright install`
- `touch playwright.config.ts`
- make `~/app/frontend/playwright.config.ts` look like this:
```
import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./spec/e2e",
  outputDir: "./spec/e2e/videos",
  use: { video: "on", baseURL: "http://localhost:3001" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } }
  ],
});
```
- `mkdir -p spec/e2e/screenshots/baseline`
- to `~/app/frontend/package.json` in the `scripts` section add:
```
    "playwright": "npx playwright test",
```
- at the bottom of `~/app/frontend/.gitignore`, add:
```
# Playwright videos
spec/e2e/videos
```
- `npm run playwright` -> playwright should run (it will try to run the end-to-end tests, but there are no tests yet)

### Concurrently
- We want to be able to start our app locally with one command. We could do something like `rails server` in one terminal pane and then split the terminal pane and in the new one do `cd ~/app/frontend && npm run dev`. But we can do it cleanly in just one pane with the npm package called [concurrently](https://www.npmjs.com/package/concurrently).
- `cd ~/app/frontend`
- `npm install --save-dev concurrently`
- `touch wait-for-rails.sh`
- make `~/app/frontend/wait-for-rails.sh` look like this:
```
#!/bin/bash
until curl --silent --fail http://localhost:3000/api/v1/up | grep -q '{"status":"OK"}'; do
  echo "Waiting for Rails server to start..."
  sleep 1
done
echo "Ok, rails server is up and running - let's start testing!"
```
- `chmod +x wait-for-rails.sh`
- to `~/app/frontend/package.json` in the `scripts` section add:
```
    "wait-then-playwright": "./wait-for-rails.sh && npx playwright test",
    "rails-server": "cd ../backend && rails server",
    "front-and-back-dev": "concurrently -n 'BACKEND,FRONTEND' -c 'green,yellow' 'npm:rails-server' 'npm:dev'",
    "e2e-tests": "concurrently -n 'RAILS_SERVER,NUXT_SERVER,PLAYWRIGHT' -c 'blue,green,yellow' 'npm:rails-server' 'npm:dev' 'npm:wait-then-playwright'"
```
- `npm run e2e-tests` -> backend should start and then vitest should run (it will try to run, but there are no tests yet)
- `^ + c` -> will kill both the frontend and backend servers with one command

### Placeholder Hello World Homepage
- `cd ~/app/frontend`
- We'll run our Nuxt frontend on port 3001 and our Rails backend on port 3000.
- make `~/app/frontend/nuxt.config.ts` look like this:
```
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: { public: { apiBase: 'http://localhost:3000/api/v1' }},
  devServer: { port: 3001 },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils',
  ]
})
```
- `npm run dev` -> should see Nuxt starter app at http://localhost:3001
- `^ + c` -> to kill the server
- change `~/app/frontend/app.vue` to:
```
<template>
  <div>
    <h1>Hello World</h1>
  </div>
</template>
```
- `npm run dev` -> "Hello World" in serif font Times New Roman
- `^ + c`

### Placeholder Playwright Test
- `cd ~/app/frontend`
- `touch spec/e2e/home.spec.ts`
- make `~/app/frontend/spec/e2e/home.spec.ts` look like this:
```
import { test, expect } from '@playwright/test';

test('Homepage body text', async ({ page }) => {
  await page.goto('http://localhost:3001')
  await expect(page.getByRole('heading').filter({ hasText: 'Hello World'})).toBeVisible({ timeout: 30000 })
});
```

### Nuxt /pages Folder
- Right now our app lives in `~/frontend/app.vue` and just says "Hello World". Nuxt can use a folder called `/pages` for any content pages and automatically creates urls for the based on their filenames. `/pages/index.vue` will be available at `/`, `pages/about.vue` will be available at `/about`, `pages/contact.vue` will be available at `/contact`, etc. Here we'll make our `/pages/index.vue` file and then to make the `/pages` folder work, we'll add `<NuxtPage />` to `app.vue` and remove the "Hello World" part from `app.vue`
- `cd ~/app/frontend`
- `mkdir pages`
- `touch pages/index.vue`
- make `~/app/frontend/pages/index.vue` look like this:
```
<template>
  <div>
    <h1>Hello World</h1>
  </div>
</template>
```
- make `~/frontend/app.vue` look like this:
```
<template>
  <NuxtPage />
</template>
```
- `npm run dev` -> Homepage still looks like it did before
- `^ + c`

### Tailwind
- We'll use [Nuxt Tailwind](https://tailwindcss.nuxtjs.org) for modern, scaleable css. We'll setup tailwind now because UI Thing we set up in the next step needs it.
- install the VSCode extension `vscode-tailwind-magic`
- `cd ~/app/frontend`
- `npm install tailwindcss @tailwindcss/vite`
- `mkdir -p assets/css`
- `touch assets/css/main.css`
- make `~/app/frontend/assets/css/main.css` look like this:
```
@import "tailwindcss";
```
- make `~/app/frontend/nuxt.config.ts` look like this:
```
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: { public: { apiBase: 'http://localhost:3000/api/v1' }},
  devServer: { port: 3001 },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils',
  ],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  css: ['~/assets/css/main.css']
})
```
`npm run dev` -> "Hello World" in sans serif font Inter
^ + c

### UI Thing
- We'll use [UI Thing](https://ui-thing.behonbaker.com), for our UI kit. A UI kit is a collection of re-usable [shadcn-ui](https://ui.shadcn.com/) components and component blocks. Specifically, UI Thing is a port of [shadc-vue](https://www.shadcn-vue.com/) for Nuxt. We'll setup UI Thing now because our non-placeholder homepage we build in the next section uses it.
- `cd ~/app/frontend`
- `npx ui-thing@latest init`
  - nuxt 3
  - pick a theme color when prompted
  - you can hit enter for all the other questions including for npm
- `npm i -D @iconify-json/lucide`
- For the record, the UI Thing install added a handful of packages and modules and added some extra configurations to our `~/app/frontend/nuxt.config.ts`, which now looks something like this:
```
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: { public: { apiBase: "http://localhost:3000/api/v1" } },
  devServer: { port: 3001 },

  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/test-utils",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  css: ["~/assets/css/main.css"],
  compatibilityDate: "2025-03-12",

  tailwindcss: {
    exposeConfig: true,
    editorSupport: true,
  },

  colorMode: {
    classSuffix: "",
  },

  imports: {
    imports: [
      {
        from: "tailwind-variants",
        name: "tv",
      },
      {
        from: "tailwind-variants",
        name: "VariantProps",
        type: true,
      },
    ],
  },
});
```
- We need to remove the tailwind module stuff (`"@nuxtjs/tailwindcss"`) and just use the tailwind plugin stuff:
```
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: { public: { apiBase: "http://localhost:3000/api/v1" } },
  devServer: { port: 3001 },

  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/test-utils",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
  ],

  css: ["~/assets/css/main.css"],

  tailwindcss: {
    exposeConfig: true,
    editorSupport: true,
  },

  colorMode: {
    classSuffix: "",
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  imports: {
    imports: [
      {
        from: "tailwind-variants",
        name: "tv",
      },
      {
        from: "tailwind-variants",
        name: "VariantProps",
        type: true,
      },
    ],
  },
});
```

### Playwright Spec For Non-Hello-World Homepage
- Before we make our non-hello-world homepage, let's write our playwright spec for it. We'll break this into two files, a `shared.js` (which will contain the test logic used for the header, footer and screenshot tests, which will be called from several tests) and `home.spec.js`, which will call `shared.js` at some points.
- `cd ~/app/frontend`
- `touch spec/e2e/shared.js`
- make `~/app/frontend/spec/e2e/shared.js` look like this:
```
// shared.js
import { promises as fs } from 'fs';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

// Sets baseline directory based on environment
const getBaselineDir = () => {
  const ciValue = process.env.CI || 'undefined'
  const dockerValue = process.env.DOCKER_ENV || 'undefined'
  console.log(`CI: ${ciValue}, DOCKER_ENV: ${dockerValue}`)
  if (process.env.CI === 'true') return 'spec/e2e/screenshots/baseline/ci'
  if (process.env.DOCKER_ENV === 'true') return 'spec/e2e/screenshots/baseline/docker'
  return 'spec/e2e/screenshots/baseline/local'
}

// Main function to compare screenshots, accepting a dynamic URL
export async function compareScreenshot(page, testName, { browserName = 'chromium', targetUrl }) {
  const baselineDir = getBaselineDir();
  const baselinePath = `${baselineDir}/${testName}.png`;
  const screenshotPath = `spec/e2e/screenshots/current/${testName}.png`;

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(targetUrl); // Use the provided target URL
  await fs.mkdir('spec/e2e/screenshots/current', { recursive: true });
  await page.screenshot({ path: screenshotPath });

  const baselineExists = await fs.access(baselinePath).then(() => true).catch(() => false);

  // Create baseline if not found
  if (!baselineExists && browserName === 'chromium') {
    console.log('Baseline image not found. Creating new baseline...');
    await fs.mkdir(baselineDir, { recursive: true });
    await fs.copyFile(screenshotPath, baselinePath);
    console.log('New baseline image created at:', baselinePath);
  }

  if (baselineExists) {
    const baselineImage = PNG.sync.read(await fs.readFile(baselinePath));
    const currentImage = PNG.sync.read(await fs.readFile(screenshotPath));

    const { width, height } = baselineImage;
    const diff = new PNG({ width, height });
    const pixelDiffCount = pixelmatch(
      baselineImage.data,
      currentImage.data,
      diff.data,
      width,
      height,
      { threshold: 0.1 }
    );

    if (pixelDiffCount > 0) {
      const diffPath = `spec/e2e/screenshots/diff/${testName}-diff.png`;
      await fs.mkdir('spec/e2e/screenshots/diff', { recursive: true });
      await fs.writeFile(diffPath, PNG.sync.write(diff));
      console.log(`Difference found! Diff image saved at ${diffPath}`);
    }

    return pixelDiffCount;
  }

  return 0;
}
```
- make `~/app/frontend/spec/e2e/home.spec.ts` look like this:
```
// home.spec.ts
import { test, expect } from '@playwright/test';
import { compareScreenshot } from './shared';

test('Homepage body text', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('hero-h1').filter({ hasText: 'There was a wall.' })).toBeVisible({ timeout: 30000 });
  await expect(page.getByTestId('hero-h1').filter({ hasText: 'It did not look important.' })).toBeVisible();
  await expect(page.getByTestId('hero-p').filter({ hasText: '{"status":"OK"}' })).toBeVisible();
  // await expect(page.getByTestId('hero-link-login').filter({ hasText: 'Log in' })).toBeVisible();
});

test('current screenshot matches baseline', async ({ page, browserName }) => {
  const pixelDiffCount = await compareScreenshot(page, 'home', { browserName, targetUrl: '/' })
  expect(pixelDiffCount).toBe(0)
})
```

run the failing test with `npm run e2e-tests` -> tests should fail
`^ + c` to kill the test server

### Non-Hello-World Homepage Content
- Here we'll replace our "Hello World" placeholder homepage with some lorem-type content in a h1, some body copy and some buttons. Our `p` tag body content will actually be the response from our backend health check api, to test that the backend and frontend are wired together correctly. The We'll use our UI Thing kit, which uses tailwind, to make it look pretty nice.
- `cd ~/app/frontend`
- `npx ui-thing@latest add container badge button gradient-divider`
- make `~/app/frontend/pages/index.vue` look like this:
```
<script setup>
const healthStatus = await $fetch(`${useRuntimeConfig().public.apiBase}/up`)
</script>

<template>
  <UiContainer class="relative flex flex-col items-center py-10 text-center lg:py-20">
    <h1 data-testid="hero-h1" class="hero-h1 mb-4 mt-7 text-4xl font-bold lg:mb-6 lg:mt-5 lg:text-center lg:text-5xl xl:text-6xl">
      There was a wall.<br>It did not look important.
    </h1>
    <p data-testid="hero-p" class="hero-text mx-auto max-w-[768px] tracking-tight text-lg text-muted-foreground lg:text-center lg:text-xl">
      {{ JSON.stringify(healthStatus) }}
    </p>
    <div class="hero-buttons mt-8 grid w-full grid-cols-1 items-center gap-3 sm:flex sm:justify-center lg:mt-10">
      <UiButton to="/login" size="lg" variant="outline">
        Log in
      </UiButton>
      <UiButton to="/signup" size="lg">
        Sign up
      </UiButton>
    </div>
  </UiContainer>
</template>
```
- `npm run front-and-back-dev`-> Should be some ok looking homepage content now with a h1, some body copy and two buttons. Note that the `{"status":"OK"}` subtitle is pulling from the backend API so we know that our frontend calls to the backend are written correctly and that the backend is responding properly.
- run `^ + c` to kill the servers
- now that we've changed the way our homepage looks, we'll have to delete our pixelmatch baseline homepage image, so run `rm spec/e2e/screenshots/baseline/local/home.png`
- `npm run e2e-tests` -> test should pass now

### UI Thing Button Wrapper
- `cd ~/app/frontend`
- We want to add data attributes in our links that are easy for Playwright to grab, but UI Thing's button component doesn't let us add data attributes. So we'll create a button wrapper component that will.
- `touch components/UiThingDataButtonWrapper.vue`
- make `~/app/frontend/components/UiThingDataButtonWrapper.vue` look like this:
```
<template>
  <UiButton v-bind="$attrs">
    <slot>{{ text }}</slot> 
  </UiButton>
</template>

<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    required: false,
  },
});

defineExpose({});
</script>
```
- now change `~/app/frontend/pages/index.vue` to look like:
```
<script setup>
const healthStatus = await $fetch(`${useRuntimeConfig().public.apiBase}/up`)
</script>

<template>
  <UiContainer class="relative flex flex-col items-center py-10 text-center lg:py-20">
    <h1 data-testid="hero-h1" class="hero-h1 mb-4 mt-7 text-4xl font-bold lg:mb-6 lg:mt-5 lg:text-center lg:text-5xl xl:text-6xl">
      There was a wall.<br>It did not look important.
    </h1>
    <p data-testid="hero-p" class="hero-text mx-auto max-w-[768px] tracking-tight text-lg text-muted-foreground lg:text-center lg:text-xl">
      {{ JSON.stringify(healthStatus) }}
    </p>
    <div class="hero-buttons mt-8 grid w-full grid-cols-1 items-center gap-3 sm:flex sm:justify-center lg:mt-10">
      <UiThingDataButtonWrapper data-testid="hero-link-login" to="/login" size="lg" variant="outline">
        Log in
      </UiThingDataButtonWrapper>
      <UiThingDataButtonWrapper data-testid="hero-link-login" to="/signup" size="lg">
        Sign up
      </UiThingDataButtonWrapper>
    </div>
  </UiContainer>
</template>
```
- now change `~/app/frontend/spec/e2e/home.spec.ts` to look like:
```
// home.spec.ts
import { test, expect } from '@playwright/test';
import { compareScreenshot } from './shared';

test('Homepage body text', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('hero-h1').filter({ hasText: 'There was a wall.' })).toBeVisible({ timeout: 30000 });
  await expect(page.getByTestId('hero-h1').filter({ hasText: 'It did not look important.' })).toBeVisible();
  await expect(page.getByTestId('hero-p').filter({ hasText: '{"status":"OK"}' })).toBeVisible();
  await expect(page.getByTestId('hero-link-login').filter({ hasText: 'Log in' })).toBeVisible();
});

test('current screenshot matches baseline', async ({ page, browserName }) => {
  const pixelDiffCount = await compareScreenshot(page, 'home', { browserName, targetUrl: '/' })
  expect(pixelDiffCount).toBe(0)
})
```
- run playwright tests with `npm run e2e-tests` -> tests should pass
- `^ + c` to kill the test server

### Frontend Prod Setup & Deploy
- If we check our app's frontend url in prod (on fly.io) right now it won't load and nuxt will say `404 [GET] "http://localhost:3000/api/v1/up": 404 Page not found: /api/v1/up`. The frontend is still making backend calls to `localhost` and we need to change that to our API on fly.io.
- `cd ~/app/frontend`
- `touch .env`
- make `~/app/frontend/.env` look like this:
```
API_BASE=http://localhost:3000/api/v1
```
- The only other changes we need to make on the frontend are in `~/app/frontend/nuxt.config.ts`:
  - at the top of the file add these three lines:
```
import dotenv from 'dotenv'
dotenv.config()

```
  - in the top of the file, change the `runtimeConfig: { public: { apiBase: "http://localhost:3000/api/v1" } },` line to (and make sure to replace the `<backend url>` part with the backend url from your `.secrets` file):
```
runtimeConfig: { public: { apiBase: process.env.API_BASE || '<backend url>/api/v1' } },
```
- `fly deploy`
- now go to the frontend url that's in your `.secrets` file <- the app should look the way it looked locally

## Playwright Docker Setup
- `cd ~/app/frontend`
- `touch playwright-package.json`
- make `~/app/frontend/playwright-package.json` look like this:
```
{
  "name": "playwright-tests",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "test": "playwright test"
  },
  "dependencies": {
    "@playwright/test": "^1.48.1",
    "pixelmatch": "^6.0.0",
    "playwright-expect": "^0.1.2",
    "@nuxt/test-utils": "^3.14.4"
  }
}
```
- `touch Dockerfile.playwright` 
- make `~/app/frontend/Dockerfile.playwright` look like this:
```
# Dockerfile.playwright
FROM mcr.microsoft.com/playwright:v1.47.2-focal

WORKDIR /app/frontend

# Copy and install only Playwright-related dependencies
COPY playwright-package.json ./package.json
COPY package-lock.json ./
RUN npm install

# Ensure unwanted test dependencies are removed
RUN rm -rf node_modules/@vitest node_modules/vitest node_modules/jest node_modules/@jest \
    && find node_modules -name "*vitest*" -type d -exec rm -rf {} + \
    && find node_modules -name "*jest*" -type d -exec rm -rf {} +

# Copy application code without overwriting node_modules
COPY . .

# Install Playwright dependencies and browsers
RUN npx playwright install

# Set the default command to run Playwright tests
CMD ["npx", "playwright", "test"]
```
- make `~/app/docker-compose.yml` look like this:
```
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_DB: backend_${RAILS_ENV:-development}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 20s
      timeout: 10s
      retries: 10
    env_file:
      - ./backend/.env

  backend:
    user: "${DOCKER_USER:-circleci}"
    build:
      context: ./backend
      dockerfile: Dockerfile.backend
    image: backend_image
    environment:
      BACKEND_PATH: /app/backend
      RAILS_ENV: ${RAILS_ENV:-development}
      DATABASE_URL: "postgres://postgres:${POSTGRES_PASSWORD}@db:5432/backend_${RAILS_ENV:-development}"
    volumes:
      - ./backend:/app/backend
    working_dir: /app/backend  # Align with WORKDIR in Dockerfile
    ports:
      - '3000:3000'
    depends_on:
      db:
        condition: service_healthy
    command: >
      bash -c '
        rm -f /app/backend/tmp/pids/server.pid &&
        bundle exec rails db:prepare &&
        bundle exec rails s -b 0.0.0.0 -p 3000
      '
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:3000/ || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5
    env_file:
      - ./backend/.env

  rspec:
    image: backend_image
    environment:
      RAILS_ENV: test
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      DATABASE_URL: "postgres://postgres:${POSTGRES_PASSWORD}@db:5432/backend_test"
      SECRET_KEY_BASE: ${SECRET_KEY_BASE}
    volumes:
      - bundle_data:/usr/local/bundle
      - ./backend:/app/backend
    working_dir: /app/backend
    env_file:
      - ./backend/.env
    depends_on:
      db:
        condition: service_healthy
    user: "${DOCKER_USER:-circleci}"
    command: >
      bash -c '
        echo "SECRET_KEY_BASE is: $SECRET_KEY_BASE" && # Debug line to confirm visibility
        ./wait-for-it.sh db:5432 -- bundle exec rails db:drop db:create db:migrate &&
        bundle exec rspec
      '

  frontend:
    build:
      context: ./frontend 
      dockerfile: Dockerfile
    working_dir: /app
    ports:
      - '3001:3000'
    depends_on:
      backend:
        condition: service_healthy
    environment:
      NODE_ENV: production
      API_URL: http://backend:3000
      BASE_URL: http://frontend:3000
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:3000/ || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5

  playwright:
    build:
      context: ./frontend
      dockerfile: Dockerfile.playwright
    working_dir: /app/frontend
    depends_on:
      backend:
        condition: service_started
      frontend:
        condition: service_healthy
      db:
        condition: service_healthy
    environment:
      BASE_URL: http://frontend:3000
      RAILS_ENV: test
      DATABASE_URL: "postgres://postgres:${POSTGRES_PASSWORD}@db:5432/backend_test"
      API_URL: http://backend:3000
      DOCKER_ENV: "${DOCKER_ENV:-false}"  # Default to false if not explicitly set
      CI: "${CI:-false}"  # Explicitly set to false by default in Docker
    command: bash -c "ls -d node_modules/* | grep -E 'vitest|jest' || npx playwright test"
    volumes:
      - ./frontend/spec/e2e/screenshots/baseline:/app/frontend/spec/e2e/screenshots/baseline

volumes:
  postgres_data:
  bundle_data:
  backend_data:
    driver: local
```
- make `~/app/frontend/Dockerfile` look like this:
```
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
```
- make `~/app/frontend/playwright.config.ts` look like this:
```
import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./spec/e2e",
  outputDir: "./spec/e2e/videos",
  use: { video: "on", baseURL: process.env.BASE_URL || 'http://localhost:3001' },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } }
  ],
});
```
- `cd ~/app`
- `docker compose down -v --remove-orphans`
- `docker compose build --no-cache`
- `docker compose up -d db backend frontend`
- `docker compose run --rm playwright` <- playwright tests should pass

### Add Playwright To CircleCI
- `cd ~/app/frontend`
- `npm install --save-dev wait-on`
- `cd ~/app`
- make `.circleci/config.yml` look like this:
```
version: 2.1

executors:
  ubuntu_machine_executor:
    machine:
      image: ubuntu-2004:current

commands:
  install_docker_compose:
    steps:
      - run:
          name: Install Docker Compose
          command: |
            DOCKER_COMPOSE_VERSION=2.20.2
            sudo curl -L "https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
            sudo chmod +x /usr/local/bin/docker-compose
            docker-compose version

  create_env_file:
    steps:
      - run:
          name: Create .env File
          command: |
            echo "POSTGRES_PASSWORD=${POSTGRES_PASSWORD}" > backend/.env
            echo "RAILS_ENV=test" >> backend/.env
      - run:
          name: Display .env for Verification
          command: cat backend/.env

  ensure_permissions:
    steps:
      - run:
          name: Ensure Permissions for Backend Files
          command: |
            chmod -R 777 backend/log
            chmod -R 777 backend/tmp
            chmod +x backend/wait-for-it.sh
            touch backend/log/test.log
            touch backend/tmp/local_secret.txt
            chmod 666 backend/log/test.log
            chmod 666 backend/tmp/local_secret.txt

  build_backend_image:
    steps:
      - run:
          name: Build Backend Image
          command: docker build --no-cache -t backend_image -f backend/Dockerfile.backend backend

jobs:
  rspec:
    executor: ubuntu_machine_executor
    steps:
      - checkout
      - install_docker_compose
      - create_env_file
      - ensure_permissions
      - build_backend_image
      - run:
          name: Confirm .env File Exists in Docker
          command: docker-compose run --rm rspec ls -l /app/backend/.env
      - run:
          name: Check First Few Characters of SECRET_KEY_BASE
          command: echo "SECRET_KEY_BASE=${SECRET_KEY_BASE:0:6}"
      - run:
          name: Adjust Backend Folder Permissions on Host
          command: sudo chmod -R 777 /home/circleci/project/backend
      - run:
          name: Remove Existing Containers (if any)
          command: docker-compose down -v
      - run:
          name: Run RSpec Tests
          command: |
            cd backend
            docker-compose up --no-build --abort-on-container-exit rspec
      - run:
          name: Verify Permissions Inside Backend Container
          command: |
            docker-compose run --rm rspec bash -c 'ls -la /app/backend/log /app/backend/tmp'
      - store_test_results:
          path: backend/tmp/rspec_results
      - store_artifacts:
          path: backend/log

  playwright:
    machine:
      image: ubuntu-2004:current
    environment:
      CI: true
      DOCKER_ENV: false # Explicitly set to false in CI environment
    steps:
      - checkout

      - run:
          name: Set Absolute Path for Backend Directory
          command: |
            export BACKEND_PATH=$(pwd)/backend
            echo "export BACKEND_PATH=${BACKEND_PATH}" >> $BASH_ENV

      - install_docker_compose

      - run:
          name: Verify POSTGRES_PASSWORD
          command: |
            if [ -z "${POSTGRES_PASSWORD}" ]; then
              echo "Error: POSTGRES_PASSWORD is not set."
              exit 1
            else
              echo "POSTGRES_PASSWORD is set."
            fi

      - create_env_file
      - build_backend_image

      - run:
          name: Ensure Executable Permissions on wait-for-it.sh
          command: |
            chmod +x backend/wait-for-it.sh

      - ensure_permissions

      - run:
          name: Adjust Backend Folder Permissions on Host
          command: sudo chmod -R 777 /home/circleci/project/backend

      - run:
          name: Set DOCKER_ENV to False in CI
          command: |
            echo "DOCKER_ENV=false" >> $BASH_ENV
            source $BASH_ENV

      - run:
          name: Check CI and DOCKER_ENV Values
          command: |
            echo "CI=$CI, DOCKER_ENV=$DOCKER_ENV"

      - run:
          name: Run Backend and Frontend Services
          command: |
            docker-compose up -d db backend frontend

      - run:
          name: Wait for Backend to be Ready
          command: |
            ./backend/wait-for-it.sh localhost:3000 -t 60 -- echo "Backend is ready"

      - run:
          name: Run Playwright Tests
          command: |
            docker-compose up --abort-on-container-exit playwright

      - store_artifacts:
          path: frontend/spec/e2e/screenshots/baseline/ci
          destination: images_baseline_ci

      - store_artifacts:
          path: frontend/spec/e2e/screenshots/baseline/docker
          destination: images_baseline_docker

      - store_artifacts:
          path: frontend/spec/e2e/screenshots/baseline/local
          destination: images_baseline_local

      - store_artifacts:
          path: frontend/spec/e2e/screenshots/current
          destination: images_current

      - store_artifacts:
          path: frontend/spec/e2e/screenshots/diff
          destination: images_diffs

      - store_artifacts:
          path: frontend/spec/e2e/videos
          destination: videos

workflows:
  version: 2
  test:
    jobs:
      - rspec
      - playwright

```
- `git add .` 
- `git commit -m "Add circleci"`
- `git push`
- check the project CircleCI dashboard - a test will run and both rspec and playwright should pass

### Add Header/Footer Component Specs
- Now let's build some component specs for the header and footer we're about to build.
- `cd ~/app/frontend`
- `mkdir spec/components`
- `touch spec/components/Header.nuxt.spec.js spec/components/Footer.nuxt.spec.js`
- make `~/app/frontend/specs/components/Header.nuxt.spec.js` look like this:
```
import { Header } from '#components'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeAll, describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('Header component', () => {
  let header

  beforeAll(async () => {
    header = await mountSuspended(Header)
    await flushPromises()
  })

  it('has a main navigation', async () => {
    const mainNav = await header.find('nav.header-main-nav')
    expect(mainNav.exists()).toBe(true)
  })

  it('contains correct main navigation links', async () => {
    const mainNav = await header.find('nav.header-main-nav')
    expect(mainNav.exists()).toBe(true)

    const homeLink = mainNav.find('a[href="/"]')
    expect(homeLink.exists()).toBe(true)
    expect(homeLink.text()).toContain('Home')

    const publicLink = mainNav.find('a[href="/public"]')
    expect(publicLink.exists()).toBe(true)
    expect(publicLink.text()).toContain('Public')
  })

  it('has a login navigation', async () => {
    const loginNav = await header.find('.header-login-nav')
    expect(loginNav.exists()).toBe(true)
  })

  it('contains correct login navigation links', async () => {
    const loginNav = await header.find('.header-login-nav')
    expect(loginNav.exists()).toBe(true)

    const loginLink = loginNav.find('a[href="/login"]')
    expect(loginLink.exists()).toBe(true)
    expect(loginLink.text()).toContain('Log in')

    const signupLink = loginNav.find('a[href="/signup"]')
    expect(signupLink.exists()).toBe(true)
    expect(signupLink.text()).toContain('Sign up')
  })
})
```
- make `~/app/frontend/specs/components/Footer.nuxt.spec.js` look like this:
```
import { Footer } from '#components';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { expect, it } from "vitest";

it('can mount some component', async () => {
    const component = await mountSuspended(Footer)
    expect(component.text()).toMatchInlineSnapshot(
        '"© 2025. Made with Nuxt, Tailwind, UI Thing, Rails, Fly.io and S3."'
    )
})
```
- `npm run component-tests` -> header & footer tests should fail

### Add Header/Footer End-To-End Tests To shared.js
- Our next big step is to add a header and footer to the site. But before that we'll update our homepage spec (which will then fail until the header/footer are build - which is what we want) and build out some component specs for the header and footer.
- `cd ~/app/frontend`
- make `~/app/frontend/spec/e2e/shared.js` look like this:
```
// shared.js
import { promises as fs } from 'fs';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

// Sets baseline directory based on environment
const getBaselineDir = () => {
  const ciValue = process.env.CI || 'undefined'
  const dockerValue = process.env.DOCKER_ENV || 'undefined'
  console.log(`CI: ${ciValue}, DOCKER_ENV: ${dockerValue}`)
  if (process.env.CI === 'true') return 'spec/e2e/screenshots/baseline/ci'
  if (process.env.DOCKER_ENV === 'true') return 'spec/e2e/screenshots/baseline/docker'
  return 'spec/e2e/screenshots/baseline/local'
}

// Main function to compare screenshots, accepting a dynamic URL
export async function compareScreenshot(page, testName, { browserName = 'chromium', targetUrl }) {
  const baselineDir = getBaselineDir();
  const baselinePath = `${baselineDir}/${testName}.png`;
  const screenshotPath = `spec/e2e/screenshots/current/${testName}.png`;

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(targetUrl); // Use the provided target URL
  await fs.mkdir('spec/e2e/screenshots/current', { recursive: true });
  await page.screenshot({ path: screenshotPath });

  const baselineExists = await fs.access(baselinePath).then(() => true).catch(() => false);

  // Create baseline if not found
  if (!baselineExists && browserName === 'chromium') {
    console.log('Baseline image not found. Creating new baseline...');
    await fs.mkdir(baselineDir, { recursive: true });
    await fs.copyFile(screenshotPath, baselinePath);
    console.log('New baseline image created at:', baselinePath);
  }

  if (baselineExists) {
    const baselineImage = PNG.sync.read(await fs.readFile(baselinePath));
    const currentImage = PNG.sync.read(await fs.readFile(screenshotPath));

    const { width, height } = baselineImage;
    const diff = new PNG({ width, height });
    const pixelDiffCount = pixelmatch(
      baselineImage.data,
      currentImage.data,
      diff.data,
      width,
      height,
      { threshold: 0.1 }
    );

    if (pixelDiffCount > 0) {
      const diffPath = `spec/e2e/screenshots/diff/${testName}-diff.png`;
      await fs.mkdir('spec/e2e/screenshots/diff', { recursive: true });
      await fs.writeFile(diffPath, PNG.sync.write(diff));
      console.log(`Difference found! Diff image saved at ${diffPath}`);
    }

    return pixelDiffCount;
  }

  return 0;
}

// Header details verification
export async function verifyHeaderDetails(page, expect) {
  const homeLink = page.getByTestId('header-link-home');
  const publicLink = page.getByTestId('header-link-public');
  const privateLink = page.getByTestId('header-link-private');

  await expect(homeLink).toBeVisible({ timeout: 30000 });
  await expect(homeLink).toHaveText('Home');
  await expect(homeLink).toHaveAttribute('href', '/');
  await expect(publicLink).toBeVisible();
  await expect(publicLink).toHaveText('Public');
  await expect(publicLink).toHaveAttribute('href', '/public');
  await expect(privateLink).toBeVisible();
  await expect(privateLink).toHaveText('Private');
  await expect(privateLink).toHaveAttribute('href', '/private');
}

// Footer details verification
export async function verifyFooterDetails(page, expect) {
  const footerP = page.getByTestId('footer-p');
  await expect(footerP).toBeVisible({ timeout: 30000 });
  await expect(footerP).toHaveText('© 2025. Made with Nuxt, Tailwind, UI Thing, Rails, Fly.io and S3.');

  const nuxtLink = footerP.locator('a', { hasText: 'Nuxt' });
  await expect(nuxtLink).toHaveAttribute('href', 'https://nuxt.com');
  const tailwindLink = footerP.locator('a', { hasText: 'Tailwind' });
  await expect(tailwindLink).toHaveAttribute('href', 'https://tailwindcss.com/');
  const uiThingLink = footerP.locator('a', { hasText: 'UI Thing' });
  await expect(uiThingLink).toHaveAttribute('href', 'https://ui-thing.behonbaker.com');
  const railsLink = footerP.locator('a', { hasText: 'Rails' });
  await expect(railsLink).toHaveAttribute('href', 'https://rubyonrails.org/');
  const flyLink = footerP.locator('a', { hasText: 'Fly.io' });
  await expect(flyLink).toHaveAttribute('href', 'https://fly.io');
  const s3Link = footerP.locator('a', { hasText: 'S3' });
  await expect(s3Link).toHaveAttribute('href', 'https://aws.amazon.com/s3/');
}
```

### Add Header/Footer End-To-End Tests to Home Spec
- `cd ~/app/frontend`
- make `~/app/frontend/spec/e2e/home.spec.ts` look like this:
```
// home.spec.ts
import { test, expect } from '@playwright/test';
import { compareScreenshot, verifyHeaderDetails, verifyFooterDetails } from './shared';

test('Header details', async ({ page }) => {
  await page.goto('/');
  await verifyHeaderDetails(page, expect);
});

test('Homepage body text', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('hero-h1').filter({ hasText: 'There was a wall.' })).toBeVisible({ timeout: 30000 });
  await expect(page.getByTestId('hero-h1').filter({ hasText: 'It did not look important.' })).toBeVisible();
  await expect(page.getByTestId('hero-p').filter({ hasText: '{"status":"OK"}' })).toBeVisible();
  await expect(page.getByTestId('hero-link-login').filter({ hasText: 'Log in' })).toBeVisible();
});

test('Footer details', async ({ page }) => {
  await page.goto('/');
  await verifyFooterDetails(page, expect);
});

test('current screenshot matches baseline', async ({ page, browserName }) => {
  const pixelDiffCount = await compareScreenshot(page, 'home', { browserName, targetUrl: '/' })
  expect(pixelDiffCount).toBe(0)
})
```
- Let's run our homepage spec and make sure it fails.
- `npm run e2e-tests --path=spec/e2e/home.spec.js` -> should fail
- `^ + c`

### Header & Footer
- Let's finally build out our header and footer components.
- `cd ~/app/frontend`
- `npx ui-thing@latest add container navigation-menu sheet scroll-area collapsible`
- `touch components/Logo.vue components/Header.vue components/Footer.vue`
- make `~/app/frontend/components/Logo.vue` look like this:
```
<template>
  <NuxtLink to="/" class="flex items-center gap-3">
    <!-- from https://www.untitledui.com/logos -->
    <svg fill="none" height="48" viewBox="0 0 168 48" width="168" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><clipPath id="a"><path d="m0 0h40v48h-40z" /></clipPath><g clip-path="url(#a)" fill="#ff4405"><path d="m25.0887 5.05386-3.933-1.05386-3.3145 12.3696-2.9923-11.16736-3.9331 1.05386 3.233 12.0655-8.05262-8.0526-2.87919 2.8792 8.83271 8.8328-10.99975-2.9474-1.05385625 3.933 12.01860625 3.2204c-.1376-.5935-.2104-1.2119-.2104-1.8473 0-4.4976 3.646-8.1436 8.1437-8.1436 4.4976 0 8.1436 3.646 8.1436 8.1436 0 .6313-.0719 1.2459-.2078 1.8359l10.9227 2.9267 1.0538-3.933-12.0664-3.2332 11.0005-2.9476-1.0539-3.933-12.0659 3.233 8.0526-8.0526-2.8792-2.87916-8.7102 8.71026z" /><path d="m27.8723 26.2214c-.3372 1.4256-1.0491 2.7063-2.0259 3.7324l7.913 7.9131 2.8792-2.8792z" /><path d="m25.7665 30.0366c-.9886 1.0097-2.2379 1.7632-3.6389 2.1515l2.8794 10.746 3.933-1.0539z" /><path d="m21.9807 32.2274c-.65.1671-1.3313.2559-2.0334.2559-.7522 0-1.4806-.102-2.1721-.2929l-2.882 10.7558 3.933 1.0538z" /><path d="m17.6361 32.1507c-1.3796-.4076-2.6067-1.1707-3.5751-2.1833l-7.9325 7.9325 2.87919 2.8792z" /><path d="m13.9956 29.8973c-.9518-1.019-1.6451-2.2826-1.9751-3.6862l-10.95836 2.9363 1.05385 3.933z" /></g><g fill="#0c111d"><path d="m50 33v-18.522h3.699l7.452 9.99c.108.126.243.306.405.54.162.216.315.432.459.648s.243.387.297.513h.135c0-.306 0-.603 0-.891 0-.306 0-.576 0-.81v-9.99h3.807v18.522h-3.699l-7.614-10.233c-.18-.252-.369-.531-.567-.837s-.342-.54-.432-.702h-.135v.81.729 10.233z" /><path d="m68.9515 16.719v-3.24h3.753v3.24zm0 16.281v-14.202h3.753v14.202z" /><path d="m81.5227 33.324c-1.566 0-2.88-.261-3.942-.783-1.062-.54-1.863-1.359-2.403-2.457s-.81-2.493-.81-4.185c0-1.71.27-3.105.81-4.185.54-1.098 1.332-1.908 2.376-2.43 1.062-.54 2.358-.81 3.888-.81 1.44 0 2.655.261 3.645.783.99.504 1.737 1.296 2.241 2.376.504 1.062.756 2.439.756 4.131v.972h-9.909c.036.828.162 1.53.378 2.106.234.576.585 1.008 1.053 1.296.486.27 1.125.405 1.917.405.432 0 .819-.054 1.161-.162.36-.108.666-.27.918-.486s.45-.486.594-.81.216-.693.216-1.107h3.672c0 .9-.162 1.683-.486 2.349s-.774 1.224-1.35 1.674c-.576.432-1.269.765-2.079.999-.792.216-1.674.324-2.646.324zm-3.294-8.964h5.994c0-.54-.072-1.008-.216-1.404-.126-.396-.306-.72-.54-.972s-.522-.432-.864-.54c-.324-.126-.693-.189-1.107-.189-.684 0-1.26.117-1.728.351-.45.216-.801.558-1.053 1.026-.234.45-.396 1.026-.486 1.728z" /><path d="m93.9963 33.324c-.9 0-1.629-.162-2.187-.486s-.963-.756-1.215-1.296c-.252-.558-.378-1.17-.378-1.836v-8.019h-1.755v-2.889h1.89l.702-4.05h2.916v4.05h2.592v2.889h-2.592v7.398c0 .432.099.765.297.999.198.216.522.324.972.324h1.323v2.484c-.216.072-.468.135-.756.189-.288.072-.594.126-.918.162-.324.054-.621.081-.891.081z" /><path d="m96.7988 33v-1.593l6.9392-9.72h-6.5072v-2.889h11.9342v1.539l-6.966 9.747h7.236v2.916z" /><path d="m116.578 33.324c-.99 0-1.881-.108-2.673-.324s-1.467-.513-2.025-.891c-.558-.396-.99-.864-1.296-1.404-.288-.54-.432-1.152-.432-1.836 0-.072 0-.144 0-.216s.009-.126.027-.162h3.618v.108.108c.018.45.162.819.432 1.107.27.27.621.468 1.053.594.45.126.918.189 1.404.189.432 0 .846-.036 1.242-.108.414-.09.756-.243 1.026-.459.288-.216.432-.495.432-.837 0-.432-.18-.765-.54-.999-.342-.234-.801-.423-1.377-.567-.558-.144-1.17-.306-1.836-.486-.612-.144-1.224-.306-1.836-.486-.612-.198-1.17-.45-1.674-.756-.486-.306-.882-.702-1.188-1.188-.306-.504-.459-1.134-.459-1.89 0-.738.162-1.377.486-1.917.324-.558.765-1.017 1.323-1.377.576-.36 1.242-.621 1.998-.783.774-.18 1.602-.27 2.484-.27.828 0 1.602.09 2.322.27.72.162 1.35.414 1.89.756.54.324.963.738 1.269 1.242.306.486.459 1.035.459 1.647v.351c0 .108-.009.18-.027.216h-3.591v-.216c0-.324-.099-.594-.297-.81-.198-.234-.486-.414-.864-.54-.36-.126-.801-.189-1.323-.189-.36 0-.693.027-.999.081-.288.054-.54.135-.756.243s-.387.243-.513.405c-.108.144-.162.324-.162.54 0 .306.126.558.378.756.27.18.621.333 1.053.459s.909.261 1.431.405c.648.18 1.323.36 2.025.54.72.162 1.386.387 1.998.675s1.107.702 1.485 1.242c.378.522.567 1.233.567 2.133 0 .864-.171 1.593-.513 2.187-.324.594-.783 1.071-1.377 1.431s-1.287.621-2.079.783-1.647.243-2.565.243z" /><path d="m130.987 33.324c-1.512 0-2.781-.261-3.807-.783-1.026-.54-1.809-1.359-2.349-2.457-.522-1.116-.783-2.511-.783-4.185 0-1.71.261-3.105.783-4.185.54-1.098 1.323-1.917 2.349-2.457 1.044-.54 2.313-.81 3.807-.81.972 0 1.845.117 2.619.351.792.234 1.476.594 2.052 1.08s1.008 1.089 1.296 1.809c.306.702.459 1.539.459 2.511h-3.753c0-.648-.099-1.179-.297-1.593s-.504-.729-.918-.945c-.396-.216-.9-.324-1.512-.324-.72 0-1.305.162-1.755.486s-.783.801-.999 1.431-.324 1.413-.324 2.349v.621c0 .918.108 1.692.324 2.322.234.63.585 1.107 1.053 1.431.468.306 1.08.459 1.836.459.612 0 1.116-.108 1.512-.324.414-.216.729-.54.945-.972s.324-.954.324-1.566h3.564c0 .918-.153 1.737-.459 2.457-.288.72-.72 1.323-1.296 1.809-.558.486-1.233.855-2.025 1.107s-1.674.378-2.646.378z" /><path d="m139.147 33v-19.521h3.753v6.885h.189c.306-.378.666-.702 1.08-.972.432-.288.909-.513 1.431-.675.54-.162 1.125-.243 1.755-.243.936 0 1.755.171 2.457.513s1.242.882 1.62 1.62c.396.738.594 1.701.594 2.889v9.504h-3.753v-8.91c0-.45-.054-.828-.162-1.134-.108-.324-.27-.585-.486-.783-.198-.216-.45-.369-.756-.459s-.648-.135-1.026-.135c-.558 0-1.062.135-1.512.405s-.801.639-1.053 1.107-.378 1.008-.378 1.62v8.289z" /><path d="m160.762 33.324c-1.566 0-2.88-.261-3.942-.783-1.062-.54-1.863-1.359-2.403-2.457s-.81-2.493-.81-4.185c0-1.71.27-3.105.81-4.185.54-1.098 1.332-1.908 2.376-2.43 1.062-.54 2.358-.81 3.888-.81 1.44 0 2.655.261 3.645.783.99.504 1.737 1.296 2.241 2.376.504 1.062.756 2.439.756 4.131v.972h-9.909c.036.828.162 1.53.378 2.106.234.576.585 1.008 1.053 1.296.486.27 1.125.405 1.917.405.432 0 .819-.054 1.161-.162.36-.108.666-.27.918-.486s.45-.486.594-.81.216-.693.216-1.107h3.672c0 .9-.162 1.683-.486 2.349s-.774 1.224-1.35 1.674c-.576.432-1.269.765-2.079.999-.792.216-1.674.324-2.646.324zm-3.294-8.964h5.994c0-.54-.072-1.008-.216-1.404-.126-.396-.306-.72-.54-.972s-.522-.432-.864-.54c-.324-.126-.693-.189-1.107-.189-.684 0-1.26.117-1.728.351-.45.216-.801.558-1.053 1.026-.234.45-.396 1.026-.486 1.728z" /></g>
    </svg>
  </NuxtLink>
</template>
```
- make `~/app/frontend/components/Header.vue` look like this:
```
<template>
  <header class="z-20 border-b bg-background/90 backdrop-blur">
    <UiContainer class="flex h-16 items-center justify-between md:h-20">
      <div class="flex items-center gap-10">
        <Logo />
        <UiNavigationMenu as="nav" class="header-main-nav hidden items-center justify-start gap-8 md:flex">
          <UiNavigationMenuList class="gap-2">
            <UiNavigationMenuItem>
              <UiNavigationMenuLink as-child>
                <UiThingDataButtonWrapper data-testid="header-link-home" to="/" variant="ghost" size="sm">
                  Home
                </UiThingDataButtonWrapper>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
            <UiNavigationMenuItem>
              <UiNavigationMenuLink as-child>
                <UiThingDataButtonWrapper data-testid="header-link-public" to="/public" variant="ghost" size="sm">
                  Public
                </UiThingDataButtonWrapper>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
            <UiNavigationMenuItem>
              <UiNavigationMenuLink as-child>
                <UiThingDataButtonWrapper data-testid="header-link-private" to="/private" variant="ghost" size="sm">
                  Private
                </UiThingDataButtonWrapper>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
          </UiNavigationMenuList>
        </UiNavigationMenu>
      </div>
      <div class="md:hidden">
        <UiSheet>
          <UiSheetTrigger as-child>
            <UiButton variant="ghost" size="icon-sm">
              <Icon name="lucide:menu" class="h-5 w-5" />
            </UiButton>
            <UiSheetContent class="w-[90%] p-0">
              <UiSheetTitle class="sr-only" title="Mobile menu" />
              <UiSheetDescription class="sr-only" description="Mobile menu" />
              <UiSheetX class="z-20" />

              <UiScrollArea class="h-full p-5">
                <div class="flex flex-col gap-2">
                  <UiButton variant="ghost" class="justify-start text-base" to="/">
                    Home
                  </UiButton>
                  <UiButton variant="ghost" class="justify-start text-base" to="/public">
                    Public
                  </UiButton>
                  <UiButton variant="ghost" class="justify-start text-base" to="/private">
                    Private
                  </UiButton>
                  <UiGradientDivider class="my-5" />
                  <UiButton to="#">
                    Sign up
                  </UiButton>
                  <UiButton variant="outline" to="#">
                    Log in
                  </UiButton>
                </div>
              </UiScrollArea>
            </UiSheetContent>
          </UiSheetTrigger>
        </UiSheet>
      </div>
      <div class="header-login-nav hidden items-center gap-3 md:flex">
        <UiThingDataButtonWrapper data-testid="header-link-login" to="/login" variant="ghost" size="sm">
          Log in
        </UiThingDataButtonWrapper>
        <UiThingDataButtonWrapper data-testid="header-link-signup" to="/signup" variant="ghost" size="sm">
          Sign up
        </UiThingDataButtonWrapper>
      </div>
    </UiContainer>
  </header>
</template>
```
- make `~/app/frontend/components/Footer.vue` look like this:
```
<template>
  <footer>
    <UiContainer as="footer" class="py-16 lg:py-24">
      <section class="flex flex-col justify-between gap-5 pt-8 lg:flex-row">
        <p data-testid="footer-p" class="text-muted-foreground">
          &copy; {{ new Date().getFullYear() }}. Made with
          <a class="hover:underline" href="https://nuxt.com">Nuxt</a>,
          <a class="hover:underline" href="https://tailwindcss.com/">Tailwind</a>,
          <a class="hover:underline" href="https://ui-thing.behonbaker.com">UI Thing</a>,
          <a class="hover:underline" href="https://rubyonrails.org/">Rails</a>,
          <a class="hover:underline" href="https://fly.io">Fly.io</a> and
          <a class="hover:underline" href="https://aws.amazon.com/s3/">S3</a>.
        </p>
      </section>
    </UiContainer>
  </footer>
</template>
```
- make `~/app/frontend/app.vue` look like this:
```
<template>
  <Header />
  <main>
    <NuxtPage />
  </main>
  <Footer />
</template>
```
- `npm run front-and-back-dev`-> Should be our homepage from before, but now also with a header and footer section
- `^ + c`
- now that we've changed the way our homepage looks again, we'll have to delete our pixelmatch baseline homepage image, which is `~/app/frontend/spec/e2e/screenshots/baseline/local/home.png` so it will take a new baseline image screenshot to compare to going forward.
- `npm run component-tests` -> header and footer component tests should pass
- `npm run e2e-tests` -> homepage end-to-end test should also pass
- `^ + c`

### Docker Component Test Setup
- Now that our local component and end-to-end tests are passing, let's add our component tests to docker.
- `cd ~/app`
- `touch frontend/Dockerfile.component-tests`
- make `~/app/frontend/Dockerfile.component-tests` look like this:
```
FROM mcr.microsoft.com/playwright:v1.47.2-focal
FROM mcr.microsoft.com/playwright:v1.47.2-focal

WORKDIR /app/frontend

# Copy package.json and lock file
COPY package.json package-lock.json ./

# Install all dependencies including dev
RUN rm -rf node_modules
RUN npm ci --include=dev

# Copy application code
COPY . .

# Set the command for component tests
CMD ["npm", "run", "component-tests"]
```
- make `~/app/docker-compose.yml` look like this:
```
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_DB: backend_${RAILS_ENV:-development}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 20s
      timeout: 10s
      retries: 10

  backend:
    user: "${DOCKER_USER:-circleci}"
    build:
      context: ./backend
      dockerfile: Dockerfile.backend
    image: backend_image
    environment:
      BACKEND_PATH: /app/backend
      RAILS_ENV: ${RAILS_ENV:-development}
      DATABASE_URL: "postgres://postgres:${POSTGRES_PASSWORD}@db:5432/backend_${RAILS_ENV:-development}"
    volumes:
      - ./backend:/app/backend
    working_dir: /app/backend  # Align with WORKDIR in Dockerfile
    ports:
      - '3000:3000'
    depends_on:
      db:
        condition: service_healthy
    command: >
      bash -c '
        rm -f /app/backend/tmp/pids/server.pid &&
        bundle exec rails db:prepare &&
        bundle exec rails s -b 0.0.0.0 -p 3000
      '
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:3000/ || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5

  rspec:
    image: backend_image
    environment:
      RAILS_ENV: test
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      DATABASE_URL: "postgres://postgres:${POSTGRES_PASSWORD}@db:5432/backend_test"
      SECRET_KEY_BASE: ${SECRET_KEY_BASE}
    volumes:
      - bundle_data:/usr/local/bundle
      - ./backend:/app/backend
    working_dir: /app/backend
    env_file:
      - ./backend/.env
    depends_on:
      db:
        condition: service_healthy
    user: "${DOCKER_USER:-circleci}"
    command: >
      bash -c '
        echo "SECRET_KEY_BASE is: $SECRET_KEY_BASE" && # Debug line to confirm visibility
        ./wait-for-it.sh db:5432 -- bundle exec rails db:drop db:create db:migrate &&
        bundle exec rspec
      '

  frontend:
    build:
      context: ./frontend 
      dockerfile: Dockerfile
    working_dir: /app
    ports:
      - '3001:3000'
    depends_on:
      backend:
        condition: service_healthy
    environment:
      NODE_ENV: production
      API_URL: http://backend:3000
      BASE_URL: http://frontend:3000
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:3000/ || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5

  playwright:
    build:
      context: ./frontend
      dockerfile: Dockerfile.playwright
    working_dir: /app/frontend
    depends_on:
      backend:
        condition: service_started
      frontend:
        condition: service_healthy
      db:
        condition: service_healthy
    environment:
      BASE_URL: http://frontend:3000
      RAILS_ENV: test
      DATABASE_URL: "postgres://postgres:${POSTGRES_PASSWORD}@db:5432/backend_test"
      API_URL: http://backend:3000
      DOCKER_ENV: "${DOCKER_ENV:-false}"  # Default to false if not explicitly set
      CI: "${CI:-false}"  # Explicitly set to false by default in Docker
    command: bash -c "ls -d node_modules/* | grep -E 'vitest|jest' || npx playwright test"
    volumes:
      - ./frontend/spec/e2e/screenshots/baseline:/app/frontend/spec/e2e/screenshots/baseline

  component-tests:
    build:
      context: ./frontend
      dockerfile: Dockerfile.component-tests
    working_dir: /app/frontend
    environment:
      BASE_URL: http://frontend:3000
    command: ["npm", "run", "component-tests"]

volumes:
  postgres_data:
  bundle_data:
  backend_data:
    driver: local
```

### Run Docker Component Tests
- `cd ~/app`
- `docker compose down -v --remove-orphans`
- `docker volume ls`
- `docker compose build`
- `docker compose up -d frontend component-tests`
- `docker compose ps` <- should see frontend and component-tests services running
- `docker compose run --rm component-tests` <-- should pass

### Add Component Tests To CircleCI
- make `~/app/.circleci/config.yml` look like this:
```
version: 2.1

executors:
  ubuntu_machine_executor:
    machine:
      image: ubuntu-2004:current

commands:
  install_docker_compose:
    steps:
      - run:
          name: Install Docker Compose
          command: |
            DOCKER_COMPOSE_VERSION=2.20.2
            sudo curl -L "https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
            sudo chmod +x /usr/local/bin/docker-compose
            docker-compose version

  create_env_file:
    steps:
      - run:
          name: Create .env File
          command: |
            echo "POSTGRES_PASSWORD=${POSTGRES_PASSWORD}" > backend/.env
            echo "RAILS_ENV=test" >> backend/.env
      - run:
          name: Display .env for Verification
          command: cat backend/.env

  ensure_permissions:
    steps:
      - run:
          name: Ensure Permissions for Backend Files
          command: |
            chmod -R 777 backend/log
            chmod -R 777 backend/tmp
            chmod +x backend/wait-for-it.sh
            touch backend/log/test.log
            touch backend/tmp/local_secret.txt
            chmod 666 backend/log/test.log
            chmod 666 backend/tmp/local_secret.txt

  build_backend_image:
    steps:
      - run:
          name: Build Backend Image
          command: docker build --no-cache -t backend_image -f backend/Dockerfile.backend backend

jobs:
  rspec:
    executor: ubuntu_machine_executor
    steps:
      - checkout
      - install_docker_compose
      - create_env_file
      - ensure_permissions
      - build_backend_image
      - run:
          name: Confirm .env File Exists in Docker
          command: docker-compose run --rm rspec ls -l /app/backend/.env
      - run:
          name: Check First Few Characters of SECRET_KEY_BASE
          command: echo "SECRET_KEY_BASE=${SECRET_KEY_BASE:0:6}"
      - run:
          name: Adjust Backend Folder Permissions on Host
          command: sudo chmod -R 777 /home/circleci/project/backend
      - run:
          name: Remove Existing Containers (if any)
          command: docker-compose down -v
      - run:
          name: Run RSpec Tests
          command: |
            cd backend
            docker-compose up --no-build --abort-on-container-exit rspec
      - run:
          name: Verify Permissions Inside Backend Container
          command: |
            docker-compose run --rm rspec bash -c 'ls -la /app/backend/log /app/backend/tmp'
      - store_test_results:
          path: backend/tmp/rspec_results
      - store_artifacts:
          path: backend/log

  playwright:
    machine:
      image: ubuntu-2004:current
    environment:
      CI: true
      DOCKER_ENV: false # Explicitly set to false in CI environment
    steps:
      - checkout

      - run:
          name: Set Absolute Path for Backend Directory
          command: |
            export BACKEND_PATH=$(pwd)/backend
            echo "export BACKEND_PATH=${BACKEND_PATH}" >> $BASH_ENV

      - install_docker_compose

      - run:
          name: Verify POSTGRES_PASSWORD
          command: |
            if [ -z "${POSTGRES_PASSWORD}" ]; then
              echo "Error: POSTGRES_PASSWORD is not set."
              exit 1
            else
              echo "POSTGRES_PASSWORD is set."
            fi

      - create_env_file
      - build_backend_image

      - run:
          name: Ensure Executable Permissions on wait-for-it.sh
          command: |
            chmod +x backend/wait-for-it.sh

      - ensure_permissions

      - run:
          name: Adjust Backend Folder Permissions on Host
          command: sudo chmod -R 777 /home/circleci/project/backend

      - run:
          name: Set DOCKER_ENV to False in CI
          command: |
            echo "DOCKER_ENV=false" >> $BASH_ENV
            source $BASH_ENV

      - run:
          name: Check CI and DOCKER_ENV Values
          command: |
            echo "CI=$CI, DOCKER_ENV=$DOCKER_ENV"

      - run:
          name: Run Backend and Frontend Services
          command: |
            docker-compose up -d db backend frontend

      - run:
          name: Wait for Backend to be Ready
          command: |
            ./backend/wait-for-it.sh localhost:3000 -t 60 -- echo "Backend is ready"

      - run:
          name: Run Playwright Tests
          command: |
            docker-compose up --abort-on-container-exit playwright

      - store_artifacts:
          path: frontend/spec/e2e/screenshots/baseline/ci
          destination: images_baseline_ci

      - store_artifacts:
          path: frontend/spec/e2e/screenshots/baseline/docker
          destination: images_baseline_docker

      - store_artifacts:
          path: frontend/spec/e2e/screenshots/baseline/local
          destination: images_baseline_local

      - store_artifacts:
          path: frontend/spec/e2e/screenshots/current
          destination: images_current

      - store_artifacts:
          path: frontend/spec/e2e/screenshots/diff
          destination: images_diffs

      - store_artifacts:
          path: frontend/spec/e2e/videos
          destination: videos

  component-tests:
    machine:
      image: ubuntu-2004:current
    steps:
      - checkout
      - create_env_file

      - run:
          name: Install Docker Compose
          command: |
            DOCKER_COMPOSE_VERSION=2.20.2
            sudo curl -L "https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
            sudo chmod +x /usr/local/bin/docker-compose
            docker-compose version

      - run:
          name: Run Component Tests
          command: |
            docker-compose up --abort-on-container-exit component-tests

      - store_test_results:
          path: frontend/test-results

      - store_artifacts:
          path: frontend/log

workflows:
  version: 2
  test:
    jobs:
      - rspec
      - component-tests
      - playwright
```
- `git add .`
- `git commit -m "Add component tests to CircleCI"`
- `git push`
- check the CircleCI project dashboard and the `component-tests` job should pass

### Subpages E2E Specs
- We're going to add a couple subpages, one at `/public` and another at `/private`. But we'll write some specs for them first.
- `cd ~/app/frontend`
- `touch spec/e2e/public.spec.js spec/e2e/private.spec.js`
- make `~/app/frontend/specs/e2e/public.spec.js` look like this:
```
import { test, expect } from '@playwright/test'
import { compareScreenshot, verifyHeaderDetails, verifyFooterDetails } from './shared'

test.describe('Public Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/public')
  })

  test('links correctly from homepage', async ({ page }) => {
    const homePage = await page.context().newPage()
    await homePage.goto('/')
    const publicLink = await homePage.locator('a[href="/public"]')
    await publicLink.click()
    await page.waitForLoadState('load')
    expect(page.url()).toContain('/public')
    const h1 = (await page.locator('h1'))
    await expect(h1).not.toHaveText('404')
  })

  test('has correct header links', async ({ page }) => {
    await verifyHeaderDetails(page, expect)
  })

  test('displays the correct first p tag text', async ({ page }) => {
    const firstP = page.locator('.page p').first()
    expect(await firstP.isVisible()).toBe(true)
    const firstPText = (await firstP.textContent()).trim()
    expect(firstPText).toContain(
      'Looked at from one side, the wall enclosed a barren sixty-acre field called the Port of Anarres. On the field there were a couple of large gantry cranes, a rocket pad, three warehouses, a truck garage, and a dormitory. The dormitory looked durable, grimy, and mournful; it had no gardens, no children; plainly nobody lived there or was even meant to stay there long. It was in fact a quarantine. The wall shut in not only the landing field but also the ships that came down out of space, and the men that came on the ships, and the worlds they came from, and the rest of the universe. It enclosed the universe, leaving Anarres outside, free.'
    )
  })

  test('displays the correct second p tag text', async ({ page }) => {
    const secondP = page.locator('.page p').nth(1)
    await page.waitForSelector('.page p:nth-child(2)', { state: 'visible' })
    expect(await secondP.isVisible()).toBe(true)
    const secondPText = (await secondP.textContent()).trim()
    expect(secondPText).toMatch(/Looked at from the other side/i)
  })

  test('has correct footer text', async ({ page }) => {
    await verifyFooterDetails(page, expect)
  })

  test('current screenshot matches baseline', async ({ page, browserName }) => {
    const pixelDiffCount = await compareScreenshot(page, 'public', { browserName, targetUrl: '/public' });
    expect(pixelDiffCount).toBeLessThan(200)
  });
})
```
- make `~/app/frontend/specs/pages/private.spec.js` look like this:
```
import { test, expect } from '@playwright/test'
import { compareScreenshot, verifyHeaderDetails, verifyFooterDetails } from './shared'

test.describe('Private Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/private')
  })

  test('links correctly from homepage', async ({ page }) => {
    const homePage = await page.context().newPage()
    await homePage.goto('/')
    const privateLink = await homePage.locator('a[href="/private"]')
    await privateLink.click()
    await page.waitForLoadState('load')
    expect(page.url()).toContain('/private')
    const h1 = (await page.locator('h1'))
    await expect(h1).not.toHaveText('404')
  })

  test('has correct header links', async ({ page }) => {
    await verifyHeaderDetails(page, expect)
  })

  test('displays the correct first p tag text', async ({ page }) => {
    const firstP = page.locator('.page p').first()
    expect(await firstP.isVisible()).toBe(true)
    const firstPText = (await firstP.textContent()).trim()
    expect(firstPText).toContain(
      'A number of people were coming along the road towards the landing field, or standing around where the road cut through the wall. People often came out from the nearby city of Abbenay in hopes of seeing a spaceship, or simply to see the wall. After all, it was the only boundary wall on their world. Nowhere else could they see a sign that said No Trespassing. Adolescents, particularly, were drawn to it. They came up to the wall; they sat on it. There might be a gang to watch, offloading crates from track trucks at the warehouses. There might even be a freighter on the pad. Freighters came down only eight times a year, unannounced except to syndics actually working at the Port, so when the spectators were lucky enough to see one they were excited, at first. But there they sat, and there it sat, a squat black tower in a mess of movable cranes, away off across the field. And then a woman came over from one of the warehouse crews and said, “We’re shutting down for today, brothers.” She was wearing the Defense armband, a sight almost as rare as a spaceship. That was a bit of a thrill. But though her tone was mild, it was final. She was the foreman of this gang, and if provoked would be backed up by her syndics. And anyhow there wasn’t anything to see. The aliens, the offworlders, stayed hiding in their ship. No show.'
    )
  })

  test('has correct footer text', async ({ page }) => {
    await verifyFooterDetails(page, expect)
  })

  test('current screenshot matches baseline', async ({ page, browserName }) => {
    const pixelDiffCount = await compareScreenshot(page, 'private', { browserName, targetUrl: '/public' });
    expect(pixelDiffCount).toBeLessThan(200)
  });
})
```
- `npm run e2e-tests` -> the public & private tests should fail
- `^ + c`

### Subpages
- Now let's build out our `/public` and `/private` pages.
- `cd ~/app/frontend`
- `touch pages/public.vue pages/private.vue`
- make `~/app/frontend/pages/public.vue` look like this:
```
<template>
  <UiContainer class="page relative flex flex-col py-10 lg:py-20">
    <div
      class="absolute inset-0 z-[-2] h-full w-full bg-transparent bg-[linear-gradient(to_right,_theme(colors.border)_1px,_transparent_1px),linear-gradient(to_bottom,_theme(colors.border)_1px,_transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(#000,_transparent_80%)]"
    />
    <div class="flex h-full lg:w-[768px]">
      <div>
        <h1 class="mb-4 text-4xl font-bold md:text-5xl lg:mb-6 lg:mt-5 xl:text-6xl">
          Public
        </h1>
        <p class="max-w-[768px] mb-8 text-lg text-muted-foreground lg:text-xl">
          Looked at from one side, the wall enclosed a barren sixty-acre field called the Port of Anarres. On the field there were a couple of large gantry cranes, a rocket pad, three warehouses, a truck garage, and a dormitory. The dormitory looked durable, grimy, and mournful; it had no gardens, no children; plainly nobody lived there or was even meant to stay there long. It was in fact a quarantine. The wall shut in not only the landing field but also the ships that came down out of space, and the men that came on the ships, and the worlds they came from, and the rest of the universe. It enclosed the universe, leaving Anarres outside, free.
        </p>
        <p class="max-w-[768px] mb-8 text-lg text-muted-foreground lg:text-xl">
          Looked at from the other side, the wall enclosed Anarres: the whole planet was inside it, a great prison camp, cut off from other worlds and other men, in quarantine.
        </p>
      </div>
    </div>
  </uicontainer>
</template>
```
- make `~/app/frontend/pages/private.vue` look like this:
```
<template>
  <UiContainer class="page relative flex flex-col py-10 lg:py-20">
    <div
      class="absolute inset-0 z-[-2] h-full w-full bg-transparent bg-[linear-gradient(to_right,_theme(colors.border)_1px,_transparent_1px),linear-gradient(to_bottom,_theme(colors.border)_1px,_transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(#000,_transparent_80%)]"
    />
    <div class="flex h-full lg:w-[768px]">
      <div>
        <h1 class="mb-4 text-4xl font-bold md:text-5xl lg:mb-6 lg:mt-5 xl:text-6xl">
          Private
        </h1>
        <p class="max-w-[768px] mb-8 text-lg text-muted-foreground lg:text-xl">
          A number of people were coming along the road towards the landing field, or standing around where the road cut through the wall. People often came out from the nearby city of Abbenay in hopes of seeing a spaceship, or simply to see the wall. After all, it was the only boundary wall on their world. Nowhere else could they see a sign that said No Trespassing. Adolescents, particularly, were drawn to it. They came up to the wall; they sat on it. There might be a gang to watch, offloading crates from track trucks at the warehouses. There might even be a freighter on the pad. Freighters came down only eight times a year, unannounced except to syndics actually working at the Port, so when the spectators were lucky enough to see one they were excited, at first. But there they sat, and there it sat, a squat black tower in a mess of movable cranes, away off across the field. And then a woman came over from one of the warehouse crews and said, “We’re shutting down for today, brothers.” She was wearing the Defense armband, a sight almost as rare as a spaceship. That was a bit of a thrill. But though her tone was mild, it was final. She was the foreman of this gang, and if provoked would be backed up by her syndics. And anyhow there wasn’t anything to see. The aliens, the offworlders, stayed hiding in their ship. No show.
        </p>
      </div>
    </div>
  </uicontainer>
</template>
```
- `npm run front-and-back-dev` -> home, public & private links work (private page is not yet locked)
- `^ + c`
- Let's push our changes to prod.
- `fly deploy`
- If you go to your frontend url (from `~/app/.secrets`) in a browser you can check that /public and /private now work (but the private page isn't locked yet, i.e., it isn't really private yet).

### Run E2E Tests
- Locally
  - `cd ~/app/frontend`
  - We want to check our public and private specs locally now, which should pass. But since we've changed the way they look (ie, we created them), we'll have to delete our pixelmatch baseline public and private page images, which are at `~/app/frontend/spec/e2e/screenshots/baseline/page-public.png` and `~/app/frontend/spec/e2e/screenshots/baseline/page-private.png`, respectively.
  - `npm run e2e-tests` -> all 15 specs should pass
  - `^ + c`
- Local Docker
  - Now we'll check our public and private specs on local docker.
  - `cd ~/app`
  - `docker compose down -v --remove-orphans`
  - `docker compose build`
  - `docker compose up -d`
  - `docker compose run --rm playwright` -> all 15 specs should pass
- CircleCI
  - Now we'll check our public and private specs on CircleCI.
  - `git add .`
  - `git commit -m "Add public/private pages"`
  - `git push`
  - check the project CircleCI dashboard - `rspec`, `playwright` and `component-tests` should pass

### Install Sidebase Nuxt-Auth
- Next we'll setup our signup/login functionality with `@sidebase/nuxt-auth`
- `cd ~/app/frontend`
- `npx nuxi@latest module add @sidebase/nuxt-auth`
- `npm install`

### Setup Sidebase Nuxt-Auth
- Sidebase Nuxt Auth keeps its settings under `auth` in `nuxt.config.ts`. Here we'll lock down all pages by default with `globalAppMiddleware: { isEnabled: true }` and we also specify all our auth endpoints.
- `cd ~/app/frontend`
- make `~/app/frontend/nuxt.config.js` look like this (making sure to replace all three `<backend url>` instances with your backend url from your `.secrets` file):
```
import tailwindcss from "@tailwindcss/vite";
import dotenv from 'dotenv'
dotenv.config()

const development = process.env.NODE_ENV !== 'production'

export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: { public: { apiBase: process.env.API_BASE || '<backend url>/api/v1' } },
  devServer: { port: 3001 },
  modules: [
    "@nuxt/test-utils/module",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "@nuxt/icon",
    "@sidebase/nuxt-auth",
  ],
  vite: {
    plugins: [tailwindcss()],
  },

  css: ["~/assets/css/main.css"],

  tailwindcss: {
    exposeConfig: true,
    editorSupport: true,
  },
  colorMode: { classSuffix: "" },
  imports: {
    imports: [
      {
        from: "tailwind-variants",
        name: "tv",
      },
      {
        from: "tailwind-variants",
        name: "VariantProps",
        type: true,
      },
    ],
  },
  auth: {
    computed: { pathname: development ? 'http://localhost:3000/api/v1/auth/' : 'https://<backend url>/api/v1/auth/' },
    isEnabled: true,
    baseURL: development ? 'http://localhost:3000/api/v1/auth/' : 'https://<backend url>/api/v1/auth/',
    globalAppMiddleware: { isEnabled: true },
    provider: {
      type: 'local',
      pages: { login: '/' },
      token: { signInResponseTokenPointer: '/token' },
      endpoints: {
        signIn: { path: 'login', method: 'post' },
        signOut: { path: 'logout', method: 'delete' },
        signUp: { path: 'signup', method: 'post' },
        getSession: { path: 'current_user', method: 'get' },
      },
    },
  }
})
```

### Update Header Spec For Logged In/Out Functionality
- `cd ~/app/frontend`
- make `~/app/frontend/spec/components/Header.nuxt.spec.js` look like this (TODO: needs some work):
```
import { Header } from '#components'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { afterEach, expect, it, test, beforeEach, vi } from 'vitest';

// was unable to move header/mainNav declarations to beforeEach because of conflict with vi.hoisted - never did find a solution 
const { useAuthMock } = vi.hoisted(() => {
  return { useAuthMock: vi.fn().mockImplementation(() => { return { status: "unauthenticated" } }) }
})
mockNuxtImport('useAuth', () => { return useAuthMock })

it('has a main navigation', async () => {
  const header = await mountSuspended(Header)
  const mainNav = await header.find('nav.header-main-nav')
  expect(mainNav.exists()).toBe(true)
})

it('contains correct main navigation links', async () => {
  const header = await mountSuspended(Header);
  const mainNav = await header.find('nav.header-main-nav')
  expect(mainNav.find('a[href="/"]').text()).toContain('Home')
  expect(mainNav.find('a[href="/public"]').text()).toContain('Public')
  expect(mainNav.find('a[href="/private"]').exists()).toBe(false)
})

it('has a login navigation', async () => {
  const header = await mountSuspended(Header);
  const loginNav = await header.find('.header-login-nav')
  expect(loginNav.exists()).toBe(true)
})

test('when authenticated contains correct main navigation links', async () => {
  useAuthMock.mockImplementation(() => {
    return { status: "authenticated" }
  })
  
  const header = await mountSuspended(Header);
  const mainNav = await header.find('nav.header-main-nav');
  expect(mainNav.find('a[href="/"]').text()).toContain('Home')
  expect(mainNav.find('a[href="/public"]').text()).toContain('Public')
  expect(mainNav.find('a[href="/private"]').text()).toContain('Private')
})

it('has a login navigation', async () => {
  useAuthMock.mockImplementation(() => {
    return { status: "authenticated" }
  })
  const header = await mountSuspended(Header)
  const loginNav = await header.find('.header-login-nav')
  expect(loginNav.exists()).toBe(true)
})
```

### Update Page Specs For Logged In/Out Functionality
- make `~/app/frontend/spec/e2e/shared.js` look like this:
```
// shared.js
import { promises as fs } from 'fs';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

// Sets baseline directory based on environment
const getBaselineDir = () => {
  const ciValue = process.env.CI || 'undefined'
  const dockerValue = process.env.DOCKER_ENV || 'undefined'
  console.log(`CI: ${ciValue}, DOCKER_ENV: ${dockerValue}`)
  if (process.env.CI === 'true') return 'spec/e2e/screenshots/baseline/ci'
  if (process.env.DOCKER_ENV === 'true') return 'spec/e2e/screenshots/baseline/docker'
  return 'spec/e2e/screenshots/baseline/local'
}

// Main function to compare screenshots, accepting a dynamic URL
export async function compareScreenshot(page, testName, { browserName = 'chromium', targetUrl }) {
  const baselineDir = getBaselineDir();
  const baselinePath = `${baselineDir}/${testName}.png`;
  const screenshotPath = `spec/e2e/screenshots/current/${testName}.png`;

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(targetUrl); // Use the provided target URL
  await fs.mkdir('spec/e2e/screenshots/current', { recursive: true });
  await page.screenshot({ path: screenshotPath });

  const baselineExists = await fs.access(baselinePath).then(() => true).catch(() => false);

  // Create baseline if not found
  if (!baselineExists && browserName === 'chromium') {
    console.log('Baseline image not found. Creating new baseline...');
    await fs.mkdir(baselineDir, { recursive: true });
    await fs.copyFile(screenshotPath, baselinePath);
    console.log('New baseline image created at:', baselinePath);
  }

  if (baselineExists) {
    const baselineImage = PNG.sync.read(await fs.readFile(baselinePath));
    const currentImage = PNG.sync.read(await fs.readFile(screenshotPath));

    const { width, height } = baselineImage;
    const diff = new PNG({ width, height });
    const pixelDiffCount = pixelmatch(
      baselineImage.data,
      currentImage.data,
      diff.data,
      width,
      height,
      { threshold: 0.1 }
    );

    if (pixelDiffCount > 0) {
      const diffPath = `spec/e2e/screenshots/diff/${testName}-diff.png`;
      await fs.mkdir('spec/e2e/screenshots/diff', { recursive: true });
      await fs.writeFile(diffPath, PNG.sync.write(diff));
      console.log(`Difference found! Diff image saved at ${diffPath}`);
    }

    return pixelDiffCount;
  }

  return 0;
}

// Header details verification
export async function verifyHeaderDetails(page, expect) {
  const homeLink = page.getByTestId('header-link-home');
  const publicLink = page.getByTestId('header-link-public');
  const privateLink = page.getByTestId('header-link-private');

  await expect(homeLink).toBeVisible({ timeout: 30000 });
  await expect(homeLink).toHaveText('Home');
  await expect(homeLink).toHaveAttribute('href', '/');
  await expect(publicLink).toBeVisible();
  await expect(publicLink).toHaveText('Public');
  await expect(publicLink).toHaveAttribute('href', '/public');
  await expect(privateLink).toBeVisible();
  await expect(privateLink).toHaveText('Private');
  await expect(privateLink).toHaveAttribute('href', '/private');
}

// Footer details verification
export async function verifyFooterDetails(page, expect) {
  const footerP = page.getByTestId('footer-p');
  await expect(footerP).toBeVisible({ timeout: 30000 });
  await expect(footerP).toHaveText('© 2025. Made with Nuxt, Tailwind, UI Thing, Rails, Fly.io and S3.');

  const nuxtLink = footerP.locator('a', { hasText: 'Nuxt' });
  await expect(nuxtLink).toHaveAttribute('href', 'https://nuxt.com');
  const tailwindLink = footerP.locator('a', { hasText: 'Tailwind' });
  await expect(tailwindLink).toHaveAttribute('href', 'https://tailwindcss.com/');
  const uiThingLink = footerP.locator('a', { hasText: 'UI Thing' });
  await expect(uiThingLink).toHaveAttribute('href', 'https://ui-thing.behonbaker.com');
  const railsLink = footerP.locator('a', { hasText: 'Rails' });
  await expect(railsLink).toHaveAttribute('href', 'https://rubyonrails.org/');
  const flyLink = footerP.locator('a', { hasText: 'Fly.io' });
  await expect(flyLink).toHaveAttribute('href', 'https://fly.io');
  const s3Link = footerP.locator('a', { hasText: 'S3' });
  await expect(s3Link).toHaveAttribute('href', 'https://aws.amazon.com/s3/');
}

// TODO: Needs some more work
export async function logIn(page) {
  const logInButton = await page.locator('header a[href="/login"]')
  expect(await logInButton.isVisible()).toBe(true)
  await logInButton.click()
  await page.waitForLoadState('load');
  const submitButton = await page.locator('main form button[type="submit"]')
  await submitButton.click();
  await page.waitForLoadState('load')
  await page.waitForLoadState('networkidle')
  await page.waitForFunction(() => !window.location.href.includes('/login'));
}
```
- make `~/app/frontend/spec/e2e/index.spec.js`: 
```
import { consola } from 'consola'
import { createPage } from '@nuxt/test-utils'
import { setup } from '@nuxt/test-utils/e2e'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { compareScreenshotWithBaseline, testHeaderLinksLoggedIn, testHeaderLinksLoggedOut } from './shared'

describe('homepage', async () => {
  await setup({ browser: true })

  let page

  beforeAll(async () => {
    page = await createPage('/')
    consola.restoreConsole()
  })

  afterEach(async () => {
    const logOutButton = await page.locator('header button:has-text("Log out")')
    if (await logOutButton.isVisible() && await logOutButton.isEnabled()) {
      await logOutButton.click()
      await page.waitForLoadState('load')
      await page.waitForLoadState('networkidle')
      await page.waitForLoadState('networkidle', { timeout: 15000 });
    }
  })

  it('logging in redirects away from login page', async () => {
    const logInButton = await page.locator('header a[href="/login"]')
    await logInButton.click()
    await page.waitForLoadState('load')
    await page.waitForLoadState('networkidle')
    expect(page.url()).toContain('/login')
    const submitButton = await page.locator('main form button[type="submit"]')
    await submitButton.click();
    await page.waitForLoadState('load')
    await page.waitForLoadState('networkidle')
    await page.waitForFunction(() => !window.location.href.includes('/login'));
    expect(page.url()).not.toContain('/login')
  })

  it('has correct header links when logged in', async () => {
    const logInButton = await page.locator('header a[href="/login"]')
    expect(await logInButton.isVisible()).toBe(true)
    await logInButton.click()
    await page.waitForLoadState('load');
    const submitButton = await page.locator('main form button[type="submit"]')
    await submitButton.click();
    await page.waitForLoadState('load')
    await page.waitForLoadState('networkidle')
    await page.waitForFunction(() => !window.location.href.includes('/login'));
    await testHeaderLinksLoggedIn(page)
  })

  it('has correct header links when logged out', async () => {
    const page = await createPage('/')
    await testHeaderLinksLoggedOut(page)
  })

  it('displays h1 with correct text', async () => {
    const h1 = await page.locator('main h1')
    const h1Text = await h1.textContent()
    expect(await h1.isVisible()).toBe(true)
    expect(h1Text).toContain('There was a wall.').and.toContain('It did not look important.')
  })

  it('displays p with correct text', async () => {
    const p = await page.locator('main p')
    const pText = await p.textContent('p')
    expect(await p.isVisible()).toBe(true)
    expect(pText).toContain('{"status":"OK"}')
  })

  it('displays the correct buttons with hrefs and text', async () => {
    const loginButton = await page.locator('main .hero-buttons a[href="/login"]')
    const signupButton = await page.locator('main .hero-buttons a[href="/signup"]')
    expect(await loginButton.isVisible()).toBe(true)
    expect(await loginButton.textContent()).toContain('Log in')
    expect(await signupButton.isVisible()).toBe(true)
    expect(await signupButton.textContent()).toContain('Sign up')
  })

  it('matches the visual baseline when logged out', async () => {
    page.reload()
    await compareScreenshotWithBaseline(page, 'page-home-logged-out', 'page-home-logged-out-diff')
  }, 20000)

  it('matches the visual baseline when logged in', async () => {
    try {
      const toastCloseButton = await page.locator('[data-sonner-toaster] button[data-close-button]');
      
      if (await toastCloseButton.isVisible()) {
        await toastCloseButton.click();
        
        // Wait for the toast element to be completely removed from the DOM
        await page.waitForSelector('[data-sonner-toast]', { state: 'hidden' });
      }
  
      // Ensure the login button is not blocked and is interactable
      const logInButton = await page.locator('header a[href="/login"]');
      await logInButton.waitFor({ state: 'visible' });
      await logInButton.click({ timeout: 15000 });
  
      await page.waitForLoadState('load');
      expect(page.url()).toContain('/login');
  
      const submitButton = await page.locator('main form button[type="submit"]');
      expect(await submitButton.isVisible()).toBe(true);
      await submitButton.click();
  
      await page.waitForLoadState('load');
      await page.waitForLoadState('networkidle');
      await page.waitForFunction(() => !window.location.href.includes('/login'));
      page.reload()
  
      await compareScreenshotWithBaseline(page, 'page-home-logged-in', 'page-home-logged-in-diff');
      
    } catch (error) {
      console.error('Test failed:', error);
    }
  }, 30000); 
})
```

### Unlock The Public Page
- Because we have `globalAppMiddleware: { isEnabled: true }` in `nuxt.config.ts`, if a user is logged out, all pages redirect to the homepage. To override this behaivor on specific pages and make them public, we add `definePageMeta({ auth: false })` in the page's `script` section.
- `cd ~/app/frontend`
- to the top of `~/app/frontend/pages/public.vue` add:
```
<script>
definePageMeta({ auth: false })
</script>
```
- `npm run front-and-back-dev` -> private page redirects to homepage (Login still goes to a 404. Also, tests will now fail until we change some things.)
- `^ + c`

### Hide The Private Page Link
- Right now if you are logged out and click the link to the private page, you're redirected to the homepage, which is what we want. But we also don't even want the link to the private page to show at all for users who are logged out. Sidebase Nuxt Auth gives us a `useAuth()` method which has a `status` property. With `status`, we can add conditional vue logic in templates like `v-if="status === 'authenticated'"` which will only render it's tag if the user is logged in.
- `cd ~/app/frontend`
- make `~/app/frontend/components/Header.vue` look like this:
```
<script setup>
const { data, signOut, status } = useAuth()

const uuid = computed(() => {
  if (data && data.value) {
    return data.value.uuid
  }
  return ''
})
</script>

<template>
  <header class="z-20 border-b bg-background/90 backdrop-blur">
    <UiContainer class="flex h-16 items-center justify-between md:h-20">
      <div class="flex items-center gap-10">
        <Logo />
        <UiNavigationMenu as="nav" class="header-main-nav hidden items-center justify-start gap-8 md:flex">
          <UiNavigationMenuList class="gap-2">
            <UiNavigationMenuItem>
              <UiNavigationMenuLink as-child>
                <UiThingDataButtonWrapper data-testid="header-link-home" to="/" variant="ghost" size="sm">
                  Home
                </UiThingDataButtonWrapper>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
            <UiNavigationMenuItem>
              <UiNavigationMenuLink as-child>
                <UiThingDataButtonWrapper data-testid="header-link-public" to="/public" variant="ghost" size="sm">
                  Public
                </UiThingDataButtonWrapper>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
            <UiNavigationMenuItem v-if="status === 'authenticated'">
              <UiNavigationMenuLink as-child>
                <UiThingDataButtonWrapper data-testid="header-link-private" to="/private" variant="ghost" size="sm">
                  Private
                </UiThingDataButtonWrapper>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
          </UiNavigationMenuList>
        </UiNavigationMenu>
      </div>
      <div class="md:hidden">
        <UiSheet>
          <UiSheetTrigger as-child>
            <UiButton variant="ghost" size="icon-sm">
              <Icon name="lucide:menu" class="h-5 w-5" />
            </UiButton>
            <UiSheetContent class="w-[90%] p-0">
              <UiSheetTitle class="sr-only" title="Mobile menu" />
              <UiSheetDescription class="sr-only" description="Mobile menu" />
              <UiSheetX class="z-20" />

              <UiScrollArea class="h-full p-5">
                <div class="flex flex-col gap-2">
                  <UiButton variant="ghost" class="justify-start text-base" to="/">
                    Home
                  </UiButton>
                  <UiButton variant="ghost" class="justify-start text-base" to="/public">
                    Public
                  </UiButton>
                  <UiButton v-if="status === 'authenticated'" variant="ghost" class="justify-start text-base" to="/private">
                    Private
                  </UiButton>
                  <UiGradientDivider class="my-5" />
                  <UiButton to="#">
                    Sign up
                  </UiButton>
                  <UiButton variant="outline" to="#">
                    Log in
                  </UiButton>
                </div>
              </UiScrollArea>
            </UiSheetContent>
          </UiSheetTrigger>
        </UiSheet>
      </div>
      <div class="header-login-nav hidden items-center gap-3 md:flex">
        <UiThingDataButtonWrapper data-testid="header-link-login" to="/login" variant="ghost" size="sm">
          Log in
        </UiThingDataButtonWrapper>
        <UiThingDataButtonWrapper data-testid="header-link-signup" to="/signup" variant="ghost" size="sm">
          Sign up
        </UiThingDataButtonWrapper>
      </div>
    </UiContainer>
  </header>
</template>
```
- `npm run front-and-back-dev` -> Private page link now not showing on homepage. When logged in (we'll build out login functionality shortly here), Private page link will show. Also, tests are a mess right now - don't run them yet.
- `^ + c`

### Add User Link & User Dropdown To Nav
- If a user is logged in we want their avatar to show in the main nav and if they click it, a dropdown menu will show which has a link to their profile and a link to log out.
- `cd ~/app/frontend`
- `npx ui-thing@latest add avatar dropdown-menu`
- make `~/app/frontend/components/Header.vue` look like this:
```
<script setup>
const { data, signOut, status } = useAuth()

const uuid = computed(() => {
  if (data && data.value) {
    return data.value.uuid
  }
  return ''
})

async function logout() {
  await signOut({ callbackUrl: '/' })
  useSonner('Logged out successfully!', { description: 'You have successfully logged out.' })
}
</script>

<template>
  <header class="z-20 border-b bg-background/90 backdrop-blur">
    <UiContainer class="flex h-16 items-center justify-between md:h-20">
      <div class="flex items-center gap-10">
        <Logo />
        <UiNavigationMenu as="nav" class="header-main-nav hidden items-center justify-start gap-8 md:flex">
          <UiNavigationMenuList class="gap-2">
            <UiNavigationMenuItem>
              <UiNavigationMenuLink as-child>
                <UiThingDataButtonWrapper data-testid="header-link-home" to="/" variant="ghost" size="sm">
                  Home
                </UiThingDataButtonWrapper>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
            <UiNavigationMenuItem v-if="status === 'authenticated'">
              <UiNavigationMenuLink as-child>
                <UiThingDataButtonWrapper data-testid="header-link-private" to="/users" variant="ghost" size="sm">
                  Users
                </UiThingDataButtonWrapper>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
            <UiNavigationMenuItem>
              <UiNavigationMenuLink as-child>
                <UiThingDataButtonWrapper data-testid="header-link-public" to="/public" variant="ghost" size="sm">
                  Public
                </UiThingDataButtonWrapper>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
            <UiNavigationMenuItem v-if="status === 'authenticated'">
              <UiNavigationMenuLink as-child>
                <UiThingDataButtonWrapper data-testid="header-link-private" to="/private" variant="ghost" size="sm">
                  Private
                </UiThingDataButtonWrapper>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
          </UiNavigationMenuList>
        </UiNavigationMenu>
      </div>
      <div class="md:hidden">
        <UiSheet>
          <UiSheetTrigger as-child>
            <UiButton variant="ghost" size="icon-sm">
              <Icon name="lucide:menu" class="h-5 w-5" />
            </UiButton>
            <UiSheetContent class="w-[90%] p-0">
              <UiSheetTitle class="sr-only" title="Mobile menu" />
              <UiSheetDescription class="sr-only" description="Mobile menu" />
              <UiSheetX class="z-20" />

              <UiScrollArea class="h-full p-5">
                <div class="flex flex-col gap-2">
                  <UiButton variant="ghost" class="justify-start text-base" to="/">
                    Home
                  </UiButton>
                  <UiButton v-if="status === 'authenticated'" variant="ghost" class="justify-start text-base" to="/users">
                    Users
                  </UiButton>
                  <UiButton variant="ghost" class="justify-start text-base" to="/public">
                    Public
                  </UiButton>
                  <UiButton v-if="status === 'authenticated'" variant="ghost" class="justify-start text-base" to="/private">
                    Private
                  </UiButton>
                  <UiGradientDivider class="my-5" />
                  <UiButton to="#">
                    Sign up
                  </UiButton>
                  <UiButton variant="outline" to="#">
                    Log in
                  </UiButton>
                </div>
              </UiScrollArea>
            </UiSheetContent>
          </UiSheetTrigger>
        </UiSheet>
      </div>
      <div class="header-login-nav hidden items-center gap-3 md:flex">
        <UiThingDataButtonWrapper v-if="status === 'unauthenticated'" data-testid="header-link-login" to="/login" variant="ghost" size="sm">
          Log in
        </UiThingDataButtonWrapper>
        <UiThingDataButtonWrapper v-if="status === 'unauthenticated'" data-testid="header-link-signup" to="/signup" variant="ghost" size="sm">
          Sign up
        </UiThingDataButtonWrapper>

        <div v-if="status === 'authenticated'" class="flex items-center justify-center">
          <UiDropdownMenu>
            <UiDropdownMenuTrigger as-child>
              <UiButton id="dropdown-menu-trigger" class="focus:ring-0 focus:outline-none hover:bg-transparent" variant="ghost">
                <UiAvatar
                  src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
                  alt="Colm Tuite"
                  fallback="CT"
                  :delay-ms="600"
                />
              </UiButton>
            </UiDropdownMenuTrigger>
            <UiDropdownMenuContent class="w-56">
              <NuxtLink :to="`/users/${uuid}`">
                <UiDropdownMenuItem title="Profile" icon="ph:user" />
              </NuxtLink>
              <UiDropdownMenuSeparator />
              <UiDropdownMenuItem title="Log out" icon="ph:user" @click.prevent="logout" />
            </UiDropdownMenuContent>
          </UiDropdownMenu>
        </div>

        <UiThingDataButtonWrapper v-if="status === 'authenticated'" data-testid="header-link-logout" variant="ghost" size="sm" @click.prevent="logout">
          Log out
        </UiThingDataButtonWrapper>
      </div>
    </UiContainer>
  </header>
</template>
```
- `npm run front-and-back-dev` -> User dropdown is coded, but not showing because we're logged out. We're also now showing Log In & Sign Up buttons only when logged out. When logged in (which we'll build out shortly), Log In & Sign Up buttons will not show and the Log Out button will show.
- `^ + c`

### Login Page
- Let's build out the login page. Login/logout functionality won't work until we get to the backend, but we build the actual page here. We also add a package called `vue-sonner` which shows little "toast" messages notifying the user when they've successfully logged in/out.
- `cd ~/app/frontend`
- `npx ui-thing@latest add vee-input form vue-sonner` -> hit `y` when asked about installing dependencies
- `touch pages/login.vue`
- make `~/app/frontend/pages/login.vue` look like this:
```
<script setup>
const { signIn, status } = useAuth()
definePageMeta({ auth: false })
const email = ref('test@mail.com')
const password = ref('password')

async function login() {
  await signIn({ user: { email: email.value, password: password.value } }, { redirect: false })
  useSonner('Logged in successfully!', { description: 'You have successfully logged in.' })
  navigateTo('/')
}
</script>

<template>
  <UiContainer class="relative flex flex-col py-10 lg:py-20">
    <div class="flex h-screen items-center justify-center">
      <div class="w-full max-w-[350px] px-5">
        <h1 class="text-2xl font-bold tracking-tight lg:text-3xl">
          Log in
        </h1>
        <p class="mt-1 text-muted-foreground">
          Enter your email & password to log in.
        </p>

        <form class="mt-10">
          <fieldset class="grid gap-5">
            <div>
              <UiVeeInput v-model="email" label="Email" type="email" name="email" placeholder="test@mail.com" />
            </div>
            <div>
              <UiVeeInput v-model="password" label="Password" type="password" name="password" placeholder="password" />
            </div>
            <div>
              <UiButton class="w-full" type="submit" text="Log in" @click.prevent="login" />
            </div>
          </fieldset>
        </form>
        <p class="mt-4 text-sm text-muted-foreground">
          Don't have an account?
          <NuxtLink class="font-semibold text-primary underline-offset-2 hover:underline" to="/signup">
            Create account
          </NuxtLink>
        </p>
      </div>
    </div>
  </UiContainer>
</template>
```
- make `~/app/frontend/app.vue` look like this:
```
<template>
  <Header />
  <main>
    <NuxtPage />
    <UiVueSonner />
  </main>
  <Footer />
</template>
```

### Signup Page
- Let's also build out the signup page.
- `cd ~/app/frontend`
- `touch pages/signup.vue`
- make `~/app/frontend/pages/signup.vue` look like this:
```
<script setup>
const { signUp } = useAuth()

definePageMeta({ auth: false })

const email = ref('')
const password = ref('')

async function register() {
  await signUp({ user: { email: email.value, password: password.value } }, { redirect: false })
  useSonner('Signed up successfully!', { description: 'You have successfully signed up.' })
  navigateTo('/confirm')
}
</script>

<template>
  <UiContainer class="relative flex flex-col py-10 lg:py-20">
    <div class="flex h-screen items-center justify-center">
      <div class="w-full max-w-[350px] px-5">
        <h1 class="text-2xl font-bold tracking-tight lg:text-3xl">
          Sign up
        </h1>
        <p class="mt-1 text-muted-foreground">
          Enter your email & password to sign up.
        </p>

        <form class="mt-10">
          <fieldset class="grid gap-5">
            <div>
              <UiVeeInput v-model="email" label="Email" type="email" name="email" placeholder="test@mail.com" />
            </div>
            <div>
              <UiVeeInput v-model="password" label="Password" type="password" name="password" placeholder="password" />
            </div>
            <div>
              <UiButton class="w-full" type="submit" text="Sign up" @click.prevent="register" />
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  </UiContainer>
</template>
```

### Confirm Page
- Let's also build out a confirm page.
- `cd ~/app/frontend`
- `touch pages/confirm.vue`
- make `~/app/frontend/pages/confirm.vue` look like this:
```
<script setup>
definePageMeta({ auth: false })
</script>

<template>
  <UiContainer class="relative flex flex-col py-10 lg:py-20">
    <div class="flex h-screen items-center justify-center">
      <div class="w-full max-w-[350px] px-5">
        <h1 class="text-2xl font-bold tracking-tight lg:text-3xl">
          Confirm your email
        </h1>
        <p class="mt-1 text-muted-foreground">
          Please go to your email and click the confirmation link. 🙏
        </p>
      </div>
    </div>
  </UiContainer>
</template>
```
### Nuxt User Views
- Here we'll build out the frontend user pages - index, show, edit and new.
- `cd ~/app/frontend`
- `npx ui-thing@latest add card table`
- `mkdir pages/users`
- `touch pages/users/index.vue pages/users/new.vue pages/users/\[id\].vue`
- make `~/app/frontend/pages/users/index.vue` (note: not `~/app/frontend/pages/index.vue`!) look like this:
```
<script setup lang="ts">
import { ref } from 'vue'

const config = useRuntimeConfig()
const { data: users, refresh } = await useAsyncData('users', () =>
  $fetch(`${config.public.apiBase}/users`))

const sortedUsers = computed(() => {
  if (users.value) {
    return [...users.value].sort((a, b) => a.id - b.id)
  }
  return []
})

async function navigateToUser(uuid) {
  navigateTo(`/users/${uuid}`)
}

async function deleteUser(uuid) {
  await fetch(`${config.public.apiBase}/users/${uuid}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  refresh()
}
</script>

<template>
  <UiContainer class="relative flex flex-col py-10 lg:py-20">
    <div
      class="absolute inset-0 z-[-2] h-full w-full bg-transparent bg-[linear-gradient(to_right,_theme(colors.border)_1px,_transparent_1px),linear-gradient(to_bottom,_theme(colors.border)_1px,_transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(#000,_transparent_80%)]"
    />
    <div class="flex h-full lg:w-[768px]">
      <div>
        <h1 class="mb-4 text-4xl font-bold md:text-5xl lg:mb-6 lg:mt-5 xl:text-6xl">
          Users
        </h1>
        <div class="overflow-x-auto rounded-md border pb-4">
          <UiTable>
            <UiTableHeader>
              <UiTableRow>
                <UiTableHead class="w-[100px]">
                  id
                </UiTableHead>
                <UiTableHead>email</UiTableHead>
                <UiTableHead>uuid</UiTableHead>
                <UiTableHead class="w-[50px]" />
              </UiTableRow>
            </UiTableHeader>
            <UiTableBody class="last:border-b">
              <template v-for="user in sortedUsers" :key="user.id">
                <UiTableRow class="cursor-pointer hover:bg-gray-100">
                  <UiTableCell class="font-medium" @click="navigateToUser(user.uuid)">
                    {{ user.id }}
                  </UiTableCell>
                  <UiTableCell @click="navigateToUser(user.uuid)">
                    {{ user.email }}
                  </UiTableCell>
                  <UiTableCell @click="navigateToUser(user.uuid)">
                    {{ user.uuid }}
                  </UiTableCell>
                  <UiTableCell class="text-right">
                    <button @click.stop="deleteUser(user.uuid)">
                      <Icon name="lucide:trash" class="text-red-500 hover:text-red-700" />
                    </button>
                  </UiTableCell>
                </UiTableRow>
              </template>
            </UiTableBody>
          </UiTable>
        </div>
      </div>
    </div>
    <NuxtLink to="/users/new">
      <UiButton class="w-[100px]">
        New User
      </UiButton>
    </NuxtLink>
  </UiContainer>
</template>
```
- make `~/app/frontend/pages/users/[id].vue` look like this:
```
<script setup>
definePageMeta({ auth: false })

const route = useRoute()
const user = ref({})

async function fetchUser() {
  const { apiBase } = useRuntimeConfig().public
  const response = await fetch(`${apiBase}/users/${route.params.id}`)
  user.value = await response.json()
}

async function saveUserChanges(updatedUser) {
  const { apiBase } = useRuntimeConfig().public
  await fetch(`${apiBase}/users/${route.params.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: {
        email: updatedUser.email,
        uuid: updatedUser.uuid,
      },
    }),
  })
}

async function deleteUser() {
  const { apiBase } = useRuntimeConfig().public
  await fetch(`${apiBase}/users/${route.params.id}`, {
    method: 'DELETE',
  })
  navigateTo('/users')
}

onMounted(fetchUser)

// Watch for changes in the user object
watch(user, (newUser) => {
  if (newUser.id) { // Ensure user data is loaded before sending a request
    saveUserChanges(newUser)
  }
}, { deep: true })
</script>

<template>
  <UiContainer class="relative flex flex-col py-10 lg:py-20">
    <div
      class="absolute inset-0 z-[-2] h-full w-full bg-transparent bg-[linear-gradient(to_right,_theme(colors.border)_1px,_transparent_1px),linear-gradient(to_bottom,_theme(colors.border)_1px,_transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(#000,_transparent_80%)]"
    />
    <div class="flex h-full lg:w-[768px]">
      <div>
        <h1 class="mb-4 text-4xl font-bold md:text-5xl lg:mb-6 lg:mt-5 xl:text-6xl">
          User
        </h1>
        <div class="flex items-center justify-center">
          <form @submit.prevent>
            <UiCard class="w-[360px] max-w-sm" :title="user.email">
              <template #content>
                <UiCardContent>
                  <div class="grid w-full items-center gap-4">
                    <div class="flex flex-col space-y-1.5">
                      <UiLabel for="email">
                        Email
                      </UiLabel>
                      <UiInput id="email" v-model="user.email" required />
                    </div>
                    <div class="flex flex-col space-y-1.5">
                      <UiLabel for="uuid">
                        UUID
                      </UiLabel>
                      <p class="text-sm">
                        {{ user.uuid }}
                      </p>
                    </div>
                  </div>
                </UiCardContent>
              </template>
              <template #footer>
                <UiCardFooter class="flex justify-between">
                  <UiButton variant="destructive" @click.prevent="deleteUser">
                    <Icon name="lucide:trash" />
                    Delete User
                  </UiButton>
                </UiCardFooter>
              </template>
            </UiCard>
          </form>
        </div>
      </div>
    </div>
  </UiContainer>
</template>
```
- make `~/app/fronte nd/pages/users/new.vue` look like this:
```
<script setup>
const user = ref({
  email: '',
  password: '',
  password_confirmation: '',
})

async function createUser() {
  const { apiBase } = useRuntimeConfig().public
  const response = await fetch(`${apiBase}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: {
        email: user.value.email,
        password: user.value.password,
      },
    }),
  })

  if (response.ok) {
    const createdUser = await response.json()
    navigateTo(`/users/${createdUser.uuid}`)
  }
}
</script>

<template>
  <UiContainer class="relative flex flex-col py-10 lg:py-20">
    <div
      class="absolute inset-0 z-[-2] h-full w-full bg-transparent bg-[linear-gradient(to_right,_theme(colors.border)_1px,_transparent_1px),linear-gradient(to_bottom,_theme(colors.border)_1px,_transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(#000,_transparent_80%)]"
    />
    <div class="flex h-full lg:w-[768px]">
      <div>
        <h1 class="mb-4 text-4xl font-bold md:text-5xl lg:mb-6 lg:mt-5 xl:text-6xl">
          Create User
        </h1>
        <div class="flex items-center justify-center">
          <form @submit.prevent="createUser">
            <UiCard class="w-[360px] max-w-sm" :title="user.email">
              <template #content>
                <UiCardContent>
                  <div class="grid w-full items-center gap-4">
                    <div class="flex flex-col space-y-1.5">
                      <UiLabel for="email">
                        Email
                      </UiLabel>
                      <UiInput id="email" v-model="user.email" required />
                    </div>
                    <div class="flex flex-col space-y-1.5">
                      <UiLabel for="password">
                        Password
                      </UiLabel>
                      <UiInput id="password" v-model="user.password" type="password" required />
                    </div>
                  </div>
                </UiCardContent>
              </template>
              <template #footer>
                <UiCardFooter class="flex justify-between">
                  <UiButton type="submit">
                    Create User
                  </UiButton>
                </UiCardFooter>
              </template>
            </UiCard>
          </form>
        </div>
      </div>
    </div>
  </UiContainer>
</template>
```
- That's it for the frontend for now. We're sort of halfway through getting user login functionality working. We just added a lot (like user views), but some of it we can't see yet because we can't yet log in. The other half of the user login functionality is on the backend and we'll build that next here. Also, tests are still a mess - don't run them yet.

## Backend
Our Rails API-only backend will serve our users to the frontend for login. We'll use Devise and JWT for backend auth. We'll also setup S3 on AWS for hosting our avatars and other file uploads.

### AWS S3 Setup
Now we'll create our AWS S3 account so we can store our user avatar images there as well as any other file uploads we'll need. There are a few parts here. We want to create a S3 bucket to store the files. But a S3 bucket needs a IAM user. Both the S3 bucket and the IAM user need permissions policies. There's a little bit of a chicken and egg issue here - when we create the user permissions policy, we need the S3 bucket name. But when we create the S3 bucket permissions, we need the IAM user name. So we'll create everything and use placeholder strings in some of the policies. Then when we're all done, we'll go through the policies and update all the placeholder strings to what they really need to be.

#### AWS General Setup
- login to AWS (https://aws.amazon.com)
  - If you don't have an AWS account, you'll need to sign up. It's been awhile since I did this part - I think you have to create a root user and add you credit card or something. Google it if you run into trouble with this part.
- at top right, select a region if currently says `global` (I use the `us-east-1` region). If all the region options are grayed out, ignore this for now and we'll set it later.
- at top right click your name
  - next to Account ID, click the copy icon (two overlapping squares)
  - paste your Account ID in your `~/app/.secrets` file (It pastes without the dashes. Leave it that way - you need it without the dashes.)

#### AWS User Policy
- in searchbar at top, enter `iam` and select IAM
- click `Policies` in the left sidebar under Access Managment
  - click `Create policy` towards the top right
  - click the `JSON` tab on Policy Editor
  - under Policy Editor select all with `command + a` and then hit `delete` to clear out everything there
  - enter this under Policy Editor (we'll update it shortly, once we have our user and bucket names):
```
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "AllowGetObject",
			"Effect": "Allow",
			 "Action": [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject"
            ],
			"Resource": ["arn:aws:s3:::<development bucket name>", "arn:aws:s3:::<production bucket name>"]
		}
	]
}
```
  - click Next towards bottom right
  - for Policy Name, enter `app-s3-user-policy`
  - paste your policy name in your `.secrets` file
  - click Create Policy towards the bottom right

#### AWS User
- click `Users` under Access Management in the left sidebar
  - click `Create User` towards the top right
  - enter name, something like `app-s3-user` (add this to your `.secrets` file - you'll need it later)
  - click Next
  - under Permissions Options click `Attach policies directly`
  - in the search bar under Permissions Policies, enter `app-s3-user-policy` -> this should then show the policy we just created above (`app-s3-user-policy`) under Policy Name
  - under Policy Name, click the checkbox to the left of `app-s3-user-policy`
  - click Next
  - click Create User towards the bottom right
- under Users, click the name of the user we just created (`app-user`)
  - click Security Credentials tab
  - click `Create Access key` towards the top right
    - Use case: `Local code`
    - check `I understand the above recommendation`
    - Next
    - Description tag value: enter tag name, like `app-user-access-key`
    - click `Create access key` towards the bottom right
    - paste both the Access Key and the Secret Access Key into your `.secrets` file - this is important!
    - click Done

#### AWS S3 Bucket
- in searchbar at top, enter `s3` and select S3
- Create Bucket
  - for Bucket Name, enter something like `app-s3-bucket-development` (below when you click Create Bucket, it may tell you this bucket already exists and you will have to make it more unique. Regardless, add this to your `.secrets` file - you'll need it later. Also, make sure it ends in `-development`.)
  - under Object Ownership, click ACLs Enabled
  - under Block Public Access settings
    - uncheck the first option, `Block All Public Access`
    - check the last two options, `Block public access to buckets and objects granted through new public bucket or access point policies` and `Block public and cross-account access to buckets and objects through any public bucket or access point policies`
  - check `I acknowledge that the current settings might result in this bucket and the objects within becoming public.`  
  - scroll to bottom and click Create Bucket (if nothing happens, scroll up and look for red error messages)
- under General Purpose Buckets, click the name of the bucket you just created -> then click the Permissions tab towards the top
  - in the Bucket Policy section, click Edit (to the right of "Bucket Policy")
  - copy/paste the boilerplate json bucket policy in the next line below this into the text editor area under Policy.
  - here is the boilerplate json bucket policy:
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::<aws acct id without dashes>:user/<iam username>"
            },
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::<bucket name>"
        },
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::<aws acct id without dashes>:user/<iam username>"
            },
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::<bucket name>/*"
        }
    ]
}
```
  - Update all the `<aws acct id without dashes>`, `<iam username>` and `<bucket name>` parts in the policy now in the text editor area under Policy with the account number, user name and bucket name you jotted down above in your `~/app/.secrets` file.
  - click Save Changes towards the bottom right
  - in the Cross-Origin Resource Sharing (CORS) section, click `Edit` (to the right of "Cross-origin resource sharing (CORS)")
  - under Cross-origin Resource Sharing (CORS) add this:
```
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "POST",
            "PUT",
            "DELETE"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": [],
        "MaxAgeSeconds": 3000
    }
]
```
  - click Save Changes towards the bottom right
- now repeat this entire "AWS S3 Bucket" step above again, but make a production s3 bucket named something like `app-s3-bucket-production` and note the production bucket name in your `.secrets` file
- now that we know our bucket names, let's update the our user policy with the bucket name
  - in the searchbar at the top of the page, type `iam` and select `IAM`
  - click `Policies` in the left sidebar under Access Management
  - in the searchbar under Policies, type `app-s3-user-policy` -> click `app-s3-user-policy` under Policy Name
  - click Edit towards the top right
  - in the Policy Editor text editor area, change the line `"Resource": ["arn:aws:s3:::<development bucket name>", "arn:aws:s3:::<production bucket name>"]` replace `<development bucket name>` and `<production bucket name>` with your development bucket name and production bucket name, respectively, in your `.secrets` file
  - click Next towards the bottom right
  - click Save Changes towards the bottom right
- see what region you're logged into
  - click the AWS logo in the top left
  - in the top right there will be a region dropdown - click it
  - look at the highlighted region in the dropdown and look for the region string to the right of it - something like `us-east-1`
  - paste your region string in your `~/app/.secrets` file in the `aws region` line
- we're now done with our S3 setup and our AWS dashboard, at least for now. So let's go back to our terminal where we're building out our rails backend

### Auth Spec
- `cd ~/app/backend`
- `mkdir -p spec/requests/api/v1/auth`
- `touch spec/requests/api/v1/auth/auth_spec.rb`
- make `spec/requests/api/v1/auth/auth_spec.rb` look like this:
```
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Login/logout requests' do
  before(:each) do
    User.delete_all
    @user1 = create(:user, :confirmed)
    @user2 = create(:user, :confirmed)
    @user3 = create(:user)
  end

  let(:valid_creds) { { user: { email: @user1.email, password: @user1.password } } }
  let(:valid_creds2) { { user: { email: @user2.email, password: @user2.password } } }
  let(:invalid_email) { { user: { email: @user1.email, password: 'wrong' } } }
  let(:invalid_pass) { { user: { email: 'wrong@mail.com', password: @user1.password } } }
  let(:unconfirmed) { { user: { email: @user3.email, password: @user3.password } } }

  context 'POST /api/v1/auth/login with valid credentials' do
    it 'responds with 200 status' do
      post '/api/v1/auth/login', params: valid_creds
      expect(response.status).to eq 200
    end
  end

  context 'POST /api/v1/auth/login with invalid email' do
    it 'responds with 401 status' do
      post '/api/v1/auth/login', params: invalid_email
      expect(response.status).to eq 401
    end
  end

  context 'POST /api/v1/auth/login with invalid password' do
    it 'responds with 401 status' do
      post '/api/v1/auth/login', params: invalid_pass
      expect(response.status).to eq 401
    end
  end

  context 'POST /api/v1/auth/login unconfirmed user' do
    it 'responds with 401 status' do
      post '/api/v1/auth/login', params: invalid_pass
      expect(response.status).to eq 401
    end
  end

  context 'DELETE /api/v1/auth/logout with valid credentials' do
    it 'responds with 200 status' do
      post '/api/v1/auth/login', params: valid_creds
      expect(response.status).to eq 200
      token = JSON.parse(response.body)['token']
      delete '/api/v1/auth/logout', headers: { 'Authorization' => "Bearer #{token}" }
      expect(response.status).to eq 200
    end
  end

  context 'DELETE /api/v1/auth/logout without valid credentials' do
    it 'responds with 200 status' do
      post '/api/v1/auth/login', params: valid_creds
      expect(response.status).to eq 200
      delete '/api/v1/auth/logout'
      expect(response.status).to eq 401
    end
  end

  context 'GET /api/v1/auth/current_user with valid credentials' do
    it 'responds with 200 status and returns the current user' do
      post '/api/v1/auth/login', params: valid_creds
      expect(response.status).to eq 200
      token = JSON.parse(response.body)['token']
      get '/api/v1/auth/current_user', headers: { 'Authorization' => "Bearer #{token}" }
      expect(response.status).to eq 200
    end
  end

  context 'GET /api/v1/auth/current_user without credentials' do
    it 'responds with 401 status' do
      get '/api/v1/auth/current_user'
      expect(response.status).to eq 401
    end
  end
end
```

### Registration Spec
- `touch spec/requests/api/v1/registration_spec.rb`
- make `spec/requests/api/v1/registration_spec.rb` look like this:
```
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Registration requests' do
  let(:user_params) { { user: { email: 'test@mail.com', password: 'password' } } }
  let(:just_email) { { user: { email: 'test@mail.com' } } }
  let(:just_password) { { user: { password: 'password' } } }
  let(:malformed) { { email: 'test@mail.com', password: 'password' } }

  context 'POST /api/v1/auth/signup with email and password params' do
    it 'responds with 200 status' do
      post '/api/v1/auth/signup', params: user_params
      expect(response.status).to eq 200
    end
  end

  context 'POST /api/v1/auth/signup with just email param' do
    it 'responds with 422 status' do
      post '/api/v1/auth/signup', params: just_email
      expect(response.status).to eq 422
    end
  end

  context 'POST /api/v1/auth/signup with just password param' do
    it 'responds with 422 status' do
      post '/api/v1/auth/signup', params: just_password
      expect(response.status).to eq 422
    end
  end

  context 'POST /api/v1/auth/signup with malformed params' do
    it 'responds with 422 status' do
      post '/api/v1/auth/signup', params: malformed
      expect(response.status).to eq 422
    end
  end
end
```

### Devise
- `cd ~/app/backend`
- `rails db:create` (or `rails db:drop db:create` if you already have a database called `backend`)
- `bundle add devise devise-jwt jsonapi-serializer`
- `bundle install`
- `rails generate devise:install`
- in `~/app/backend/config/environments/development.rb`, near the other `action_mailer` lines add:
```
config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }
```
- in `~/app/backend/config/initializers/devise.rb` uncomment the `config.navigational_format` line and make that line look like this:
```
config.navigational_formats = []
```
- to avoid a `Your application has sessions disabled. To write to the session you must first configure a session store` error, in `~/app/backend/config/application.rb` add this near the other `config.` lines:
```
    config.session_store :cookie_store, key: '_interslice_session'
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use config.session_store, config.session_options
```

### User Model
- `cd ~/app/backend`
- `rails g migration EnableUuid`
- add `enable_extension 'pgcrypto'` to `~/app/backend/db/migrate/<timestamp>_enable_uuuid.rb` inside the `change` method
- `rails db:migrate`
- `rails generate devise User`
- make `~/app/backend/db/<timestamp>_devise_create_users.rb` look like this:
```
# frozen_string_literal: true

class DeviseCreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      ## Database authenticatable
      t.string :email,              null: false, default: ""
      t.string :encrypted_password, null: false, default: ""

      ## Custom additions I did
      t.boolean :admin, default: false
      t.uuid :uuid, index: { unique: true }

      ## Recoverable
      t.string   :reset_password_token
      t.datetime :reset_password_sent_at

      ## Rememberable
      t.datetime :remember_created_at

      ## Trackable
      t.integer  :sign_in_count, default: 0, null: false
      t.datetime :current_sign_in_at
      t.datetime :last_sign_in_at
      t.string   :current_sign_in_ip
      t.string   :last_sign_in_ip

      ## Confirmable
      t.string   :confirmation_token
      t.datetime :confirmed_at
      t.datetime :confirmation_sent_at
      t.string   :unconfirmed_email # Only if using reconfirmable

      ## Lockable
      t.integer  :failed_attempts, default: 0, null: false # Only if lock strategy is :failed_attempts
      t.string   :unlock_token # Only if unlock strategy is :email or :both
      t.datetime :locked_at

      t.timestamps null: false
    end

    add_index :users, :email,                unique: true
    add_index :users, :reset_password_token, unique: true
    add_index :users, :confirmation_token,   unique: true
    add_index :users, :unlock_token,         unique: true
  end
end
```
- `rails db:migrate`
- `touch spec/factories/users.rb`
- make `~/app/backend/spec/factories/users.rb` look like this:
```
FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "test#{n}@mail.com" }
    password { 'password' }

    trait :confirmed do
      confirmed_at { Time.zone.now }
    end
  end
end
```

### User Model Spec
- `cd backend`
- `mkdir spec/models`
- `touch spec/models/user_spec.rb`
- make `~/app/backend/spec/models/user_spec.rb` look like this:
```
# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
# email                   :string     default(""), not null, index
# encrypted_password      :string     default(""), not null
# admin                   :boolean    not null
# uuid                    :uuid       unique, index
# reset_password_token    :string     unique, index
# reset_password_sent_at  :datetime
# remember_created_at     :datetime
# sign_in_count           :integer    default(0), not null
# current_sign_in_at      :datetime
# last_sign_in_at         :datetime
# current_sign_in_ip      :string
# last_sign_in_ip         :string
# confirmation_token      :string     index
# confirmed_at            :datetime
# confirmation_sent_at    :datetime
# unconfirmed_email       :string
# failed_attempts         :integer    default(0),not null
# unlock_token            :string     unique, index
# locked_at               :datetime
# created_at              :datetime   not null
# updated_at              :datetime   not null
# jti                     :string     not null, unique, index

require 'rails_helper'

# Devise handles most validations internally, so I believe this is all we can test here
RSpec.describe User, type: :model do
  it { should validate_presence_of(:email) }
  it { should validate_presence_of(:password) }
end
```

### User Registration
- `rails g devise:controllers api/v1/auth -c sessions registrations`
- make `~/app/backend/config/routes.rb` look like this:
```
# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users, param: :uuid
      get 'up' => 'health#show'
    end
  end
  devise_for :users, path: '', path_names: {
    sign_in: 'api/v1/auth/login',
    sign_out: 'api/v1/auth/logout',
    registration: 'api/v1/auth/signup'
  }, controllers: {
    sessions: 'api/v1/auth/sessions',
    registrations: 'api/v1/auth/registrations'
  }
end
```

### Users Controller
- `cd ~/app/backend`
- `touch app/controllers/api/v1/users_controller.rb`
- make `~/app/backend/app/controllers/api/v1/users_controller.rb` look like this:
```
class Api::V1::UsersController < ApplicationController
  before_action :set_user, only: %i[ show edit update destroy ]

  # GET /users or /users.json
  def index
    @users = User.all
    render json: @users
  end

  # GET /users/1 or /users/1.json
  def show
    render json: @user
  end

  # GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users or /users.json
  def create
    @user = User.new(user_params)

    if @user.save
      render json: @user, status: :created, location: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1 or /users/1.json
  def update
    if @user.update(user_params)
      render json: @user, status: :ok, location: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /users/1 or /users/1.json
  def destroy
    @user.destroy!
    head :no_content
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find_by!(uuid: params[:uuid])
    end

    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:uuid, :email, :password)
    end
end
```

### JWT
- `cd ~/app/backend`
- add this to `~/app/backend/config/initializers/devise.rb` right before the last `end`:
```
  config.jwt do |jwt|
    # jwt.secret = Rails.application.credentials.fetch(:secret_key_base)
    jwt.secret = ENV['SECRET_KEY_BASE'] || 'dummy_secret_key_for_tests'
    jwt.dispatch_requests = [
      ['POST', %r{^/api/v1/auth/login$}]
    ]
    jwt.revocation_requests = [
      ['DELETE', %r{^/api/v1/auth//logout$}]
    ]
    jwt.expiration_time = 30.minutes.to_i
  end
```
- `rails g migration addJtiToUsers jti:string:index:unique`
- change `~/app/backend/db/migrate/<timestamp>_add_jti_to_users.rb` to include this:
```
  add_column :users, :jti, :string, null: false
  add_index :users, :jti, unique: true
```
- make `~/app/backend/app/models/user.rb` look like this:
```
class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :timeoutable, :trackable,
         :jwt_authenticatable, jwt_revocation_strategy: self
  before_create :set_uuid

  private

  def set_uuid
    self.uuid = SecureRandom.uuid if uuid.blank?
  end
end
```
- `rails db:migrate`
- `rails generate serializer user id email uuid`

### Auth Controllers
- `cd ~/app/backend`
- make `~/app/backend/app/controllers/api/v1/auth/registrations_controller.rb` look like this:
```
class Api::V1::Auth::RegistrationsController < Devise::RegistrationsController
  respond_to :json
  private

  def respond_with(resource, _opts = {})
    if request.method == "POST" && resource.persisted?
      render json: {
        status: {code: 200, message: "Signed up sucessfully."},
        data: UserSerializer.new(resource).serializable_hash[:data][:attributes]
      }, status: :ok
    elsif request.method == "DELETE"
      render json: {
        status: { code: 200, message: "Account deleted successfully."}
      }, status: :ok
    else
      render json: {
        status: {code: 422, message: "User couldn't be created successfully. #{resource.errors.full_messages.to_sentence}"}
      }, status: :unprocessable_entity
    end
  end
end
```
- make `~/app/backend/app/controllers/api/v1/auth/sessions_controller.rb` look like this:
```
class Api::V1::Auth::SessionsController < ApplicationController
  before_action :authenticate_user!, only: [:destroy]
  respond_to :json

  def create
    user_params = params.dig(:user) || params.dig(:session, :user)

    if user_params.present?
      user = User.find_by(email: user_params[:email])

      if user&.valid_password?(user_params[:password])
        token = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first
        render json: {
          token: token,
          status: { code: 200, message: 'Logged in successfully.' }
        }, status: :ok
      else
        render json: {
          status: 401,
          message: 'Invalid email or password.'
        }, status: :unauthorized
      end
    else
      render json: {
        status: 400,
        message: 'Invalid parameters.'
      }, status: :bad_request
    end
  end

  def destroy
    if current_user
      # Assuming you have a method to handle logout logic
      render json: {
        status: 200,
        message: 'Logged out successfully.'
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session."
      }, status: :unauthorized
    end
  end
end
```

### Current User Endpoint
- `cd ~/app/backend`
- `rails g controller Api::V1::Auth::current_user index`
- make `~/app/backend/app/controllers/api/v1/auth/current_user_controller.rb` look like this:
```
class Api::V1::Auth::CurrentUserController < ApplicationController
  before_action :authenticate_user!
  def index
    render json: UserSerializer.new(current_user).serializable_hash[:data][:attributes], status: :ok
  end
end
```
- make `~/app/backend/config/routes.rb` look like this:
```
# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      namespace :auth do
        get 'current_user', to: 'current_user#index'
        post 'login', to: 'sessions#create'
        delete 'logout', to: 'sessions#destroy'
      end
      resources :users, param: :uuid
      get 'up' => 'health#show'
    end
  end
  devise_for :users, path: '', path_names: {
    sign_in: 'api/v1/auth/login',
    sign_out: 'api/v1/auth/logout',
    registration: 'api/v1/auth/signup'
  }, controllers: {
    sessions: 'api/v1/auth/sessions',
    registrations: 'api/v1/auth/registrations'
  }
end
```

### User Seeds
- `cd ~/app/backend`
- make `~/app/backend/db/seeds.rb` look like this:
```
User.create!(email: 'test@mail.com', password: 'password', admin: true)
User.create!(email: 'test2@mail.com', password: 'password')
```

### Update Backend For Prod
- Our backend API was working on prod last time we checked, but that was just a simple API call that wasn't pulling anything from the database at all. We've now added database calls to our frontend and backend code and everything is working locally. But if we deploy either our frontend or backend code to fly.io now, we'll see quite a few errors. So let's fix all that now.
- `cd ~/app/backend`
- in `~/app/backend/config/puma.rb`, below the `port ENV.fetch('PORT', 3000)` on line 37, add this:
```
# Specifies the `bind` address that Puma will listen on.
bind "tcp://0.0.0.0:#{ENV.fetch('PORT', 3000)}"
```
- `touch config/initializers/default_url_options.rb`
- make `~/app/backend/config/initializers/default_url_options.rb` look like this:
```
# config/initializers/default_url_options.rb

Rails.application.routes.default_url_options = {
  host: ENV['DEFAULT_URL_HOST'] || 'localhost',
  port: ENV['DEFAULT_URL_PORT'] || 3000
}

# Optionally, you can set different options for different environments
Rails.application.configure do
  config.action_mailer.default_url_options = { host: ENV['DEFAULT_URL_HOST'] || 'localhost', port: ENV['DEFAULT_URL_PORT'] || 3000 }
end
```

### Add SECRET_KEY_BASE To CircleCI
- You may run into `SECRET_KEY_BASE` issues. In that case:
  - in `~/app/backend/config/initializers/devise.rb`:
    - right above `Devise.setup do |config|`, add `raise "SECRET_KEY_BASE is missing" if ENV['SECRET_KEY_BASE'].nil? && Rails.env.production?`
    - right below `Devise.setup do |config|`, add `config.secret_key = ENV['SECRET_KEY_BASE'] || 'dummy_secret_key_for_tests'`
  - add your `SECRET_KEY_BASE` to CircleCI:
    - `cd ~/app/backend`
    - `EDITOR="code --wait" rails credentials:edit`
      - copy the value of the `secret-key-base` and close the creds file
    - in the CircleCI UI, go to Project Settings -> Environment Variables
    - Add `SECRET_KEY_BASE` and paste your copied value in for the value
    - TODO: Maybe also add the POSTGRES_PASSWORD here?

### Test The API
- `cd ~/app/backend`
- `rails server`
- split your terminal and in the second pane, run:
```
curl -H 'Content-Type: application/json' -X POST -d '{"user": { "email": "test@mail.com", "password" : "password" }}' http://localhost:3000/api/v1/auth/signup
```
- You should see a `status: 200` in the response somewhere and now a user is created. We will test the login API next, but first we must set the user's email to confirmed in the database. In your first terminal (the rails server one):
  - `^ + c` -> to kill the server
  - `rails console`
  - `user = User.find_by(email: "test@mail.com")`
  - `user.confirmed_at = Time.now`
  - `user.save!`
  - `exit`  
  - `rails server` -> to restart the server
- in the second terminal now run `curl -H 'Content-Type: application/json' -X POST -d '{"user": { "email": "test@mail.com", "password" : "password" }}' http://localhost:3000/api/v1/auth/login`
- you should see a `status: 200` in the response somewhere a long `token` string and now our user is logged in
- kill the server with `^ + c`
- `rm spec/requests/api/v1/current_user_spec.rb` (TODO: I'm not 100% the correct path here)

### Test The UI Locally
- `cd ~/app/frontend`
- `npm run front-and-back-dev`
- in a browser, go to http://localhost:3001
  - home & public pages should work
  - logging in (with the default `test@mail.com` / `password`) should work and should show the Private page link and the user avatar for the user menu
  - logging out should work

### Run Auth/Registration/User Specs
- Run locally
  - `cd ~/app/backend`
  - `rspec` <- all 15 tests should pass
- Run on local docker
  - `cd ~/app`
  - `docker compose down -v --remove-orphans`
  - `docker compose build`
  - `docker compose up -d db backend`
  - `docker compose run --rm rspec` <- all 15 tests should pass
- Run on CircleCI
  - `cd ~/app`
  - `git add .`
  - `git commit -m "Add backend auth/registration specs"`
  - `git push`
  - check the project CircleCI dashboard - `rspec`, `playwright` and `component-tests` should all pass

### Setup Email
- I believe our Devise setup will try to send confirmation emails automatically if we seed our users and if we don't have our server setup for email properly, it will error and possibly shut down our machine.
- `cd ~/app/backend`
- `EDITOR="code --wait" rails credentials:edit`
  - add this section near the top (and change the user_name and password to your liking):
```
smtp:
  address: smtp.example.com
  port: 587
  domain: example.com
  user_name: your_smtp_username
  password: your_smtp_password
```
  - then save the file and close it
- now add this to `~/app/backend/config/environments/production.rb`:
```
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    address:              Rails.application.credentials.dig(:smtp, :address),
    port:                 Rails.application.credentials.dig(:smtp, :port),
    domain:               Rails.application.credentials.dig(:smtp, :domain),
    user_name:            Rails.application.credentials.dig(:smtp, :user_name),
    password:             Rails.application.credentials.dig(:smtp, :password),
    authentication:       'plain',
    enable_starttls_auto: true
  }
```

### Deploy Backend
- `cd ~/app/backend`
- `fly deploy` <- this may show a couple errors mid-deploy, but should not hang (ie, it should complete and bring you back to the terminal prompt) and it should not show `WARNING The app is not listening on the expected address` at any point
- `fly ssh console`
  - `bin/rails db:seed`
  - `exit`
- Our one user has been seeded in prod, but is still not confirmed and login will error unless we confirm them:
  - `fly console`
  - `user = User.find_by(email: "test@mail.com")`
  - `user.confirmed_at = Time.now`
  - `user.save!`
  - `exit`  

### Update Frontend For Prod Database Calls
- `cd ~/app/frontend`
- The only frontend changes we need to make are in `~/app/frontend/nuxt.config.ts`:
  - at the top of the file add these three lines:
```
import dotenv from 'dotenv'
dotenv.config()

```
  - in the top of the file, change the `runtimeConfig: { public: { apiBase: "http://localhost:3000/api/v1" } },` line to (and make sure to replace the `<backend url>` part with the backend url from your `.secrets` file):
```
runtimeConfig: { public: { apiBase: process.env.API_BASE || '<backend url>/api/v1' } },
```
  - in the `auth:` section, change the `baseURL: 'http://localhost:3000/api/v1/auth',` line to (and make sure to replace `<backend url>` with your backend url from your `.secrets` file):
```
baseURL: development ? 'http://localhost:3000/api/v1/auth/' : '<backend url>/api/v1/auth/',
```
- `fly deploy`

### Test The Prod UI
- In a browser, go to the frontend url address that's in your `.secrets` file.
- Initial pageload may take 10-20 seconds and that's fine (the fix for this is to set fly.io to give your app more resources - but this costs more money)
- Clicking the Home, Public, Log in and Sign up links should bring up the correct pages.
- On the Log in page, clicking the Log in button should successfully log you in (the default user email/password prepopulate the login form).
- After login, you should see the links to the Users page and the Private page and you should see a user avatar in the top right.
- Clicking the Users link or the Private link should show you the users index page or the Private page, respectively.
- Clicking the user avatar in the top right should show you a dropdown with Profile and Log out. Clicking Profile should show you your user show page and clicking Log out should successfully log you out.

### Swagger
- Let's create Swagger API documentation.
- `cd ~/app/backend`
- `bundle add rswag`
- `bundle install`
- `rails g rswag:install`
- `rails generate rspec:swagger Api::V1::Auth::CurrentUserController`
- `rails generate rspec:swagger Api::V1::Auth::RegistrationsController`
- `rails generate rspec:swagger Api::V1::Auth::SessionsController`
- `rails generate rspec:swagger Api::V1::UsersController`
- `rake rswag:specs:swaggerize`
- `rails s`
- in a browser go to `http://localhost:3000/api-docs` -> nice html doc of your API

### S3 In Rails
- `cd ~/app/backend`
- `bundle add aws-sdk-s3`
- `bundle install`
- `touch app/controllers/api/v1/uploads_controller.rb`
- make `~/app/backend/app/controllers/api/v1/uploads_controller.rb` look like this (replacing <your-region> with your aws region and `<your production s3 bucket name>` with your production s3 bucket name from your `.secrets` file):
```
class Api::V1::UploadsController < ApplicationController
  before_action :authenticate_user! # Ensure you have authentication in place

  def presigned_url
    filename = params[:filename]
    content_type = params[:content_type]

    s3_client = Aws::S3::Client.new(region: '<your-region>')
    presigned_url = s3_client.presigned_url(:put_object,
      bucket: '<your production s3 bucket name>',
      key: filename,
      content_type: content_type,
      acl: 'public-read' # Adjust ACL as needed
    )

    render json: { url: presigned_url }
  end
end
```
- add `get 'upload', to: 'uploads#presigned_url'` to `~/app/backend/config/routes.rb` so it looks like this:
```
# frozen_string_literal: true

Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'
  namespace :api do
    namespace :v1 do
      namespace :auth do
        get 'current_user', to: 'current_user#index'
        post 'login', to: 'sessions#create'
        delete 'logout', to: 'sessions#destroy'
      end
      resources :users, param: :uuid
      get 'up', to: 'health#show'
      get 'upload', to: 'uploads#presigned_url'
    end
  end
  devise_for :users, path: '', path_names: {
    sign_in: 'api/v1/auth/login',
    sign_out: 'api/v1/auth/logout',
    registration: 'api/v1/auth/signup'
  }, controllers: {
    sessions: 'api/v1/auth/sessions',
    registrations: 'api/v1/auth/registrations'
  }
end
```

### Avatars In Rails
- `cd ~/app/backend`
- `rails active_storage:install`
- `rails db:migrate`
- open your `~/app/.secrets`. You'll need the `access key ID`, `secret access key`, `region` and `bucket` in the next step.
- `EDITOR="code --wait" rails credentials:edit`
  - make the file that opens look like this:
```
aws:
  access_key_id: <your aws access key id>
  secret_access_key: <your aws secret access key>
  region: <your aws region>
  bucket: <your s3 production bucket name>

smtp:
  address: smtp.example.com
  port: 587
  domain: example.com
  user_name: your_smtp_username
  password: your_smtp_password

# Used as the base secret for all MessageVerifiers in Rails, including the one protecting cookies.
secret_key_base: <your secret_key_base that was already there. don't touch this>
```
- make sure to fill in all the `<...>` sections with the corresponding info from your `.secrets` file and just leave the whole `secret_key_base` as is so don't touch it.
  - save and close the credentials.yml file
- in your `~/app/backend/config/storage.yml` file, uncomment the `amazon` section and change the `bucket` line to use your actual s3 bucket name prefix - so if your production s3 bucket is `app-s3-bucket001-production`, the prefix would be `app-s3-bucket001`
```
amazon:
  service: S3
  access_key_id: <%= Rails.application.credentials.dig(:aws, :access_key_id) %>
  secret_access_key: <%= Rails.application.credentials.dig(:aws, :secret_access_key) %>
  region: <your aws region string>
  bucket: <your s3 bucket name prefix>-<%= Rails.env %>
```
- in `~/app/backend/app/models/user.rb`, add `has_one_attached :avatar` and a `avatar_url` method so it looks like this:
```
class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :timeoutable, :trackable,
         :jwt_authenticatable, jwt_revocation_strategy: self
  before_create :set_uuid
  has_one_attached :avatar

  def avatar_url
    Rails.application.routes.url_helpers.rails_blob_url(self.avatar, only_path: true) if avatar.attached?
  end

  private

  def set_uuid
    self.uuid = SecureRandom.uuid if uuid.blank?
  end
end
```
- change `~/app/backend/app/serializers/user_serializer.rb` to look like this:
```
class UserSerializer
  include JSONAPI::Serializer
  attributes :id, :email, :uuid, :avatar_url
end
```
- change `~/app/backend/app/controllers/application_controller.rb` to
```
# frozen_string_literal: true

class ApplicationController < ActionController::API

  def serialized_user(user)
    UserSerializer.new(user).serializable_hash[:data][:attributes].merge(avatar_url: user.avatar.attached? ? url_for(user.avatar) : nil)
  end

  def serialized_users(users)
    users.map do |user|
      serialized_user(user)
    end
  end
end
```
- in `~/app/backend/app/controllers/users/users_controller.rb`, we'll 1) add `:avatar` to the permitted, 2) use our serializer for all returned users and 3) set each user's avatar url to a full url path. So the whole file looks like this:
```
class Api::V1::UsersController < ApplicationController
  before_action :set_user, only: %i[ show edit update destroy ]

  # GET /users or /users.json
  def index
    @users = User.all
    render json: serialized_users(@users)
  end

  # GET /users/1 or /users/1.json
  def show
    render json: serialized_user(@user)
  end

  # GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users or /users.json
  def create
    @user = User.new(user_params)

    if @user.save
      render json: serialized_user(@user), status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1 or /users/1.json
  def update
    if @user.update(user_params)
      render json: serialized_user(@user), status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /users/1 or /users/1.json
  def destroy
    @user.destroy!
    head :no_content
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find_by!(uuid: params[:uuid])
    end

    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:uuid, :email, :avatar, :password)
    end
end
```
- make `~/app/backend/app/controllers/api/v1/auth/current_user_controller.rb` look like this:
```
class Api::V1::Auth::CurrentUserController < ApplicationController
  before_action :authenticate_user!
  def index
    render json: serialized_user(current_user), status: :ok
  end
end
```

### Avatars In Nuxt
- `cd ~/app/frontend`
- change `~/app/frontend/pages/users/[id].vue` to look like this:
```
<script setup>
definePageMeta({ auth: false })

const route = useRoute()
const user = ref({})
const avatar = ref(null)

async function fetchUser() {
  const { apiBase } = useRuntimeConfig().public
  const response = await fetch(`${apiBase}/users/${route.params.id}`)
  user.value = await response.json()
}

async function saveUserChanges(updatedUser) {
  const { apiBase } = useRuntimeConfig().public
  const formData = new FormData()
  formData.append('user[email]', updatedUser.email)
  formData.append('user[uuid]', updatedUser.uuid)
  if (avatar.value) {
    formData.append('user[avatar]', avatar.value)
  }

  await fetch(`${apiBase}/users/${route.params.id}`, {
    method: 'PATCH',
    body: formData,
  })

  // Wait a moment before fetching updated user data
  setTimeout(fetchUser, 500)
}

async function deleteUser() {
  const { apiBase } = useRuntimeConfig().public
  await fetch(`${apiBase}/users/${route.params.id}`, {
    method: 'DELETE',
  })
  navigateTo('/users')
}

function onFileChange(e) {
  avatar.value = e.target.files[0]
}

// Watch for changes in the email field and avatar value
watch(
  () => user.value.email,
  (newEmail, oldEmail) => {
    if (newEmail !== oldEmail) {
      saveUserChanges(user.value)
    }
  },
)

watch(
  avatar,
  (newAvatar, oldAvatar) => {
    if (newAvatar !== oldAvatar) {
      saveUserChanges(user.value)
    }
  },
)

onMounted(fetchUser)
</script>

<template>
  <UiContainer class="relative flex flex-col py-10 lg:py-20">
    <div
      class="absolute inset-0 z-[-2] h-full w-full bg-transparent bg-[linear-gradient(to_right,_theme(colors.border)_1px,_transparent_1px),linear-gradient(to_bottom,_theme(colors.border)_1px,_transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(#000,_transparent_80%)]"
    />
    <div class="flex h-full lg:w-[768px]">
      <div>
        <h1 class="mb-4 text-4xl font-bold md:text-5xl lg:mb-6 lg:mt-5 xl:text-6xl">
          User
        </h1>
        <div class="flex items-center justify-center">
          <form @submit.prevent="saveUserChanges(user)">
            <UiCard class="w-[360px] max-w-sm" :title="user.email">
              <template #content>
                <UiCardContent>
                  <div class="grid w-full items-center gap-4">
                    <div class="flex flex-col space-y-1.5">
                      <UiLabel for="email">
                        Email
                      </UiLabel>
                      <UiInput id="email" v-model="user.email" required />
                    </div>
                    <div class="flex flex-col space-y-1.5">
                      <UiLabel for="uuid">
                        UUID
                      </UiLabel>
                      <p class="text-sm">
                        {{ user.uuid }}
                      </p>
                    </div>
                    <div class="flex flex-col space-y-1.5">
                      <UiLabel for="avatar">
                        Avatar
                      </UiLabel>
                      <div v-if="user.avatar_url">
                        <img :src="`${user.avatar_url}?${new Date().getTime()}`" alt="User Avatar" class="w-32 h-32 object-cover rounded-full">
                      </div>
                      <input type="file" @change="onFileChange">
                    </div>
                  </div>
                </UiCardContent>
              </template>
              <template #footer>
                <UiCardFooter class="flex justify-between">
                  <UiButton variant="destructive" @click.prevent="deleteUser">
                    <Icon name="lucide:trash" />
                    Delete User
                  </UiButton>
                </UiCardFooter>
              </template>
            </UiCard>
          </form>
        </div>
      </div>
    </div>
  </UiContainer>
</template>
```
- change `~/app/frontend/components/Header.vue` to look like this:
```
<script setup>
const { data, signOut, status } = useAuth()
const uuid = computed(() => data?.value?.uuid || '')
const email = computed(() => data?.value?.email || '')
const avatarUrl = computed(() => data?.value?.avatar_url || '')

async function logout() {
  await signOut({ callbackUrl: '/' })
  useSonner('Logged out successfully!', { description: 'You have successfully logged out.' })
}
</script>

<template>
  <header class="z-20 border-b bg-background/90 backdrop-blur">
    <UiContainer class="flex h-16 items-center justify-between md:h-20">
      <div class="flex items-center gap-10">
        <Logo />
        <UiNavigationMenu as="nav" class="header-main-nav hidden items-center justify-start gap-8 md:flex">
          <UiNavigationMenuList class="gap-2">
            <UiNavigationMenuItem>
              <UiNavigationMenuLink as-child>
                <UiButton to="/" variant="ghost" size="sm">
                  Home
                </UiButton>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
            <UiNavigationMenuItem>
              <UiNavigationMenuLink as-child>
                <UiButton v-if="status === 'authenticated'" to="/users" variant="ghost" size="sm">
                  Users
                </UiButton>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
            <UiNavigationMenuItem>
              <UiNavigationMenuLink as-child>
                <UiButton to="/public" variant="ghost" size="sm">
                  Public
                </UiButton>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
            <UiNavigationMenuItem v-if="status === 'authenticated'">
              <UiNavigationMenuLink as-child>
                <UiButton v-if="status === 'authenticated'" to="/private" variant="ghost" size="sm">
                  Private
                </UiButton>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
          </UiNavigationMenuList>
        </UiNavigationMenu>
      </div>
      <div class="md:hidden">
        <UiSheet>
          <UiSheetTrigger as-child>
            <UiButton variant="ghost" size="icon-sm">
              <Icon name="lucide:menu" class="h-5 w-5" />
            </UiButton>
            <UiSheetContent class="w-[90%] p-0">
              <template #content>
                <UiSheetTitle class="sr-only" title="Mobile menu" />
                <UiSheetDescription class="sr-only" description="Mobile menu" />
                <UiSheetX class="z-20" />

                <UiScrollArea class="h-full p-5">
                  <div class="flex flex-col gap-2">
                    <UiButton variant="ghost" class="justify-start text-base" to="/">
                      Home
                    </UiButton>
                    <UiButton v-if="status === 'authenticated'" variant="ghost" class="justify-start text-base" to="/users">
                      Users
                    </UiButton>
                    <UiButton variant="ghost" class="justify-start text-base" to="/public">
                      Public
                    </UiButton>
                    <UiButton v-if="status === 'authenticated'" variant="ghost" class="justify-start text-base" to="/private">
                      Private
                    </UiButton>
                    <UiGradientDivider class="my-5" />
                    <UiButton to="/signup">
                      Sign up
                    </UiButton>
                    <UiButton variant="outline" to="/login">
                      Log in
                    </UiButton>
                  </div>
                </UiScrollArea>
              </template>
            </UiSheetContent>
          </UiSheetTrigger>
        </UiSheet>
      </div>
      <div class="header-login-nav hidden items-center gap-3 md:flex">
        <UiButton v-if="status === 'unauthenticated'" to="/login" variant="ghost" size="sm">
          Log in
        </UiButton>
        <UiButton v-if="status === 'unauthenticated'" to="/signup" size="sm">
          Sign up
        </UiButton>

        <div v-if="status === 'authenticated'" class="flex items-center justify-center">
          <p>{{ email }}</p>
          <UiDropdownMenu>
            <UiDropdownMenuTrigger as-child>
              <UiButton id="dropdown-menu-trigger" class="focus:ring-0 focus:outline-none hover:bg-transparent" variant="ghost">
                <UiAvatar
                  :src="avatarUrl"
                  alt="Colm Tuite"
                  fallback="CT"
                  :delay-ms="600"
                />
              </UiButton>
            </UiDropdownMenuTrigger>
            <UiDropdownMenuContent class="w-56">
              <NuxtLink :to="`/users/${uuid}`">
                <UiDropdownMenuItem title="Profile" icon="ph:user" />
              </NuxtLink>
              <UiDropdownMenuSeparator />
              <UiDropdownMenuItem title="Log out" icon="ph:user" @click.prevent="logout" />
            </UiDropdownMenuContent>
          </UiDropdownMenu>
        </div>
      </div>
    </UiContainer>
  </header>
</template>
```
- `fly deploy`

### Test Avatars Locally
- `cd ~/app/frontend`
- `npm run front-and-back-dev` <- you should now be able to login, go to your profile page and update your avatar

### Deploy Backend to Fly.io
- `cd ~/app/backend`
- change `~/app/backend/config/environments/production.rb` to look like this (in the last line, make sure to replace `<backend url>` with the backend url from your `.secrets` file):
```
# frozen_string_literal: true

require 'active_support/core_ext/integer/time'
Rails.application.configure do
  config.enable_reloading = false
  config.eager_load = true
  config.consider_all_requests_local = false
  config.public_file_server.enabled = ENV['RAILS_SERVE_STATIC_FILES'].present?
  config.active_storage.service = :amazon
  config.force_ssl = true
  config.logger = ActiveSupport::Logger.new($stdout)
    .tap  { |logger| logger.formatter = ::Logger::Formatter.new }
    .then { |logger| ActiveSupport::TaggedLogging.new(logger) }
  config.log_tags = [:request_id]
  config.log_level = ENV.fetch('RAILS_LOG_LEVEL', 'info')
  config.action_mailer.perform_caching = false
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    address:              Rails.application.credentials.dig(:smtp, :address),
    port:                 Rails.application.credentials.dig(:smtp, :port),
    domain:               Rails.application.credentials.dig(:smtp, :domain),
    user_name:            Rails.application.credentials.dig(:smtp, :user_name),
    password:             Rails.application.credentials.dig(:smtp, :password),
    authentication:       'plain',
    enable_starttls_auto: true
  }
  config.i18n.fallbacks = true
  config.active_support.report_deprecations = false
  config.active_record.dump_schema_after_migration = false
end
Rails.application.routes.default_url_options[:host] = '<backend url>'
```
- copy and paste the below `fly secrets` console line into a blank file and replace all the `<...>` sections with the appropriate info. The S3 endpoint is like `https://s3.<aws region>.amazonaws.com/<bucket name>`, so something like `https://s3.us-east-1.amazonaws.com/app-s3-bucket-production` Once it's filled in paste it all in your backend terminal and hit enter
```
fly secrets set \
  AWS_ACCESS_KEY_ID=<your aws access key> \
  AWS_SECRET_ACCESS_KEY=<your aws secret access key> \
  AWS_ENDPOINT_URL_S3=<your s3 endpoint> \
  BUCKET_NAME=<your s3 production bucket name>
```
- `fly deploy`

## Sources
- Nuxt https://nuxt.com (visited 7/4/24)
- Antfu ESLint Config https://github.com/antfu/eslint-config (visited 7/4/24)
- Picocss https://picocss.com (visited 7/4/24)
- Picocss Examples https://picocss.com/examples (visited 7/4/24)
- Picocss Classless Example https://x4qtf8.csb.app (visited 7/4/24)
- Devise For API-Only Rails https://dakotaleemartinez.com/tutorials/devise-jwt-api-only-mode-for-authentication/ (visited 7/18/24)
- Uploading to AWS S3 using VueJS + Nuxt, Dropzone and a Node API https://loadpixels.com/2018/11/22/uploading-to-aws-s3-using-vuejs-nuxt-dropzone-and-a-node-api/ (visited 7/19/24)
- How to Upload Files to Amazon S3 with React and AWS SDK https://dev.to/aws-builders/how-to-upload-files-to-amazon-s3-with-react-and-aws-sdk-b0n (visited 7/19/24)