import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, Share2, Bookmark } from "lucide-react";

// This would typically come from a database or CMS
const getPost = (id: string) => {
  const posts = {
    "1": {
      title: "Getting Started with Gridshare: A Complete Guide",
      content: `
        <p>Gridshare is a powerful platform for data collaboration that helps teams work together more effectively. In this comprehensive guide, we&apos;ll walk you through everything you need to know to get started.</p>
        
        <h2>Setting Up Your Account</h2>
        <p>Getting started with Gridshare is simple. First, create your account by visiting our signup page. You&apos;ll need to provide your email address and create a secure password.</p>
        
        <h2>Creating Your First Grid</h2>
        <p>A Grid is where all the magic happens. It&apos;s your workspace for data collaboration. To create your first Grid:</p>
        <ol>
          <li>Click the "New Grid" button in your dashboard</li>
          <li>Choose a template or start from scratch</li>
          <li>Name your Grid and add a description</li>
          <li>Invite team members to collaborate</li>
        </ol>
        
        <h2>Key Features to Explore</h2>
        <p>Gridshare comes packed with powerful features designed to enhance your data collaboration experience:</p>
        <ul>
          <li>Real-time collaboration</li>
          <li>Advanced data visualization</li>
          <li>Automated workflows</li>
          <li>Version control</li>
          <li>Role-based access control</li>
        </ul>
        
        <h2>Best Practices</h2>
        <p>To make the most of Gridshare, follow these best practices:</p>
        <ul>
          <li>Organize your data logically</li>
          <li>Use templates for common workflows</li>
          <li>Regularly backup your data</li>
          <li>Keep your team informed of changes</li>
          <li>Utilize automation features</li>
        </ul>
        
        <h2>Next Steps</h2>
        <p>Now that you&apos;re familiar with the basics, you can:</p>
        <ul>
          <li>Explore advanced features</li>
          <li>Set up automated workflows</li>
          <li>Create custom templates</li>
          <li>Integrate with other tools</li>
        </ul>
      `,
      image: "/blog/getting-started.jpg",
      date: "2024-03-15",
      readTime: "5 min read",
      category: "Tutorials",
      author: {
        name: "Sarah Johnson",
        role: "Product Manager",
        avatar: "/team/sarah.jpg",
      },
    },
    // Add more posts here...
  };

  return posts[id as keyof typeof posts] || null;
};

export default function BlogPost({ params }: { params: { id: string } }) {
  const post = getPost(params.id);

  if (!post) {
    return (
      <div className="container py-12 sm:py-24 text-center">
        <h1 className="text-3xl font-bold mb-4" style={{ color: "#2A4D14" }}>
          Post Not Found
        </h1>
        <p className="text-muted-foreground mb-8">
          The blog post you're looking for doesn't exist.
        </p>
        <Link href="/blog">
          <Button style={{ backgroundColor: "#317B22" }}>
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12 sm:py-24">
      {/* Back Button */}
      <Link href="/blog">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Button>
      </Link>

      {/* Hero Section */}
      <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Article Header */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {post.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.readTime}
          </span>
        </div>
        <div className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4" 
             style={{ backgroundColor: "#AFF9C9", color: "#2A4D14" }}>
          {post.category}
        </div>
        <h1 className="text-3xl font-bold mb-4" style={{ color: "#2A4D14" }}>
          {post.title}
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative h-10 w-10 rounded-full overflow-hidden">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-medium">{post.author.name}</p>
            <p className="text-sm text-muted-foreground">{post.author.role}</p>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto">
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Article Actions */}
      <div className="max-w-3xl mx-auto mt-12 flex items-center justify-between border-t pt-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
        <Link href="/blog">
          <Button style={{ backgroundColor: "#317B22" }}>
            Back to Blog
          </Button>
        </Link>
      </div>
    </div>
  );
} 