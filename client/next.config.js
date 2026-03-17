const { withSentryConfig } = require("@sentry/nextjs");
const config = require("../config");
const { version } = require("./package.json");

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  publicRuntimeConfig: {
    SQ_SITE_NAME: config.envs?.SQ_SITE_NAME,
    SQ_SITE_DESCRIPTION: config.envs?.SQ_SITE_DESCRIPTION,
    SQ_CUSTOM_THEME: config.envs?.SQ_CUSTOM_THEME,
    SQ_ALLOW_REGISTER: config.envs?.SQ_ALLOW_REGISTER,
    SQ_ALLOW_ANONYMOUS_UPLOADS: config.envs?.SQ_ALLOW_ANONYMOUS_UPLOADS,
    SQ_MINIMUM_RATIO: config.envs?.SQ_MINIMUM_RATIO,
    SQ_MAXIMUM_HIT_N_RUNS: config.envs?.SQ_MAXIMUM_HIT_N_RUNS,
    SQ_TORRENT_CATEGORIES: config.envs?.SQ_TORRENT_CATEGORIES,
    SQ_BP_EARNED_PER_GB: config.envs?.SQ_BP_EARNED_PER_GB,
    SQ_BP_EARNED_PER_FILLED_REQUEST: config.envs?.SQ_BP_EARNED_PER_FILLED_REQUEST,
    SQ_BP_COST_PER_INVITE: config.envs?.SQ_BP_COST_PER_INVITE,
    SQ_BP_COST_PER_GB: config.envs?.SQ_BP_COST_PER_GB,
    SQ_SITE_WIDE_FREELEECH: config.envs?.SQ_SITE_WIDE_FREELEECH,
    SQ_ALLOW_UNREGISTERED_VIEW: config.envs?.SQ_ALLOW_UNREGISTERED_VIEW,
    SQ_EXTENSION_BLACKLIST: config.envs?.SQ_EXTENSION_BLACKLIST,
    SQ_SITE_DEFAULT_LOCALE: config.envs?.SQ_SITE_DEFAULT_LOCALE,
    SQ_BASE_URL: config.envs?.SQ_BASE_URL,
    SQ_API_URL: config.envs?.SQ_API_URL,
    SQ_VERSION: version,
  },
  serverRuntimeConfig: {
    ...config.envs,
    ...config.secrets,
  },
};

module.exports = nextConfig;
