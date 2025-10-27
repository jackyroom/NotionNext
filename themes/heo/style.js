/* eslint-disable react/no-unknown-property */
/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  return (
    <style jsx global>{`
      body {
        background-color: #f7f9fe;
      }
      
      /* ------------------------------------------------------------- */
      /* LayoutWebsite 的自定义样式 */
      /* ------------------------------------------------------------- */
      
      /* **网站布局容器**：移除边框并确保占据全宽 */
      .sites-page-container > .flex.w-full {
          /* 移除 LayoutWebsite 上的默认边框 */
          border: none !important;
          max-width: none !important; 
      }
      
      /* 左侧边栏容器样式 */
      .website-sidebar {
        /* 基础布局 */
        width: 180px;
        flex-shrink: 0;
        /* 样式 */
        background-color: #ffffff; /* 亮色模式下的背景 */
        border-right: 1px solid #e5e7eb; /* 浅灰色边框 */
        padding: 20px 0;
      }

      /* 黑暗模式：website-sidebar 容器 */
      .dark .website-sidebar {
        background-color: #2c2d30;
        border-color: #4b5563; 
      }

      /* 左侧导航项（分类）样式 */
      .website-sidebar .tab-item {
        /* 基础样式 */
        cursor: pointer;
        padding: 10px 20px;
        font-size: 16px;
        transition: all 0.2s;
        color: #1f2937; 
      }

      /* 黑暗模式：导航项文本颜色 */
      .dark .website-sidebar .tab-item {
        color: #d1d5db; 
      }

      /* 左侧导航项 Hover 效果 */
      .website-sidebar .tab-item:hover {
        background-color: #f0f2f5; 
      }

      /* 黑暗模式：导航项 Hover 效果 */
      .dark .website-sidebar .tab-item:hover {
        background-color: #3d3f44;
      }

      /* 左侧导航项 Active 状态样式 */
      .website-sidebar .tab-item.active {
        /* 重点：高亮样式 */
        font-weight: bold;
        color: #4f46e5; 
        background-color: #eef2ff; 
        border-left: 4px solid #4f46e5;
      }

      /* 黑暗模式：导航项 Active 状态样式 */
      .dark .website-sidebar .tab-item.active {
        color: #818cf8; 
        background-color: #3d3f44;
      }


      /* **网站卡片 Grid 容器样式** */
      .website-grid {
        display: grid;
        /* 自动适应列数，最小宽度 180px */
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 16px; /* 卡片之间的间距 */
        padding: 0;
      }

      /* **网站卡片链接样式** - 使用 !important 强制覆盖 */
      .website-card {
        display: block !important;
        padding: 16px !important;
        border-radius: 12px !important;
        transition: all 0.2s !important;
        text-decoration: none !important; 
        background-color: #ffffff !important;
        border: 1px solid #e5e7eb !important;
        color: #1f2937 !important; 
        min-height: 80px !important; 
      }

      /* 黑暗模式：网站卡片 */
      .dark .website-card {
        background-color: #2c2d30 !important;
        border-color: #4b5563 !important;
        color: #d1d5db !important; 
      }
      
      /* 网站卡片 Hover 效果 */
      .website-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        transform: translateY(-2px) !important; 
      }

      /* 黑暗模式：卡片 Hover 边框高亮 */
      .dark .website-card:hover {
         border-color: #818cf8 !important; 
      }

      /* ------------------------------------------------------------- */
      /* 【重点】强制隐藏 sites 页面上的多余元素和布局残留 */
      /* ------------------------------------------------------------- */

      /* 隐藏 LayoutBase 内部的默认右侧栏 SideRight 及其相关卡片（中间和右侧的黑洞/卡片）*/
      #container-inner > .lg\\:px-2, /* 移除中间的间隔 */
      #container-inner > .hidden.xl\\:block { /* 移除右侧栏容器 */
          display: none !important;
      }
      
      /* 确保你的内容容器能够完全占据空间 */
      .sites-page-container {
          width: 100% !important; 
          min-height: calc(100vh - 100px); /* 确保高度足够 */
      }


      /* ------------------------------------------------------------- */
      /* 原始样式 (保留) */
      /* ------------------------------------------------------------- */

      // 公告栏中的字体固定白色
      #theme-heo #announcement-content .notion {
        color: white;
      }

      ::-webkit-scrollbar-thumb {
        background: rgba(60, 60, 67, 0.4);
        border-radius: 8px;
        cursor: pointer;
      }

      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      #more {
        white-space: nowrap;
      }

      .today-card-cover {
        -webkit-mask-image: linear-gradient(to top, transparent 5%, black 70%);
        mask-image: linear-gradient(to top, transparent 5%, black 70%);
      }

      .recent-top-post-group::-webkit-scrollbar {
        display: none;
      }

      .scroll-hidden::-webkit-scrollbar {
        display: none;
      }

      * {
        box-sizing: border-box;
      }

      // 标签滚动动画
      .tags-group-wrapper {
        animation: rowup 60s linear infinite;
      }

      @keyframes rowup {
        0% {
          transform: translateX(0%);
        }
        100% {
          transform: translateX(-50%);
        }
      }
    `}</style>
  )
}

export { Style }
