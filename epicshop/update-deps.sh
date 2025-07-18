npx npm-check-updates --dep prod,dev --upgrade --workspaces --root --reject react,react-dom,react-server-dom-esm
cd epicshop && npx npm-check-updates --dep prod,dev --upgrade --root
cd ..
rm -rf node_modules package-lock.json ./epicshop/package-lock.json ./epicshop/node_modules ./exercises/**/node_modules
npm install
npm run setup
npm run typecheck
npm run lint -- --fix
