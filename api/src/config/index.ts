export default {
  // db config
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE_NAME: process.env.DB_DATABASE_NAME,

  // integration config
  KAWA_INTEGRATION_KEY: process.env.KAWA_INTEGRATION_KEY,
  KAWA_SECRET_TEST_KEY: process.env.KAWA_SECRET_TEST_KEY,
  KAWA_SECRET_LIVE_KEY: process.env.KAWA_SECRET_LIVE_KEY,
  KAWA_SDK_BASE_URL: process.env.KAWA_SDK_BASE_URL,
};
