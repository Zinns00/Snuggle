'use client'

import Link from 'next/link'
import { SearchBlogResult } from '@/lib/api/search'
import { getBlogImageUrl } from '@/lib/utils/image'

interface SearchBlogCardProps {
    blog: SearchBlogResult
}

export default function SearchBlogCard({ blog }: SearchBlogCardProps) {
    const imageUrl = getBlogImageUrl(blog.thumbnail_url, blog.profile?.profile_image_url)

    return (
        <Link
            href={`/blog/${blog.id}`}
            className="block rounded-lg border border-black/10 p-4 transition-colors hover:bg-black/[0.02] dark:border-white/10 dark:hover:bg-white/[0.02]"
        >
            <div className="flex items-center gap-4">
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={blog.name}
                        className="h-12 w-12 rounded-full object-cover"
                    />
                )}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-black dark:text-white truncate">
                        {blog.name}
                    </h3>
                    {blog.description && (
                        <p className="text-sm text-black/60 dark:text-white/60 truncate">
                            {blog.description}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    )
}
