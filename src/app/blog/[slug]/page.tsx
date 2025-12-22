"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { getBlogBySlug } from "@/lib/blogData";
import { Calendar, User, ArrowLeft } from "lucide-react";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // Fetch blog post by slug
  // TODO: Replace with API call when backend is ready
  const blog = getBlogBySlug(slug);

  // Handle blog not found
  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sky-600 via-blue-600 to-sky-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back Button */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-sky-100 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blog</span>
          </Link>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-6 text-sky-100">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{new Date(blog.publishedDate).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <article className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Image */}
          {blog.image && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Excerpt */}
          <div className="mb-8 p-6 bg-sky-50 border-l-4 border-sky-600 rounded-r-xl">
            <p className="text-lg text-gray-700 leading-relaxed">
              {blog.excerpt}
            </p>
          </div>

          {/* Main Content */}
          <div 
            className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900
              prose-ul:my-6 prose-li:text-gray-600"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Divider */}
          <div className="my-12 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

          {/* Back to Blog CTA */}
          <div className="text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Explore More Articles
            </h3>
            <p className="text-gray-600 mb-6">
              Discover more travel tips and vacation rental insights
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-colors shadow-md hover:shadow-lg"
            >
              View All Blog Posts
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}


