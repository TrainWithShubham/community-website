import { Metadata } from 'next';
import { simpleProjectService } from '@/features/projects/lib/services/simple-project-service';
import { DynamicProjectsClient } from '@/features/projects/components/ui/dynamic-components';

export const metadata: Metadata = {
  title: 'DevOps Projects | TWS Community Hub',
  description: 'Hands-on DevOps projects to master your skills. Explore real-world projects from TrainWithShubham repositories with advanced search and filtering.',
  keywords: ['DevOps Projects', 'Hands-on Learning', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'TrainWithShubham'],
  openGraph: {
    title: 'DevOps Projects | TWS Community Hub',
    description: 'Hands-on DevOps projects to master your skills. Explore real-world projects from TrainWithShubham repositories.',
    images: ['/og-image.svg'],
  },
};

export default async function ProjectsPage() {
  // Preload projects for better performance
  await simpleProjectService.preloadProjects();
  const projects = await simpleProjectService.getProjects();

  return (
    <div className="min-h-screen">
      {/* Compact Header */}
      <section className="relative py-6 md:py-8 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient-subtle" />

        <div className="container mx-auto relative">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              DevOps <span className="brand-gradient">Projects</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Hands-on projects to master DevOps skills
            </p>
          </div>
        </div>
      </section>

      {/* Projects Content */}
      <div className="container mx-auto px-4 pb-8">
        <DynamicProjectsClient
          projects={projects}
          initialQuery={undefined}
          initialFilters={{
            difficulty: undefined,
            category: undefined,
          }}
        />
      </div>
    </div>
  );
}
