module.exports = {
  title: 'xx接口文档',
  description: 'xxx · 控制台接口文档',
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }]
  ],
  // theme: 'vue',
  themeConfig: {
    lastUpdated: 'Last Updated',
    nav: [
      { text: 'Home', link: '/' },
      { text: '接口目录', link: '/apiref/' },
      { text: 'SDK说明', link: '/sdkspec/' },
      { text: 'SDK下载',
        items: [
          { text: 'PHP', link: 'https://github.com/ganl/PHP' },
          { text: 'JAVA', link: 'https://github.com/ganl/JAVA' },
          { text: 'Python', link: 'https://github.com/ganl/Python' }
        ]
      },
      { text: 'xx官网', link: 'https://www.ganl.io' },
    ],
    sidebar: 'auto',
    // sidebar: {
    //   '/apiref/': [
    //     '/apiref/',
    //     '/guide/installation',

    //   ],
    //   '/sdkspec/': [

    //   ]
    // },
    plugins: [ // 1.x+ 才有用
      [
        '@vuepress/back-to-top',
        (pluginOptions, context) => ({
          name: 'my-xxx-plugin'
          // ... the rest of options
        })
      ]
    ]
  }
}