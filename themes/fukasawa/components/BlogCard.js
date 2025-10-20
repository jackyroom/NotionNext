import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import TagItemMini from './TagItemMini'

/**
 * 文章列表卡片
 * @param {*} param0
 * @returns
 */
const BlogCard = ({ showAnimate, post, showSummary }) => {
  const { siteInfo } = useGlobal()
  const showPreview = siteConfig('FUKASAWA_POST_LIST_PREVIEW', null, CONFIG) && post.blockMap
  
  // 完全保持原有逻辑，只在这里添加图片提取功能
  if (siteConfig('FUKASAWA_POST_LIST_COVER_FORCE', null, CONFIG) && post && !post.pageCover) {
    
    // 新增：直接从blockMap中提取第一张图片
    const getFirstImageFromBlockMap = () => {
      if (!post?.blockMap) return null
      
      try {
        // 遍历所有block，找到第一个图片block
        for (const blockId in post.blockMap) {
          const block = post.blockMap[blockId]
          if (block?.value?.type === 'image') {
            const imageUrl = block.value?.properties?.source?.[0]?.[0] || 
                           block.value?.format?.display_source
            if (imageUrl && !imageUrl.includes('page-cover')) {
              console.log('找到文章图片:', imageUrl) // 调试用
              return imageUrl
            }
          }
        }
      } catch (e) {
        console.log('提取图片出错:', e)
      }
      return null
    }

    // 尝试提取文章第一张图片
    const firstImage = getFirstImageFromBlockMap()
    if (firstImage) {
      // 直接替换封面为文章第一张图片
      post.pageCoverThumbnail = firstImage
    } else {
      // 如果提取失败，使用原来的默认封面
      post.pageCoverThumbnail = siteInfo?.pageCover
    }
  }

  const showPageCover = siteConfig('FUKASAWA_POST_LIST_COVER', null, CONFIG) && post?.pageCoverThumbnail
    
  const FUKASAWA_POST_LIST_ANIMATION = siteConfig(
    'FUKASAWA_POST_LIST_ANIMATION',
    null,
    CONFIG
  ) || showAnimate 

  // 动画样式
  const aosProps = FUKASAWA_POST_LIST_ANIMATION
    ? {
        'data-aos': 'fade-up',
        'data-aos-duration': '300',
        'data-aos-once': 'true',
        'data-aos-anchor-placement': 'top-bottom'
      }
    : {}

  return (
    <article
      {...aosProps}
      style={{ maxHeight: '60rem' }}
      className='w-full lg:max-w-sm p-3 shadow mb-4 mx-2 bg-white dark:bg-hexo-black-gray hover:shadow-lg duration-200'>
      <div className='flex flex-col justify-between h-full'>
        {/* 封面图 */}
        {showPageCover && (
          <SmartLink href={post?.href} passHref legacyBehavior>
            <div className='flex-grow mb-3 w-full duration-200 cursor-pointer transform overflow-hidden'>
              <LazyImage
                src={post?.pageCoverThumbnail}
                alt={post?.title || siteConfig('TITLE')}
                className='object-cover w-full h-full hover:scale-125 transform duration-500'
              />
            </div>
          </SmartLink>
        )}

        {/* 文字部分 */}
        <div className='flex flex-col w-full'>
          <h2>
            <SmartLink
              passHref
              href={post?.href}
              className={`break-words cursor-pointer font-bold hover:underline text-xl ${showPreview ? 'justify-center' : 'justify-start'} leading-tight text-gray-700 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400`}>
              {siteConfig('POST_TITLE_ICON') && (
                <NotionIcon icon={post.pageIcon} />
              )}{' '}
              {post.title}
            </SmartLink>
          </h2>

          {(!showPreview || showSummary) && (
            <main className='my-2 tracking-wide line-clamp-3 text-gray-800 dark:text-gray-300 text-md font-light leading-6'>
              {post.summary}
            </main>
          )}

          {/* 分类标签 */}
          <div className='mt-auto justify-between flex'>
            {post.category && (
              <SmartLink
                href={`/category/${post.category}`}
                passHref
                className='cursor-pointer dark:text-gray-300 font-light text-sm hover:underline hover:text-indigo-700 dark:hover:text-indigo-400 transform'>
                <i className='mr-1 far fa-folder' />
                {post.category}
              </SmartLink>
            )}
            <div className='md:flex-nowrap flex-wrap md:justify-start inline-block'>
              <div>
                {post.tagItems?.map(tag => (
                  <TagItemMini key={tag.name} tag={tag} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default BlogCard
