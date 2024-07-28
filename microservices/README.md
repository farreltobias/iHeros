# Microservice URL

## Description

This is the microservice solution for the ZRP challenge. the application is the backend for the ZRP threat resolution system. The application is divided into three main parts: the core, the domain, and the infrastructure. The core contains the main logic of the application, the domain contains the domain models and interfaces, and the infrastructure contains the implementation of the domain interfaces.

<!-- ## Live Demo

You can access the live demo of the application [here](https://short.farrel.tech/api). Or you can use the following base URL: `https://short.farrel.tech/`, inside the `client.http` file you can find some requests that you can use to test the API. -->

## Features

- Read the socket from ZRP threats
- Store the socket data in the database
- Send the threat data from the server socket
- Send the hero allocation from the server socket
- Cron job to resolve threats with the hero allocation
- Send the resolved threat data from the server socket

## Technologies

- [Node.js](https://nodejs.org/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Socket.io](https://socket.io/)
- [Vite](https://vitejs.dev/)
- [Docker](https://www.docker.com/)

<!-- ## Installation

To install the project, you need to have [Node.js v20](https://nodejs.org/), [pnpm](https://pnpm.io/) and [git](https://www.git-scm.com/) installed on your machine. You can use the following commands to install the project:

```bash
# Clone the repository
$ git clone https://github.com/farreltobias/microservice.git microservice

# Enter the project directory
$ cd microservice

# Install the dependencies
$ pnpm install
``` -->

## Usage

<!-- ### Running on Docker

To run the server, you need to have a PostgreSQL database and a Redis server running. You can use Docker to run these services. The docker-compose and docker file is provided in the repository and the application is configured to start in the docker environment. To start the application in a docker environment, you need to first create a `.env.development` file in the root of the project using the `.env.example` file as a template.

To generate the JWT keys, you can use the following commands (using OpenSSL):

```bash
# Generate the private and public keys
$ openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048

# Extract the public key
$ openssl rsa -pubout -in private_key.pem -out public_key.pem

# Convert the keys to base64
$ base64 -i private_key.pem -o private_key_base64.txt
$ base64 -i public_key.pem -o public_key_base64.txt
```

The txt files will give you the base64 encoded keys, you can copy the content of the files and paste them in the `.env.development` file.

After creating the `.env.development` file, you can start the application using the following command:

```bash
# Start the application in a docker environment
$ docker compose up --build -d
```

Now you can access the server on `localhost:3333`. The `client.http` file contains some requests that you can use to test the API.

### Running Locally

If you wish to run the application in a local environment, you need to have a PostgreSQL database and a Redis server running, you can use the following commands to start the services in a docker container and then run the application locally:

```bash
# Start the PostgreSQL and Redis services
$ docker compose up -d db redis

# Start the application
$ pnpm start:dev
```

Note that you need to have the `.env` file in the root of the project with the environment variables set. You can use the `.env.example` file as a template. And you need to have the JWT keys in the `.env` file as well. -->

### Running the Tests

To run the tests, you need to have the PostgreSQL database running. You can use the tutorial above to start the database in a docker container. After starting the database, you need to create a `.env.test` file in the root of the project using the `.env.example` file as a template. (The `.env` file will be used as well). You can use the following command to run the tests:

```bash
# Run the tests
$ pnpm test

# Run the tests with coverage
$ pnpm test:cov
```

<!-- # Run the e2e tests
$ pnpm test:e2e
``` -->

## Structure

The project is divided into three main parts:

1. `core`: Contains the main logic of the application.

2. `domain`: Contains the domain models and interfaces.
   - `application`: Contains the application interfaces.
     - `repositories`: Contains the repository interfaces, the abstraction of the data access layer.
     - `use-cases`: Contains the use case interfaces, the implementation of the business logic and the unit tests of the use cases.
   - `enterprise`: Contains the domain models.
     - `entities`: Contains the entity models, the representation of the domain objects.
       - `value-objects`: Contains the value object models, the representation of the domain objects that are defined by their attributes rather than their identity.

3. `infrastructure`: Contains the implementation of the domain interfaces, this specific implementation uses a POSTGRES database, with Prisma as the ORM, NestJs as the web service (API, using Express under the hood), Vite as the e2e testing framework, Redis for the cache, JWT for authentication, bcrypt for password hashing, and nanoid for generating the short URLs.
   - `auth`: Contains the authentication strategy, guard, module and current user decorator.
   - `cache`: Contains the cache module (Redis).
   - `cryptography`: Contains the cryptography module (bcrypt) and the JWT encrypter.
   - `database`: Contains the database module (Prisma) and all the database repositories implementations.
   - `env`: Contains the environment variables loader. (using zod for validation)
   - `http`: Contains the HTTP module (Express)
     - `controllers`: Contains the controllers, the implementation of the web service.
     - `pipes`: Contains the pipes, the validation of the incoming data. (using zod for validation)
     - `presenters`: Contains the presenters, the transformation of the data to be sent to the client.
 - `main`: Contains the main module, the entry point of the application.

Bonus. `test`: Contains the configuration for the unit and e2e tests, such as the test database, the test environment variables, factories, and the setup for the tests.

<!-- ### Scalability

To scale the application, we can use a queue system to handle the URL microserviceing process, we can use a message broker like RabbitMQ or Kafka, and a worker service to process the messages. This would imply the need for a new domain service, such as `notifications` and the use of the domain-event and event-handlers patterns inside the events folder of the core folder.

To all the remaining implementations, we need to add the use-cases and the controllers in their respective directories. Respecting the separation of concerns and the single responsibility principle, domain driven design, and the model-view-controller patterns. -->

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
