export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    exp: process.env.JWT_EXP || '30m',
  },
});
