import type { NextConfig } from 'next';
import type { Configuration, RuleSetRule } from 'webpack';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  images: {
    domains: ['api.dev.chat.ktsf.ru', 'api.test.chat.ktsf.ru'],
  },

  webpack(config): Configuration {
    const fileLoaderRule = config.module.rules.find(
      (rule: RuleSetRule): boolean => rule.test instanceof RegExp && rule.test.test('.svg'),
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },

      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ['@svgr/webpack'],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
