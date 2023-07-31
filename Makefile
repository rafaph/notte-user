include ../../Makefile
DEV_DIR=../..
SERVICE=user

.PHONY: build
build:
	$(call compose,build --no-cache && $(call down))

.PHONY: up
up:
	$(call compose,up mysql -d)

.PHONY: shell
shell:
	$(call run,bash)

.PHONY: test
test:
	$(call run,npm run test)

.PHONY: test-cov
test-cov:
	$(call run,npm run test:cov)

.PHONY: test-unit
test-unit:
	$(call run,npm run test:unit)

.PHONY: test-e2e
test-e2e:
	$(call run,npm run test:e2e)

.PHONY: lint
lint:
	$(call run,npm run lint)

.PHONY: lint-fix
lint-fix:
	$(call run,npm run lint:fix)

.PHONY: check-updates
check-updates:
	$(call run,npm run check-updates)
