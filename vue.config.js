module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/bytes-to-wav/'
    : '/',
  devServer: {
    disableHostCheck: true,
  },
}