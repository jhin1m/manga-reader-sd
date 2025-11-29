module.exports = {
  apps: [
    {
      name: "manga-reader-sd",
      script: "pnpm",
      args: "start",
      instances: 2,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3003,
      },
    },
  ],
};
