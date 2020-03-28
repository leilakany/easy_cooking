# Easy cooking

## How to compile
First, install dependencies for both node projects.
```javascript
cd frontend/
npm install
cd ../backend/
npm install
```
Then, make sure you have Mongo running and add to a `.env` file the variable `DATABASE_URL` containing the url of your mongodb.

```
echo DATABASE_URL=... > .env
source .env
```

## How to run
Run both server using `npm start`
