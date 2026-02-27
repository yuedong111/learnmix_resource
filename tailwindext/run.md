```bash
npm init -y
npm i tailwindcss @tailwindcss/cli --include=optional
npx tailwindcss -i ./src/app.css -o ./dist/app.css --watch

npx serve . 
```