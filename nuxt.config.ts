module.exports = {
  ssr: false,
  nitro: {
    preset: 'vercel-edge',
  },
  dev: process.env.NODE_ENV !== 'production'
};
