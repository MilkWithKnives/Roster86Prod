module.exports = {
  apps: [
    {
      name: 'svelteroster',
      script: './build/index.js',
      instances: 1, // Changed from 'max' to 1 to prevent port conflicts
      exec_mode: 'fork', // Changed from 'cluster' to 'fork' for better ES module support
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        ORIGIN: 'https://roster86.com',
        NODE_OPTIONS: '--experimental-specifier-resolution=node',
        DATABASE_URL: 'postgresql://vultradmin:Fuckstick!@vultr-prod-0274b390-8a2c-4950-963c-f8c94271df22-vultr-prod-42ab.vultrdb.com:16751/defaultdb?sslmode=require',
        AUTH_URL: 'https://roster86.com',
        RESEND_API_KEY: 're_gntcQ4Rj_5Lg4a97ufJidbQZp9DizpEaV',
        EMAIL_FROM: 'SvelteRoster <onboarding@resend.dev>',
        PUBLIC_APP_URL: 'https://roster86.com',
        PUBLIC_VAPID_KEY: 'BGx81CMybwYjnoGcCJprCB1c2XtXSBWuBvidk2xY1fdUkh4cnR87f7MtNU9MAp2DpHgkIAje5Os-oTKes8lkU8I',
        PRIVATE_VAPID_KEY: '3GbAyvc8RliXflA3r3KjddpbM_rnPmH5KOp0kcqzPkI',
        AUTH_SECRET: 'sY9sd9anwIhejBNixziI9e6VHRvtEQvC5mRs55XY4B8=',
        AUTH_TRUST_HOST: 'true',
        TRUSTED_HOSTS: 'roster86.com,https://roster86.com',
        ANTHROPIC_API_KEY: 'sk-ant-api03-your-anthropic-api-key-here'
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
      listen_timeout: 10000,
      restart_delay: 1000,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
