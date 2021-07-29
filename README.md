# Coding Test for Nodejs Recruitment at Spekter GmbH

Includes API Server utilities:

- [dotenv](https://www.npmjs.com/package/dotenv)
  - Dotenv is a zero-dependency module that loads environment variables from a `.env` file into `process.env`. An Example file is provided `.env.example`

Development utilities:

- [nodemon](https://www.npmjs.com/package/nodemon)
  - nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.

## Setup

```
yarn OR npm install
```

## Development

```
yarn dev OR npm run dev
```

## API

- POST http://localhost:5000/api/order with order data

  - Example

  ```
  http://localhost:5000/api/order
  ```

  ```
  {
      "phone": "+420702241333",
      "orderItems": [
          {
              "quantity": 3,
              "product": "Orange"
          },
          {
              "quantity": 2,
              "product": "Banana"
          },
          {
              "quantity": 3,
              "product": "Apple"
          }
      ]
  }
  ```

- GET http://localhost:5000/api/order/:orderId

  - Example

  ```
  http://localhost:5000/api/order/610251cd98530f0fc43cca89
  ```
