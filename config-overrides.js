module.exports = function override(config, env) {
    config.output.crossOriginLoading = 'anonymous';
    return config;
  };
  