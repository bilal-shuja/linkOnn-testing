module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'demo.socioon.com',
        pathname: '/uploads/**', 
      },
      {
        protocol: 'https',
        hostname: 'demo.socioon.com',
        pathname: '/__uploads/**', 
      },
    ],
  },
};
