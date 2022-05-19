module.exports = {
  server: {
    port: process.env.PORT || 4444,
  },
  rpcUser: process.env.RPC_USER || 'user',
  rpcPassword: process.env.RPC_PASSWORD || 'password',
  rpcPort: process.env.RPC_PORT || 9999,
};
