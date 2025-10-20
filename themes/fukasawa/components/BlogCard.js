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

  /**
   * 从 blockMap 安全提取第一张图片
   */
  const extractFirstImageFromBlockMap = (blockMap) => {
    if (!blockMap || typeof blockMap !== 'object') return null
    try {
      for (const key in blockMap) {
        const block = blockMap[key]
        const value = block?.value
        if (!value) continue

        // 图片类型块
        if (value.type === 'image') {
          const src =
            value?.properties?.source?.[0]?.[0] ||
            value?.format?.display_source ||
            value?.format?.source
          if (src) return src
        }

        // 遍历子节点
        if (Array.isArray(value.content)) {
          for (const childId of value.content) {
            const child = blockMap[childId]?.value
            if (child?.type === 'image') {
              const src =
                child?.properties?.source?.[0]?.[0] ||
                child?.format?.display_source ||
                child?.format?.source
              if (src) return src
            }
          }
        }
      }
    } catch (e) {
      console.warn('提取图片时出错:', e)
    }
    return null
  }

  /**
   * 自动设置封面逻辑
   */
  if (post && !post.pageCoverThumbnail) {
    let firstImage = null

    // 尝试从 blockMap 提取
    firstImage = extractFirstImageFromBlockMap(post.blockMap)

    // 如果没找到，从 content HTML 中匹配 <img>
    if (!firstImage && post?.content) {
      const match = post.content.match(/<img[^>]+src="([^">]+)"/i)
      if (match && match[1]) {
        firstImage = match[1]
      }
    }

    // 如果仍未找到，使用默认封面
    post.pageCoverThumbnail = firstImage || siteInfo?.pageCover
  }

  // fukasawa 强制显示封面逻辑
  if (
    siteConfig('FUKASAWA_POST_LIST_COVER_FORCE', null, CONFIG) &&
    post &&
    !post.pageCover
  ) {
    post.pageCoverThumbnail = siteInfo?.pageCover
  }

  const showPageCover =
    siteConfig('FUKASAWA_POST_LIST_COVER', null, CONFIG) &&
    post?.pageCoverThumbnail

  const FUKASAWA_POST_LIST_ANIMATION =
    siteConfig('FUKASAWA_POST_LIST_ANIMATION', null, CONFIG) || showAnimate

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
        {showPageCover && post.pageCoverThumbnail && (
          <SmartLink href={post?.href} passHref legacyBehavior>
            <div className='flex-grow mb-3 w-full duration-200 cursor-pointer transform overflow-hidden rounded-xl'>
              <LazyImage
                src={post.pageCoverThumbnail}
                alt={post?.title || siteConfig('TITLE')}
                className='object-cover w-full h-48 hover:scale-110 transform duration-500'
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
              className='break-words cursor-pointer font-bold hover:underline text-xl leading-tight text-gray-700 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400'>
              {siteConfig('POST_TITLE_ICON') && (
                <NotionIcon icon={post.pageIcon} />
              )}{' '}
              {post.title}
            </SmartLink>
          </h2>

          {(!showPageCover || showSummary) && (
            <main className='my-2 tracking-wide line-clamp-3 text-gray-800 dark:text-gray-300 text-md font-light leading-6'>
              {post.summary}
            </main>
          )}

          {/* 分类与标签 */}
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
