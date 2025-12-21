import Constants from 'expo-constants';

const ENV = {
  dev: {
    apiUrl: 'http://localhost:3000',
  },
  staging: {
    apiUrl: 'https://your-staging-url.vercel.app',
  },
  prod: {
    apiUrl: Constants.expoConfig?.extra?.apiUrl || 'https://your-production-url.vercel.app',
  },
};

const getEnvVars = (env = Constants.expoConfig?.releaseChannel) => {
  if (__DEV__) return ENV.dev;
  if (env === 'staging') return ENV.staging;
  return ENV.prod;
};

export default getEnvVars();
