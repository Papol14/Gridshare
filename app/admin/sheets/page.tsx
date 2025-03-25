"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Edit, Trash2, Eye, Share2, Download } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

// Mock data - replace with actual data from your database
const mockSheets = [
  {
    id: "1",
    title: "Q1 Sales Report",
    category: "Finance",
    date: "2024-03-15",
    status: "Active",
  },
  {
    id: "2",
    title: "Marketing Campaign Results",
    category: "Marketing",
    date: "2024-03-10",
    status: "Archived",
  },
  {
    id: "3",
    title: "Customer Feedback Analysis",
    category: "Customer Relations",
    date: "2024-03-05",
    status: "Active",
  },
];

export default function SheetsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredSheets = mockSheets.filter((sheet) =>
    sheet.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      // Add your delete logic here
      toast({
        title: "Success",
        description: "Sheet deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "error",
        title: "Error",
        description: "Failed to delete sheet",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "#2A4D14" }}>
            Sheets Management
          </h1>
          <p className="text-muted-foreground">
            Manage your data sheets and collections
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/sheets/new">
            <Plus className="mr-2 h-4 w-4" />
            New Sheet
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Sheets</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sheets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSheets.map((sheet) => (
                <TableRow key={sheet.id}>
                  <TableCell className="font-medium">{sheet.title}</TableCell>
                  <TableCell>{sheet.category}</TableCell>
                  <TableCell>{sheet.date}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        sheet.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {sheet.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/sheets/${sheet.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/sheets/${sheet.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(sheet.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 