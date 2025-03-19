"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Download, Share2 } from "lucide-react";

type Sheet = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
};

const dummySheets: Sheet[] = [
  {
    id: "1",
    title: "Q1 Sales Report",
    description: "Quarterly sales analysis with regional breakdown",
    date: "2025-03-15",
    category: "Finance"
  },
  {
    id: "2",
    title: "Marketing Campaign Results",
    description: "Performance metrics for Q1 digital marketing initiatives",
    date: "2025-03-10",
    category: "Marketing"
  },
  {
    id: "3",
    title: "Customer Feedback Analysis",
    description: "Aggregated customer satisfaction survey results",
    date: "2025-03-05",
    category: "Customer Relations"
  }
];

export default function SheetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sheets, setSheets] = useState<Sheet[]>(dummySheets);

  const filteredSheets = sheets.filter(sheet => 
    sheet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sheet.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold" style={{ color: "#2A4D14" }}>
        Sheets
      </h1>

      {/* Search and Filter Section */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Search sheets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Results Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSheets.map((sheet) => (
          <Card key={sheet.id} className="transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle>{sheet.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{sheet.description}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="rounded-full bg-[#AFF9C9] px-3 py-1 text-xs font-medium text-[#2A4D14]">
                  {sheet.category}
                </span>
                <span className="text-xs text-muted-foreground">{sheet.date}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredSheets.length === 0 && (
        <div className="mt-8 text-center">
          <p className="text-lg text-muted-foreground">No sheets found matching your search.</p>
        </div>
      )}
    </div>
  );
}