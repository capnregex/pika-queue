TESTS = test/*.js
SHELL := /bin/bash
SERVERLOG = ./tmp/test.log
SERVERPID = ./tmp/server.pid
OS = $(shell uname)
ETCOK = $(shell cat /etc/hosts | grep local.ifit-dev.com | wc -l | tr -d ' ')

main:
	@echo "Available tasks:"
	@echo "    run"
	@echo "    test"
	@echo "    mocha"
	@echo "    mocha-watch"
	@echo "    less"
	@echo "    less-watch"
	@echo "    update"
	@echo "    install"
	@echo "    git-init"
	@echo "    build"
	@echo "   *clean"
	@echo "   *new-project"
	@echo
	@echo "* - will remove git repo"


test: server-start mocha server-stop

mocha:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter spec \
		--ui bdd \
		$(TESTS)

mocha-watch:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter spec \
		--ui bdd \
		--watch \
		$(TESTS)

server-start:
	@printf "\e[0;31m"
	@ echo ''
	@ -mkdir -p `dirname $(SERVERLOG)` 2>&1
	@ echo -n 'Starting Server... '
	@(NODE_DISABLE_COLORS=1 NODE_ENV=test node ./server.js > $(SERVERLOG) 2>&1 & \
		sleep 0.3 \
		&& echo $$! > $(SERVERPID) \
		&& echo 'DONE')
	@printf "\e[m"
	
server-stop:
	@printf "\e[0;31m"
	@ echo -n 'Shutting down Server... '
	@ -kill -9 `cat $(SERVERPID)` > /dev/null 2>&1
	@ echo 'DONE'
	@ echo ''
	@printf "\e[m"
	@ -rm -f $(SERVERPID)
	@ echo "Server log found in '$(SERVERLOG)'"
	@ echo ''

run:
	./bin/watch.sh

docs:
	@printf "\e[0;31m"
	@echo BUILDING DOCS
	@printf "\e[m"
	@rm -rf docs
	@./node_modules/.bin/docco-husky \
		-name "`pwd | tr '/' '\n' | tail -1 | tr -d '\n' | tr '-' ' '`" \
		index.js \
		lib/*.js \
		models/*.js \
		controllers/*.js \
		public/js/*.js \
		app.js \
		server.js

build: less docs
	rm -rf ./public/js/.build
	mkdir ./public/js/.build
	@printf "\e[0;31m"
	@echo COMPILING JAVASCRIPT
	@printf "\e[m"
	node ./bin/compile.js

less-watch: less
	@sleep 100000000

less:
	@printf "\e[0;31m"
	@echo -n COMPILING CSS...
	@./node_modules/.bin/lessc -x public/less/main.less public/css/style.css
	@rm -f public/css/tmp.less
	@echo DONE
	@printf "\e[m"

new-project: clean install git-init

clean:
	@printf "\e[0;31m"
	@echo REMOVING GIT REPO
	@printf "\e[m"
	rm -rf .git
	rm -rf README.md

git-init:
	@printf "\e[0;31m"
	@echo INITING GIT REPO
	@printf "\e[m"
	git init
	git add .
	git commit -m "Initial commit"

update: install

install: ${OS}-install npm-install build check-hosts
	touch README

check-hosts: check-hosts-${ETCOK}

check-hosts-0:
	@printf "\e[0;31m"
	@echo WARN:
	@echo WARN: You dont appear to have your hosts file setup.
	@echo WARN: Please add the following line to /etc/hosts
	@echo WARN: to make sessions work properly:
	@echo WARN:
	@echo "WARN:    127.0.0.1   local.ifit-dev.com"
	@echo WARN:
	@printf "\e[m"

check-hosts-1:
	@#

check-hosts-2:
	@#

npm-install:
	@printf "\e[0;31m"
	@echo INSTALLING NPM MODULES
	@printf "\e[m"
	npm install

Linux-install:
	sed -i s/YOUR-REPO-NAME/`pwd | tr '/' '\n' \
		| tail -1 | tr -d '\n'`/g `find . -type f | grep -v Makefile | grep -v .git | grep -v node_modules`

Darwin-install:
	sed -i "" s/YOUR-REPO-NAME/`pwd | tr '/' '\n' \
		| tail -1 | tr -d '\n'`/g `find . -type f | grep -v Makefile | grep -v .git | grep -v node_modules`

.PHONY: docs
