FROM registry.cn-shanghai.aliyuncs.com/swtsoft/web-build:python3.11-nodejs18-alpine

WORKDIR /SwiftEase/
COPY . .
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN yarn && cd /SwiftEase/examples/complex && yarn && yarn build

FROM registry.cn-shanghai.aliyuncs.com/swtsoft/web-run:openresty-1.25.3.1-2-alpine
LABEL MAINTAINER="guoxf@ants.guoxf.com"

COPY --from=0 /SwiftEase/examples/complex/dist /etc/nginx/web
