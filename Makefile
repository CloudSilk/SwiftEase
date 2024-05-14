IMAGE=registry.cn-shanghai.aliyuncs.com/antshome/SwiftEase:1.0.0
build-image:
	# npm run build
	docker build -f Dockerfile -t $(IMAGE) .
test-image:
	docker run -p 8001:80 --rm $(IMAGE)
push-image:
	docker push $(IMAGE)
clean:
	rm -rf atali/components/dist
	rm -rf atali/curd/dist
	rm -rf atali/form/dist
	rm -rf atali/graph/dist
	rm -rf atali/pkg/dist
	rm -rf designable/formily/antd/dist
	rm -rf designable/formily/setters/dist
	rm -rf designable/formily/transformer/dist
	rm -rf designable/packages/core/dist
	rm -rf designable/packages/flow/dist
	rm -rf designable/packages/react-settings-form/dist
	rm -rf designable/packages/react/dist
	rm -rf designable/packages/shared/dist
	rm -rf formily/packages/components/dist
publish:
	# yarn build
	# cd atali/components && yarn publish --registry=https://registry.npmjs.org/
	# cd atali/curd && yarn publish --registry=https://registry.npmjs.org/
	# cd atali/form/ && yarn publish --registry=https://registry.npmjs.org/
	cd atali/graph && yarn publish --registry=https://registry.npmjs.org/
	cd atali/pkg && yarn publish --registry=https://registry.npmjs.org/
	cd designable/formily/antd && yarn publish --registry=https://registry.npmjs.org/
	cd designable/formily/setters && yarn publish --registry=https://registry.npmjs.org/
	cd designable/formily/transformer && yarn publish --registry=https://registry.npmjs.org/
	cd designable/packages/core && yarn publish --registry=https://registry.npmjs.org/
	cd designable/packages/flow && yarn publish --registry=https://registry.npmjs.org/
	cd designable/packages/react-settings-form && yarn publish --registry=https://registry.npmjs.org/
	cd designable/packages/react && yarn publish --registry=https://registry.npmjs.org/
	cd designable/packages/shared && yarn publish --registry=https://registry.npmjs.org/
	cd formily/packages/components && yarn publish --registry=https://registry.npmjs.org/