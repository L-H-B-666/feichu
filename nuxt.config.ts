module.exports = {
  nitro: {
    preset: 'vercel-edge',
  },
  dev: process.env.NODE_ENV !== 'production'
};
