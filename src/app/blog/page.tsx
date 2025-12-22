"use client";

import Link from "next/link";
import { getBlogs, BlogPost } from "@/lib/blogData";
import { Calendar, User } from "lucide-react";

// Blog Card Component
function BlogCard({ blog }: { blog: BlogPost }) {
  return (
    <Link href={`/blog/${blog.slug}`}>
      <div className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-md transition-all duration-300 hover:shadow-2xl">
          {/* Image */}
          <div className="relative h-64 w-full overflow-hidden bg-gray-200">
            {blog.image ? (
              <img
                src={blog.image}
                alt={blog.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                <span className="text-sm">No Image</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-3">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-sky-600 transition-colors">
              {blog.title}
            </h3>

            <p className="text-gray-600 line-clamp-3 leading-relaxed">
              {blog.excerpt}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-sm text-gray-500 pt-2">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(blog.publishedDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-sky-600 font-medium group-hover:underline">
                Read More →
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const blogs = getBlogs();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sky-600 via-blue-600 to-sky-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Travel Blog
          </h1>
          <p className="text-lg text-sky-100 max-w-2xl mx-auto">
            Discover travel tips, destination guides, and vacation rental insights to help plan your perfect getaway.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog.slug} blog={blog} />
            ))}
          </div>

          {/* Empty State (if no blogs) */}
          {blogs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No blog posts available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}


