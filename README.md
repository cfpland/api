# CFP Land API

This project contains the CFP Land API, mailer, and collector. It can be run locally with Docker and deployed to Heroku.

## Usage

### Starting the API and Database

- Build the Docker image: `docker build -t karllhughes/cfpland .`
- Run the API and DB containers: `docker-composer up`

### Running NPM commands
- Run NPM commands within the running containers: `docker exec -it -e AT_API_KEY=... cfpland_api_1 npm run COMMAND` 
  - See `.secrets` file for all env variables
  - To send emails for real, use the Mailchimp and Sendgrid keys.

## Testing
- Run e2e tests locally (when containers are running): `docker exec -it api_api_1 npm run test:e2e`
  - Run a single e2e test: `docker exec -it api_api_1 npm run test:e2e -- user-conferences.e2e-spec.ts`
- Run prettier to fix linting issues: `npm run format`
- Run liter: `npm run lint`

## Deploying

This project deploys automatically using Heroku.

## License

This project uses the MIT License. See the `LICENSE` file for details.
