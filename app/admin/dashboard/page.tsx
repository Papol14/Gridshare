"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Table, Users, BarChart, Plus, Edit, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ContentStats {
  blogPosts: number;
  sheets: number;
  subscribers: number;
  views: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<ContentStats>({
    blogPosts: 0,
    sheets: 0,
    subscribers: 0,
    views: 0,
  });
  const [recentContent, setRecentContent] = useState<any[]>([]);

  useEffect(() => {
    // Fetch stats and recent content
    const fetchData = async () => {
      try {
        const [blogRes, sheetsRes] = await Promise.all([
          fetch('/api/blog'),
          fetch('/api/sheets')
        ]);
        
        const blogData = await blogRes.json();
        const sheetsData = await sheetsRes.json();
        
        setStats({
          blogPosts: blogData.length,
          sheets: sheetsData.length,
          subscribers: 245, // Mock data for now
          views: 12500, // Mock data for now
        });

        // Combine and sort recent content
        const combinedContent = [
          ...blogData.map((post: any) => ({
            ...post,
            type: 'blog',
            date: new Date(post.createdAt).toLocaleDateString(),
          })),
          ...sheetsData.map((sheet: any) => ({
            ...sheet,
            type: 'sheet',
            date: new Date(sheet.createdAt).toLocaleDateString(),
          })),
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

        setRecentContent(combinedContent);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const handleCreateContent = (type: 'blog' | 'sheet') => {
    router.push(`/admin/${type}/new`);
  };

  const handleEditContent = (type: 'blog' | 'sheet', id: string) => {
    router.push(`/admin/${type}/${id}/edit`);
  };

  const handleDeleteContent = async (type: 'blog' | 'sheet', id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/${type}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the page to update the content
        router.refresh();
      } else {
        throw new Error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "#2A4D14" }}>
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleCreateContent('blog')} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            New Blog Post
          </Button>
          <Button onClick={() => handleCreateContent('sheet')} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            New Sheet
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blog Posts</CardTitle>
            <FileText className="h-4 w-4" style={{ color: "#317B22" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.blogPosts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sheets</CardTitle>
            <Table className="h-4 w-4" style={{ color: "#317B22" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sheets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
            <Users className="h-4 w-4" style={{ color: "#317B22" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.subscribers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Views</CardTitle>
            <BarChart className="h-4 w-4" style={{ color: "#317B22" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.views.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Content */}
      <div>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "#2A4D14" }}>
          Recent Content
        </h2>
        <div className="space-y-4">
          {recentContent.map((item) => (
            <Card key={`${item.type}-${item._id}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: "#AFF9C9" }}>
                      {item.type === 'blog' ? (
                        <FileText className="h-6 w-6" style={{ color: "#2A4D14" }} />
                      ) : (
                        <Table className="h-6 w-6" style={{ color: "#2A4D14" }} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.type === 'blog' ? item.excerpt : item.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditContent(item.type, item._id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteContent(item.type, item._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 