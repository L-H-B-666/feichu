module.exports = {
  nitro: {
    preset: 'vercel-edge',
  },
  routeRules: {// Use client-side rendering for all routes
    '/**': { ssr: false }
  },
  dev: process.env.NODE_ENV !== 'production'
};
