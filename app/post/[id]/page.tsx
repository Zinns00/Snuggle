'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getPost, PostWithDetails } from '@/lib/api/posts'

// highlight.js 테마 (코드블록용)
import 'highlight.js/styles/github-dark.css'

export default function PostPage() {
    const params = useParams()
    const router = useRouter()
    const postId = params.id as string

    const [postData, setPostData] = useState<PostWithDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            // 게시글 정보 (백엔드 API 사용)
            try {
                const data = await getPost(postId)
                if (!data) {
                    setNotFound(true)
                    setLoading(false)
                    return
                }
                setPostData(data)
            } catch (err) {
                console.error('Failed to load post:', err)
                setNotFound(true)
            }

            setLoading(false)
        }

        fetchData()
    }, [postId])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        })
    }


    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
            </div>
        )
    }

    if (notFound || !postData || !postData.blog) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-black">
                <h1 className="text-2xl font-bold text-black dark:text-white">
                    게시글을 찾을 수 없습니다
                </h1>
                <button
                    onClick={() => router.back()}
                    className="mt-4 text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
                >
                    뒤로 가기
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            {/* 헤더 */}
            <header className="border-b border-black/10 dark:border-white/10">
                <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
                    <a href="/" className="text-lg font-bold text-black dark:text-white">
                        Snuggle
                    </a>
                </div>
            </header>

            {/* 메인 컨텐츠 */}
            <main className="mx-auto max-w-3xl px-6 py-12">
                {/* 비공개 표시 */}
                {!postData.published && (
                    <div className="mb-6 flex items-center gap-2 rounded-lg bg-yellow-50 px-4 py-3 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-4V8a3 3 0 00-3-3H6a3 3 0 00-3 3v1m12-1a3 3 0 013 3v6a3 3 0 01-3 3H6a3 3 0 01-3-3v-6" />
                        </svg>
                        <span className="text-sm font-medium">이 글은 비공개 상태입니다</span>
                    </div>
                )}

                {/* 카테고리 */}
                {postData.category && (
                    <span className="inline-block rounded-full bg-black/5 px-3 py-1 text-sm text-black/70 dark:bg-white/10 dark:text-white/70">
                        {postData.category.name}
                    </span>
                )}

                {/* 제목 */}
                <h1 className="mt-4 text-3xl font-bold leading-tight text-black dark:text-white md:text-4xl">
                    {postData.title}
                </h1>

                {/* 메타 정보 */}
                <div className="mt-6 flex items-center gap-4 border-b border-black/10 pb-6 dark:border-white/10">
                    {/* 작성자 */}
                    <a
                        href={`/blog/${postData.blog.id}`}
                        className="flex items-center gap-3 transition-opacity hover:opacity-80"
                    >
                        {(postData.blog.thumbnail_url || postData.profile?.profile_image_url) ? (
                            <img
                                src={postData.blog.thumbnail_url || postData.profile?.profile_image_url || ''}
                                alt={postData.profile?.nickname || postData.blog.name}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-sm font-bold text-black/50 dark:bg-white/10 dark:text-white/50">
                                {(postData.profile?.nickname || postData.blog.name).charAt(0)}
                            </div>
                        )}
                        <div>
                            <p className="font-medium text-black dark:text-white">
                                {postData.profile?.nickname || postData.blog.name}
                            </p>
                            <p className="text-sm text-black/50 dark:text-white/50">
                                {formatDate(postData.created_at)}
                            </p>
                        </div>
                    </a>
                </div>

                {/* 본문 */}
                <article
                    className="prose prose-lg mt-10 max-w-none dark:prose-invert prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-a:text-blue-500 prose-pre:bg-[#1a1a1a] prose-pre:text-sm prose-img:rounded-lg"
                    dangerouslySetInnerHTML={{ __html: postData.content }}
                />

                {/* 하단 네비게이션 */}
                <div className="mt-16 flex items-center justify-between border-t border-black/10 pt-8 dark:border-white/10">
                    <a
                        href={`/blog/${postData.blog.id}`}
                        className="flex items-center gap-2 text-black/50 transition-colors hover:text-black dark:text-white/50 dark:hover:text-white"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        목록으로
                    </a>

                    </div>
            </main>
        </div>
    )
}
