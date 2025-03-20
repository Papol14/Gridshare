import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const featuredPosts = [
  {
    id: 1,
    title: "Getting Started with Gridshare: A Complete Guide",
    excerpt: "Learn how to make the most of Gridshare's powerful features for seamless data collaboration.",
    image: "/blog/getting-started.jpg",
    date: "2024-03-15",
    readTime: "5 min read",
    category: "Tutorials",
  },
  {
    id: 2,
    title: "Best Practices for Data Collaboration",
    excerpt: "Discover the most effective ways to collaborate on data with your team using Gridshare.",
    image: "/blog/best-practices.jpg",
    date: "2024-03-10",
    readTime: "7 min read",
    category: "Tips & Tricks",
  },
  {
    id: 3,
    title: "Security Features in Gridshare",
    excerpt: "An in-depth look at how Gridshare keeps your data safe and secure.",
    image: "/blog/security.jpg",
    date: "2024-03-05",
    readTime: "6 min read",
    category: "Security",
  },
];

const categories = [
  "All Posts",
  "Tutorials",
  "Tips & Tricks",
  "Security",
  "Updates",
  "Case Studies",
];

export default function BlogPage() {
  return (
    <div className="container py-12 sm:py-24">
      {/* Hero Section */}
      <div className="mx-auto max-w-3xl text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4" style={{ color: "#2A4D14" }}>
          Gridshare Blog
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover insights, tutorials, and updates about data collaboration and Gridshare.
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            className="rounded-full"
            style={{ borderColor: "#317B22" }}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Featured Posts */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {featuredPosts.map((post) => (
          <Link href={`/blog/${post.id}`} key={post.id}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-200">
              <div className="relative h-48 w-full">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </span>
                </div>
                <div className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-2" 
                     style={{ backgroundColor: "#AFF9C9", color: "#2A4D14" }}>
                  {post.category}
                </div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                <Button variant="ghost" className="p-0 h-auto">
                  Read more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Newsletter Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ color: "#2A4D14" }}>
          Stay Updated
        </h2>
        <p className="text-muted-foreground mb-6">
          Subscribe to our newsletter for the latest updates and blog posts.
        </p>
        <div className="flex gap-4 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-md border max-w-sm w-full"
          />
          <Button style={{ backgroundColor: "#317B22" }}>
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
} 