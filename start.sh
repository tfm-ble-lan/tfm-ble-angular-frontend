sed -i "s|{{API_URL}}|'$API_URL'|" src/environments/environment.prod.ts
sed -i "s|{{API_KEY}}|'$API_KEY'|" src/environments/environment.prod.ts
sed -i "s|{{API_URL}}|'$API_URL'|" src/environments/environment.ts
sed -i "s|{{API_KEY}}|'$API_KEY'|" src/environments/environment.ts

export PATH="$HOME/.npm-global/bin:$PATH"
#ng version
#ng build --configuration production
ng serve --port 80 --host 0.0.0.0 --disable-host-check

echo "Finished?"