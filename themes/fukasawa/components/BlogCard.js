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
  
  // 新增：简单的图片提取函数
  const getFirstImageFromPost = (post) => {
    if (!post) return null
    try {
      // 从摘要中提取图片URL
      if (post.summary) {
        const imgMatch = post.summary.match(/https?:\/\/[^\s"']+\.(jpg|jpeg|png|gif|webp)(\?[^\s"']*)?/i)
        if (imgMatch) return imgMatch[0]
      }
      return null
    } catch (error) {
      console.error('提取图片错误:', error)
      return null
    }
  }

  const showPreview = siteConfig('FUKASAWA_POST_LIST_PREVIEW', null, CONFIG) && post.blockMap
  
  // 原始逻辑保持不变，只在这里添加提取功能
  if (siteConfig('FUKASAWA_POST_LIST_COVER_FORCE', null, CONFIG) && post && !post.pageCoverThumbnail) {
    // 先尝试提取文章中的图片
    const firstImage = getFirstImageFromPost(post)
    if (firstImage) {
      post.pageCoverThumbnail = firstImage
    } else {
      post.pageCoverThumbnail = siteInfo?.pageCover
    }
  }

  const showPageCover = siteConfig('FUKASAWA_POST_LIST_COVER', null, CONFIG) && post?.pageCoverThumbnail
  
  // 其余代码完全保持原样...
  const FUKASAWA_POST_LIST_ANIMATION = siteConfig(
    'FUKASAWA_POST_LIST_ANIMATION',
    null,
    CONFIG
  ) || showAnimate 

  const aosProps = FUKASAWA_POST_LIST_ANIMATION ? {
    'data-aos': 'fade-up',
    'data-aos-duration': '300',
    'data-aos-once': 'true', 
    'data-aos-anchor-placement': 'top-bottom'
  } : {}

  return (
    <article
      {...aosProps}
      style={{ maxHeight: '60rem' }}
      className='w-full lg:max-w-sm p-3 shadow mb-4 mx-2 bg-white dark:bg-hexo-black-gray hover:shadow-lg duration-200'>
      <div className='flex flex-col justify-between h-full'>
        {/* 封面图部分保持原样 */}
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

        {/* 其余代码完全保持原样 */}
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
