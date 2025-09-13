export const config = {
  env: process.env.NODE_ENV ?? "development",
  port: parseInt(process.env.APP_PORT ?? "3456"),
};
