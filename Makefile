# Version 20240804 Added other deploy paths

deployTestBackend:
	cd ../liftup-backend && \
	git checkout -b dev && \
	git fetch && \
	git merge origin/dev -m "Automerged by Makefile" && \
	npm install --silent && \
	pm2 restart liftup-backend && cd -

deployProdBackend:
	cd ../liftup-backend && \
	git checkout -b main && \
	git fetch && \
	git merge origin/main -m "Automerged by Makefile" && \
	npm install --silent && \
	pm2 restart liftup-backend && cd -

deployTestFrontend:
	cd ../liftup-frontend && \
	git checkout -b dev && \
	git fetch && \
	git merge origin/dev -m "Auto-merged by Makefile" && \
	npm install --silent && \
	npm run build && cd -

deployProdFrontend:
	cd ../liftup-frontend && \
	git checkout -b main && \
	git fetch && \
	git merge origin/main -m "Auto-merged by Makefile" && \
	npm install --silent && \
	npm run build && cd -

deployTestWebhooks:
	cd . && \
	git checkout -b dev && \
	git fetch && \
	git merge origin/dev -m "Auto-merged by Makefile" && \
	npm install --silent && \
	pm2 restart liftup-webhooks && cd -

deployProdWebhooks:
	cd . && \
	git checkout -b main && \
	git fetch && \
	git merge origin/main -m "Auto-merged by Makefile" && \
	npm install --silent && \
	pm2 restart liftup-webhooks && cd -

