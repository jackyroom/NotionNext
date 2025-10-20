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

  // 简化版：直接从内容中提取第一张图片
  const extractFirstImage = (content) => {
    if (!content) return null
    const imgRegex = /https?:\/\/[^\s"']+\.(jpg|jpeg|png|gif|webp)(\?[^\s"']*)?/i
    const match = content.match(imgRegex)
    return match ? match[0] : null
  }

  // 修改封面图来源
  let coverImage = post?.pageCoverThumbnail
  if (!coverImage && post) {
    // 尝试从摘要中提取
    coverImage = extractFirstImage(post.summary)
    // 如果摘要中没有，尝试从内容中提取
    if (!coverImage && post.content) {
      coverImage = extractFirstImage(post.content)
    }
    // 如果都没有，使用默认封面
    if (!coverImage) {
      coverImage = siteInfo?.pageCover
    }
  }

  // 强制显示封面逻辑
  if (siteConfig('FUKASAWA_POST_LIST_COVER_FORCE', null, CONFIG) && post && !post.pageCoverThumbnail) {
    post.pageCoverThumbnail = coverImage
  }

  const showPageCover = siteConfig('FUKASAWA_POST_LIST_COVER', null, CONFIG) && coverImage
  
  // 在渲染部分使用 coverImage
  return (
    <article {...aosProps}>
      <div className='flex flex-col justify-between h-full'>
        {showPageCover && (
          <SmartLink href={post?.href}>
            <div className='flex-grow mb-3 w-full duration-200 cursor-pointer transform overflow-hidden'>
              <LazyImage
                src={coverImage}  // 使用提取的图片
                alt={post?.title}
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
