module.exports = {
  apps: [
    {
      name: 'svelteroster',
      script: './build/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        ORIGIN: 'https://roster86.com',
        NODE_OPTIONS: '--experimental-specifier-resolution=node'
      },
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000
    }
  ]
};
