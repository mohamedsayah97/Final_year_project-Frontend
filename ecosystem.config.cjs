module.exports = {
  apps: [{
    name: "react-app",
    script: "serve",
    args: "-s dist -l 5173",
    instances: 1,
    exec_mode: "fork",
    env: {
      NODE_ENV: "production"
    }
  }]
};