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
        console.log('开始搜索blockMap中的图片...', post.blockMap) // 调试
        
        // 遍历所有block，找到第一个图片block
        for (const blockId in post.blockMap) {
          const block = post.blockMap[blockId]
          const value = block?.value
          
          if (!value) continue
          
          console.log('检查block:', blockId, value.type) // 调试
          
          // 检查是否是图片block
          if (value.type === 'image') {
            let imageUrl = value?.format?.display_source || 
                          value?.properties?.source?.[0]?.[0]
            
            console.log('找到图片block:', imageUrl) // 调试
            
            if (imageUrl) {
              // 解码URL（Notion图片URL通常是编码的）
              try {
                imageUrl = decodeURIComponent(imageUrl)
              } catch (e) {
                // 如果解码失败，使用原URL
              }
              
              // 排除封面图，只返回文章内容中的图片
              if (!imageUrl.includes('page-cover')) {
                console.log('使用文章图片:', imageUrl) // 调试
                return imageUrl
              }
            }
          }
          
          // 检查子block（如果有的话）
          if (value.content && Array.isArray(value.content)) {
            for (const childId of value.content) {
              const childBlock = post.blockMap[childId]
              if (childBlock?.value?.type === 'image') {
                let childImageUrl = childBlock.value?.format?.display_source || 
                                  childBlock.value?.properties?.source?.[0]?.[0]
                
                console.log('找到子图片block:', childImageUrl) // 调试
                
                if (childImageUrl && !childImageUrl.includes('page-cover')) {
                  try {
                    childImageUrl = decodeURIComponent(childImageUrl)
                  } catch (e) {
                    // 忽略解码错误
                  }
                  console.log('使用子图片:', childImageUrl) // 调试
                  return childImageUrl
                }
              }
            }
          }
        }
      } catch (e) {
        console.log('提取图片出错:', e)
      }
      
      console.log('没有找到合适的文章图片') // 调试
      return null
    }

    // 尝试提取文章第一张图片
    const firstImage = getFirstImageFromBlockMap()
    if (firstImage) {
      // 直接替换封面为文章第一张图片
      post.pageCoverThumbnail = firstImage
      console.log('最终设置的封面图:', firstImage) // 调试
    } else {
      // 如果提取失败，使用原来的默认封面
      post.pageCoverThumbnail = siteInfo?.pageCover
      console.log('使用默认封面图') // 调试
    }
  }

  const showPageCover = siteConfig('FUKASAWA_POST_LIST_COVER', null, CONFIG) && post?.pageCoverThumbnail
    
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
                src={post?.pageCoverThumbnail}
                alt={post?.title || siteConfig('TITLE')}
                className='object-cover w-full h-full hover:scale-125 transform duration-500'
                // 添加priority确保图片立即加载
                priority={true}
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
