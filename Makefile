build-all:
	yarn build && docker build -t mdc-console:latest .

build:
	docker build -t mdc-console:latest .


.PHONY: build-all build 