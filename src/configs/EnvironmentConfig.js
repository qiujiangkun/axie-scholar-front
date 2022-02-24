const dev = {
  API_ENDPOINT_URL: 'http://localhost:8080'
};

const prod = {
  API_ENDPOINT_URL: 'https://api.prod.com'
};

const test = {
  API_ENDPOINT_URL: 'https://chonky.pathscale.com:8600'
};

const getEnv = () => {
	return dev;
	switch (process.env.NODE_ENV) {
		case 'development':
			return dev
		case 'production':
			return prod
		case 'test':
			return test
		default:
			break;
	}
}

export const env = getEnv()
