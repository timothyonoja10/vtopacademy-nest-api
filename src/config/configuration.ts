
export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      name: process.env.DATABASE_NAME,
    },
    mongodb: {
      uri: process.env.MONGODB_URI,
    },
    throttle: {
      ttl: process.env.THROTTLE_TTL,
      limit: process.env.THROTTLE_LIMIT
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  });