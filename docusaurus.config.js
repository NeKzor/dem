// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'dem.nekz.me',
  tagline: 'Documentation of the .dem file format.',
  favicon: 'img/favicon.ico',

  url: 'https://dem.nekz.me',
  baseUrl: '/',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: '.dem',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'demSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: 'https://github.com/NeKzor/dem',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Demo',
                to: '/demo',
              },
              {
                label: 'Messages',
                to: '/messages',
              },
              {
                label: 'Classes',
                to: '/classes',
              },
            ],
          },
          {
            title: 'Examples',
            items: [
              {
                label: 'Libraries',
                to: '/libraries',
              },
              {
                label: 'Showcases',
                to: '/showcases',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/NeKzor/dem',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} NeKz`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: [
          'bash',
          'csharp',
          'rust',
          'zig',
        ],
      },
    }),
};

module.exports = config;
