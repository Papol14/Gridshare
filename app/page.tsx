import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Grid2X2, Share2, Lock } from "lucide-react";
import TestimonialCarousel from "@/components/testimonial-carousel";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Grid2X2,
    title: "Intuitive Grid System",
    description:
      "Our advanced grid system makes data organization effortless. Easily arrange, filter, and sort your information with our user-friendly interface.",
  },
  {
    icon: Share2,
    title: "Seamless Sharing",
    description:
      "Share your data with team members or stakeholders in just a few clicks. Control access levels and track sharing history with ease.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description:
      "Your data security is our priority. Benefit from end-to-end encryption, detailed audit logs, and compliance with industry standards.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[600px] items-center justify-center overflow-hidden bg-[#AFF9C9] py-12 sm:py-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-3xl font-bold leading-tight tracking-tighter sm:text-4xl md:text-6xl" style={{ color: "#2A4D14" }}>
                Transform Your Data Collaboration
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground">
                Streamline your workflow with Gridshare&apos;s powerful collaboration tools. Share, edit, and analyze data in real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#317B22] hover:bg-[#2A4D14] transition-colors duration-200"
                >
                  <Link href="/sheets">Explore Now</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="relative aspect-square w-full max-w-[600px] mx-auto">
                <Image
                  src="https://i0.wp.com/pemmzchannel.com/wp-content/uploads/2023/06/Penyebab-Google-Spreadsheet-Lambat-dan-Cara-Mengatasinya.jpeg?fit=2048%2C1152&ssl=1"
                  alt="Data collaboration"
                  fill
                  className="rounded-lg object-cover shadow-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-24">
        <div className="container">
          <h2 className="mb-12 text-center text-2xl sm:text-3xl font-bold" style={{ color: "#2A4D14" }}>
            Why Choose Gridshare?
          </h2>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <Card 
                key={feature.title} 
                className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                <CardHeader>
                  <feature.icon
                    className="h-10 w-10"
                    style={{ color: "#317B22" }}
                  />
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-[#AFF9C9] py-12 sm:py-24">
        <div className="container">
          <h2 className="mb-12 text-center text-2xl sm:text-3xl font-bold" style={{ color: "#2A4D14" }}>
            What Our Users Say
          </h2>
          <TestimonialCarousel />
        </div>
      </section>
    </div>
  );
}