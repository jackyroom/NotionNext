import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import TagItemMini from './TagItemMini'

/**
 * 文章列表卡片
 */
const BlogCard = ({ showAnimate, post, showSummary }) => {
  const { siteInfo } = useGlobal()
  const showPreview = siteConfig('FUKASAWA_POST_LIST_PREVIEW', null, CONFIG) && post.blockMap
  
  // 简化版：直接从文章内容中提取第一张真实图片
  const extractFirstRealImage = () => {
    if (!post) return null
    
    // 1. 从blockMap中提取真实的文章图片（不是封面图）
    if (post.blockMap) {
      try {
        const blocks = Object.values(post.blockMap).flat()
        // 寻找第一个类型为image的block，且不是封面图
        const imageBlock = blocks.find(block => {
          const value = block.value
          if (value?.type === 'image') {
            const imageUrl = value?.format?.display_source || value?.properties?.source?.[0]?.[0]
            // 排除Notion默认封面图
            if (imageUrl && !imageUrl.includes('page-cover')) {
              return true
            }
          }
          return false
        })
        
        if (imageBlock?.value) {
          const imageUrl = imageBlock.value.format?.display_source || 
                          imageBlock.value.properties?.source?.[0]?.[0]
          if (imageUrl && !imageUrl.includes('page-cover')) {
            return imageUrl
          }
        }
      } catch (e) {
        console.log('从blockMap提取图片失败:', e)
      }
    }
    
    // 2. 从content中提取图片URL（如果有的话）
    if (post.content) {
      try {
        // 匹配文章内容中的图片URL，排除封面图
        const imgRegex = /https?:\/\/[^\s"']+\.(jpg|jpeg|png|gif|webp)(\?[^\s"']*)?/gi
        const matches = post.content.match(imgRegex)
        if (matches) {
          // 找到第一个不是封面图的图片
          const realImage = matches.find(url => !url.includes('page-cover'))
          if (realImage) return realImage
        }
      } catch (e) {
        console.log('从content提取图片失败:', e)
      }
    }
    
    return null
  }

  // 完全保持原有逻辑，只在需要时替换封面
  let finalCover = post?.pageCoverThumbnail
  
  // 只有在强制显示封面且当前没有封面时，才使用文章第一张图片
  if (siteConfig('FUKASAWA_POST_LIST_COVER_FORCE', null, CONFIG) && post && !finalCover) {
    const firstRealImage = extractFirstRealImage()
    if (firstRealImage) {
      finalCover = firstRealImage
    } else {
      finalCover = siteInfo?.pageCover
    }
  }

  const showPageCover = siteConfig('FUKASAWA_POST_LIST_COVER', null, CONFIG) && finalCover
    
  const FUKASAWA_POST_LIST_ANIMATION = siteConfig(
    'FUKASAWA_POST_LIST_ANIMATION',
    null,
    CONFIG
  ) || showAnimate 

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
                src={finalCover}
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
