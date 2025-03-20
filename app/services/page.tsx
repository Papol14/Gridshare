import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Explore our range of sustainable energy solutions and services.',
};

export default function ServicesPage() {
  return (
    <div className="container py-12 sm:py-24">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4" style={{ color: "#2A4D14" }}>
          Our Services
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover our comprehensive range of sustainable energy solutions designed to meet your needs.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Solar Installation */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4" style={{ color: "#317B22" }}>
            Solar Installation
          </h3>
          <p className="text-muted-foreground">
            Professional installation of solar panels and related equipment for residential and commercial properties.
          </p>
        </div>

        {/* Energy Storage */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4" style={{ color: "#317B22" }}>
            Energy Storage
          </h3>
          <p className="text-muted-foreground">
            Advanced battery storage solutions to maximize your solar energy usage and ensure power during outages.
          </p>
        </div>

        {/* Energy Management */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4" style={{ color: "#317B22" }}>
            Energy Management
          </h3>
          <p className="text-muted-foreground">
            Smart energy management systems to optimize your power consumption and reduce costs.
          </p>
        </div>

        {/* Maintenance */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4" style={{ color: "#317B22" }}>
            Maintenance
          </h3>
          <p className="text-muted-foreground">
            Regular maintenance and repair services to keep your solar system running efficiently.
          </p>
        </div>

        {/* Consultation */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4" style={{ color: "#317B22" }}>
            Consultation
          </h3>
          <p className="text-muted-foreground">
            Expert consultation to help you choose the right energy solutions for your needs.
          </p>
        </div>

        {/* Financing */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4" style={{ color: "#317B22" }}>
            Financing
          </h3>
          <p className="text-muted-foreground">
            Flexible financing options to make sustainable energy solutions accessible to everyone.
          </p>
        </div>
      </div>
    </div>
  );
} 