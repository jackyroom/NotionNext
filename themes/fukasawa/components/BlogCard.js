import React, { useEffect, useState } from 'react'
import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import TagItemMini from './TagItemMini'

/**
 * 更健壮的文章列表卡片（自动从 blockMap/content/DOM 提取第一张图片并填充摘要）
 */
const BlogCard = ({ showAnimate, post, showSummary }) => {
  const { siteInfo } = useGlobal()
  const [coverSrc, setCoverSrc] = useState(post?.pageCoverThumbnail || post?.pageCover || '')
  const [summaryText, setSummaryText] = useState(post?.summary || '')
  const [triedDom, setTriedDom] = useState(false)

  // 安全从 blockMap 中提取第一张图片（兼容多种 NotionNext 结构）
  const extractFirstImageFromBlockMap = (blockMap) => {
    if (!blockMap || typeof blockMap !== 'object') return null
    try {
      for (const key in blockMap) {
        const value = blockMap[key]?.value
        if (!value) continue

        // 常见 image 块
        if (value.type === 'image') {
          const src =
            value?.properties?.source?.[0]?.[0] ||
            value?.format?.display_source ||
            value?.format?.source
          if (src) return src
        }

        // 有时图片以 HTML 存在于 title/properties
        if (value?.properties?.title) {
          const titleArr = value.properties.title
          // title 可能是嵌套数组：[['<img ...>'], ['text']]
          const text = Array.isArray(titleArr) ? titleArr.flat().join('') : String(titleArr)
          const m = text.match(/<img[^>]+src="([^">]+)"/i)
          if (m && m[1]) return m[1]
        }

        // 有些实现里图片信息在 value.format
        const srcAlt =
          value?.format?.display_source ||
          value?.format?.source ||
          value?.properties?.source?.[0]?.[0]
        if (srcAlt) return srcAlt

        // 子节点内查找
        if (Array.isArray(value.content) && value.content.length) {
          for (const childId of value.content) {
            const child = blockMap[childId]?.value
            if (!child) continue
            if (child.type === 'image') {
              const csrc =
                child?.properties?.source?.[0]?.[0] ||
                child?.format?.display_source ||
                child?.format?.source
              if (csrc) return csrc
            }
            if (child?.properties?.title) {
              const text = child.properties.title.flat().join('')
              const m = text.match(/<img[^>]+src="([^">]+)"/i)
              if (m && m[1]) return m[1]
            }
          }
        }
      }
    } catch (e) {
      console.warn('extractFirstImageFromBlockMap error', e)
    }
    return null
  }

  // 从 HTML content 字符串提取第一张 <img>
  const extractFirstImageFromContentHtml = (html) => {
    if (!html || typeof html !== 'string') return null
    const m = html.match(/<img[^>]+src="([^">]+)"/i)
    return m ? m[1] : null
  }

  // 从 HTML 文本提取纯文本摘要（去标签并截断）
  const extractSummaryFromContentHtml = (html, maxLen = 120) => {
    if (!html || typeof html !== 'string') return ''
    const text = html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
    if (!text) return ''
    return text.length > maxLen ? text.slice(0, maxLen) + '...' : text
  }

  // 当组件挂载后，尝试多来源提取封面与摘要
  useEffect(() => {
    let found = false

    // 1) 优先使用已有字段
    if (coverSrc) found = true

    // 2) 尝试 blockMap
    if (!found && post?.blockMap) {
      const fromBlock = extractFirstImageFromBlockMap(post.blockMap)
      if (fromBlock) {
        setCoverSrc(fromBlock)
        found = true
      }
    }

    // 3) 尝试 content HTML（如果存在）
    if (!found && post?.content) {
      const fromContent = extractFirstImageFromContentHtml(post.content)
      if (fromContent) {
        setCoverSrc(fromContent)
        found = true
      }
      // 摘要：如果没有 summary，优先从 content 提取纯文本作为 summary
      if (!summaryText) {
        const s = extractSummaryFromContentHtml(post.content)
        if (s) setSummaryText(s)
      }
    }

    // 4) 如果到这里仍不行，退回 DOM：查询当前页面已经渲染的 article/anchor/img（仅在浏览器环境）
    //    例如：页面服务端渲染可能已经把 <img> 写进 DOM，我们可以抓取它（兼容性降级）
    if (!found && typeof window !== 'undefined' && !triedDom) {
      try {
        // 找到链接到文章详情页的 <a href="{post.href}"> 并在其父元素查找 <img>
        // post.href 例如 "/article/xxxx"，确保格式一致
        const href = post?.href
        if (href) {
          // query a[href="{href}"] img 或者 article a[href="{href}"] img
          const selector = `a[href="${href}"] img, article a[href="${href}"] img, a[href="${href}"]`
          const el = document.querySelector(selector)
          if (el) {
            // 如果匹配到 <img> 元素
            const imgEl = el.tagName.toLowerCase() === 'img' ? el : el.querySelector('img')
            if (imgEl && imgEl.src) {
              setCoverSrc(imgEl.src)
              found = true
            } else {
              // 可能 a 本身 不包 img，但 a 的上层有 img：尝试往上寻找
              let parent = el.parentElement
              let tries = 0
              while (parent && tries < 4) {
                const img = parent.querySelector && parent.querySelector('img')
                if (img && img.src) {
                  setCoverSrc(img.src)
                  found = true
                  break
                }
                parent = parent.parentElement
                tries++
              }
            }
          }
        }
        // 摘要：如果仍未有 summary，尝试从 article 内抓取文本（最长 120 字）
        if (!summaryText) {
          const articleSelector = `article a[href="${post?.href}"]`
          const aInArticle = document.querySelector(articleSelector) || document.querySelector(`a[href="${post?.href}"]`)
          if (aInArticle) {
            // 找到最近的 article 父节点
            let art = aInArticle.closest('article')
            if (!art) {
              art = aInArticle.parentElement
            }
            if (art) {
              // 文本节点可能在 <main> 或 <p>，这里尽量抽取 article 的文本并截短
              const text = art.innerText.replace(/\s+/g, ' ').trim()
              if (text) {
                const t = text.length > 120 ? text.slice(0, 120) + '...' : text
                setSummaryText(t)
              }
            }
          }
        }
      } catch (e) {
        console.warn('DOM fallback extraction error', e)
      } finally {
        setTriedDom(true)
      }
    }

    // 5) 最后兜底：如果没有任何图片，使用站点默认封面（避免卡片空白）
    if (!coverSrc && siteInfo?.pageCover) {
      setCoverSrc(siteInfo.pageCover)
    }

    // 如果 summary 还是空并且 post.summary 有值（延迟赋值场景），确保使用它
    if (!summaryText && post?.summary) {
      setSummaryText(post.summary)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post, siteInfo])

  // fukasawa 强制显示图片逻辑 —— 如果配置要求强制展示则确保有封面
  useEffect(() => {
    if (
      siteConfig('FUKASAWA_POST_LIST_COVER_FORCE', null, CONFIG) &&
      !coverSrc &&
      siteInfo?.pageCover
    ) {
      setCoverSrc(siteInfo.pageCover)
    }
  }, [siteInfo, coverSrc])

  const showPageCover =
    siteConfig('FUKASAWA_POST_LIST_COVER', null, CONFIG) && coverSrc

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
      className='w-full lg:max-w-sm p-3 shadow mb-4 mx-2 bg-white dark:bg-hexo-black-gray hover:shadow-lg duration-200'
    >
      <div className='flex flex-col justify-between h-full'>
        {/* 封面图 */}
        {showPageCover && coverSrc && (
          <SmartLink href={post?.href} passHref legacyBehavior>
            <div className='flex-grow mb-3 w-full duration-200 cursor-pointer transform overflow-hidden rounded-xl'>
              <LazyImage
                src={coverSrc}
                alt={post?.title || siteConfig('TITLE')}
                className='object-cover w-full h-48 hover:scale-110 transform duration-500'
              />
            </div>
          </SmartLink>
        )}

        {/* 文字部分（摘要强制显示，避免因为封面逻辑导致不显示） */}
        <div className='flex flex-col w-full'>
          <h2>
            <SmartLink
              passHref
              href={post?.href}
              className='break-words cursor-pointer font-bold hover:underline text-xl leading-tight text-gray-700 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400'
            >
              {siteConfig('POST_TITLE_ICON') && <NotionIcon icon={post.pageIcon} />}{' '}
              {post.title}
            </SmartLink>
          </h2>

          <main className='my-2 tracking-wide line-clamp-3 text-gray-800 dark:text-gray-300 text-md font-light leading-6'>
            {summaryText || (post?.summary ?? '')}
          </main>

          {/* 分类与标签 */}
          <div className='mt-auto justify-between flex'>
            {post.category && (
              <SmartLink
                href={`/category/${post.category}`}
                passHref
                className='cursor-pointer dark:text-gray-300 font-light text-sm hover:underline hover:text-indigo-700 dark:hover:text-indigo-400 transform'
              >
                <i className='mr-1 far fa-folder' />
                {post.category}
              </SmartLink>
            )}
            <div className='md:flex-nowrap flex-wrap md:justify-start inline-block'>
              <div>
                {post.tagItems?.map((tag) => (
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
