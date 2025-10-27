// /pages/sites.js (临时测试版本)

import { LayoutWebsite } from '../themes/heo' // 确保路径正确，导入你的布局

// ⚠️ 注意：这个版本是用来测试路由和布局的，它不依赖 Notion API！

// 临时假数据 (Mock Data)
const MOCK_SITES = [
    { title: 'Google (假)', link: '#', category: '常用', desc: '测试数据 1' },
    { title: 'BiliBili (假)', link: '#', category: '常用', desc: '测试数据 2' },
    { title: 'Unsplash (假)', link: '#', category: '图片', desc: '测试数据 3' },
    { title: 'Midjourney (假)', link: '#', category: 'AI', desc: '测试数据 4' },
]

// 临时假分类
const MOCK_CATEGORIES = ['常用', '图片', 'AI']


// 1. 数据获取函数 (不再调用 Notion API)
export async function getStaticProps() {
  
  // ⛔️ 删除了所有 Notion API 相关的代码，直接返回假数据
  
  return {
    props: {
      // 传递假数据，但属性名要和 LayoutWebsite 预期接收的一致
      allSites: MOCK_SITES,
      allCategories: MOCK_CATEGORIES,
      currentLayout: 'LayoutWebsite' 
    },
    // 即使是假数据，Next.js 也要处理缓存
    revalidate: 1 
  }
}

// 2. 页面组件：它只是接收数据，然后交给 LayoutWebsite 渲染
const WebsitePage = (props) => {
    return <LayoutWebsite {...props} /> 
}

export default WebsitePage
