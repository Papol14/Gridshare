import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Shield, Zap } from "lucide-react";
import Image from "next/image";

const values = [
  {
    title: "Collaboration",
    description: "We believe in the power of working together to achieve great things.",
    icon: Users,
  },
  {
    title: "Innovation",
    description: "We constantly push boundaries to deliver cutting-edge solutions.",
    icon: Zap,
  },
  {
    title: "Security",
    description: "Your data security is our top priority, with enterprise-grade protection.",
    icon: Shield,
  },
  {
    title: "Excellence",
    description: "We strive for excellence in everything we do, from code to customer service.",
    icon: Target,
  },
];

const team = [
  {
    name: "Sarah Johnson",
    role: "CEO & Founder",
    image: "/team/sarah.jpg",
  },
  {
    name: "Michael Chen",
    role: "CTO",
    image: "/team/michael.jpg",
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Design",
    image: "/team/emily.jpg",
  },
  {
    name: "David Kim",
    role: "Lead Developer",
    image: "/team/david.jpg",
  },
];

export default function AboutPage() {
  return (
    <div className="container py-12 sm:py-24">
      {/* Hero Section */}
      <div className="mx-auto max-w-3xl text-center mb-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4" style={{ color: "#2A4D14" }}>
          About Gridshare
        </h1>
        <p className="text-lg text-muted-foreground">
          We&apos;re on a mission to revolutionize how teams collaborate and share data. Our platform makes it easy to work together, stay organized, and achieve more.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid gap-8 md:grid-cols-2 items-center mb-16">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold" style={{ color: "#2A4D14" }}>
            Our Mission
          </h2>
          <p className="text-muted-foreground">
            At Gridshare, we believe that great things happen when teams can easily share and collaborate on data. Our mission is to empower organizations with the tools they need to work smarter, not harder.
          </p>
          <p className="text-muted-foreground">
            Founded in 2023, we&apos;ve grown from a small startup to a global platform serving thousands of teams worldwide. Our commitment to innovation and customer success drives everything we do.
          </p>
        </div>
        <div className="relative h-[300px] rounded-lg overflow-hidden">
          <Image
            src="/about/mission.jpg"
            alt="Team collaboration"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8" style={{ color: "#2A4D14" }}>
          Our Values
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <Card key={value.title} className="border-none shadow-none">
              <CardContent className="text-center">
                <value.icon className="h-12 w-12 mx-auto mb-4" style={{ color: "#317B22" }} />
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-8" style={{ color: "#2A4D14" }}>
          Our Team
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <Card key={member.name} className="border-none shadow-none">
              <CardContent className="text-center">
                <div className="relative h-48 w-48 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 