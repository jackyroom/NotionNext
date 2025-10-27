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
        border-color: #4b5563; /* dark:border-gray-600 */
      }

      /* 左侧导航项（分类）样式 */
      .website-sidebar .tab-item {
        /* 基础样式 */
        cursor: pointer;
        padding: 10px 20px;
        font-size: 16px;
        transition: all 0.2s;
        color: #1f2937; /* 亮色默认文本颜色 */
      }

      /* 黑暗模式：导航项文本颜色 */
      .dark .website-sidebar .tab-item {
        color: #d1d5db; /* dark:text-gray-300 */
      }

      /* 左侧导航项 Hover 效果 */
      .website-sidebar .tab-item:hover {
        background-color: #f0f2f5; /* Hover 背景色 */
      }

      /* 黑暗模式：导航项 Hover 效果 */
      .dark .website-sidebar .tab-item:hover {
        background-color: #3d3f44;
      }

      /* 左侧导航项 Active 状态样式 */
      .website-sidebar .tab-item.active {
        /* 重点：高亮样式 */
        font-weight: bold;
        color: #4f46e5; /* 紫色高亮 */
        background-color: #eef2ff; /* 浅紫色背景 */
        border-left: 4px solid #4f46e5;
      }

      /* 黑暗模式：导航项 Active 状态样式 */
      .dark .website-sidebar .tab-item.active {
        color: #818cf8; /* dark:text-indigo-400 */
        background-color: #3d3f44;
      }


      /* 右侧网站卡片 Grid 容器样式 */
      .website-grid {
        display: grid;
        /* 自动适应列数，最小宽度 180px */
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 16px; /* 卡片之间的间距 */
        padding: 0;
      }

      /* 网站卡片链接样式 */
      .website-card {
        /* 确保卡片是块级元素 */
        display: block;
        padding: 16px;
        border-radius: 12px;
        transition: all 0.2s;
        text-decoration: none; /* 去掉链接下划线 */
        /* 卡片背景和边框 */
        background-color: #ffffff;
        border: 1px solid #e5e7eb;
        /* 卡片文本颜色（继承自父级，但显式设置以防万一） */
        color: #1f2937;
      }

      /* 黑暗模式：网站卡片 */
      .dark .website-card {
        background-color: #2c2d30;
        border-color: #4b5563;
        color: #d1d5db; /* 确保卡片内文本在暗黑模式可见 */
      }

      /* 网站卡片 Hover 效果 */
      .website-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px); /* 轻微上浮 */
      }

      /* 黑暗模式：卡片 Hover 边框高亮 */
      .dark .website-card:hover {
         border-color: #818cf8; /* dark:hover:border-indigo-400 */
      }

      /* ------------------------------------------------------------- */
      /* 【新增】强制隐藏 sites 页面上的多余元素 */
      /* ------------------------------------------------------------- */

      /* 隐藏左侧图标导航栏 (HEO主题默认) */
      .sites-page-container ~ #side-right, /* 确保也隐藏了默认的右侧边栏（如果 index.js 没生效）*/
      .sites-page-container #container-inner > .flex-grow > div:first-child:not(.website-sidebar) {
          display: none !important;
      }

      /* 隐藏顶部导航栏（如图 image_30a9bb.jpg 所示的顶部多余菜单） */
      /* 我们假设顶部多余的元素在 LayoutBase 的 slotTop 中或者它是一个单独的全局组件 */
      /* 这是一个更广泛的尝试来清除所有不属于 Header/Footer 的元素 */
      #theme-heo #wrapper-outer > .w-full.mx-auto.relative > div:first-child > div:first-child:not(.flex.w-full) {
          display: none !important;
      }
      
      /* 针对图片中显示的主页卡片（如 JackyLearningRes），它们通常在 #side-right 或主页特定容器内 */
      /* 确保 #container-inner 内部，只有你的 .flex.w-full (即 sites 布局) 及其兄弟元素显示 */
      .sites-page-container {
          /* 确保 sites 容器不被主题其他 flex-grow 元素影响 */
          flex-grow: 1 !important;
          max-width: none !important; /* 确保它能适应父容器 */
      }
      
      /* 隐藏 LayoutBase 内部的默认右侧栏 SideRight 及其相关卡片（如果 index.js 没生效）*/
      .sites-page-container ~ .hidden.xl\:block, 
      .sites-page-container ~ #container-inner > .hidden.xl\:block {
          display: none !important;
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
