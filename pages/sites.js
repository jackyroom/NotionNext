import { LayoutWebsite } from '../themes/heo' // 确保路径正确，导入你的布局
import { getAllPosts } from '../lib/notion'   // 导入 NotionNext 内部的 API 函数

// ⚠️ 【重要】替换成你的 Notion 网站数据库的 ID
const WEBSITE_DATABASE_ID = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' 

// 1. 数据获取函数 (在构建时/服务器端运行)
export async function getStaticProps() {
  // 从指定的 Notion 数据库获取所有项目
  const notionData = await getAllPosts({ 
      notionDatabaseId: WEBSITE_DATABASE_ID,
      type: 'all' // 获取所有页面/行
  })

  // 整理数据，提取关键信息
  const sites = notionData.map(post => ({
    title: post.title, 
    link: post.pageLink, // 假设 NotionNext 已经处理了链接
    category: post.category, // 确保 Notion 列名是 Category
    desc: post.summary, // 假设 NotionNext 已经处理了简介
    // ... 你需要的所有字段
  }))

  // 提取所有独特的分类，用于左侧导航栏
  const categories = [...new Set(sites.map(s => s.category))]

  return {
    props: {
      allSites: sites,
      allCategories: categories,
      // 传递一个用于标记页面的属性，方便 LayoutWebsite 使用
      currentLayout: 'LayoutWebsite' 
    },
    revalidate: 60 // 缓存时间60秒
  }
}

// 2. 页面组件：它只是接收数据，然后交给 LayoutWebsite 渲染
const WebsitePage = (props) => {
    // props 中现在包含了 allSites 和 allCategories
    return <LayoutWebsite {...props} /> 
}

export default WebsitePage
