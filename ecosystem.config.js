module.exports = {
    apps: [
      {
        name: 'ecosoul-datahive',
        script: 'pnpm',
        args: 'run prod',
        cwd: __dirname,
        env: {
          NODE_ENV: 'production',
          PORT: '5052' // optional; your prod script already uses --port 5052
        },
        autorestart: true,
        watch: false,
        max_memory_restart: '512M',
        kill_timeout: 5000
      }
    ]
  };