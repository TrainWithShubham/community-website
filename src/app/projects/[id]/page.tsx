import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { simpleProjectService } from '@/features/projects/lib/services/simple-project-service';
import { ReadmeViewer } from '@/features/projects/components/ui/readme-viewer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, Calendar, Users, Star } from 'lucide-react';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for all projects at build time
export async function generateStaticParams() {
  const projects = await simpleProjectService.getProjects();
  
  return projects.map((project) => ({
    id: encodeURIComponent(project.id),
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  
  try {
    const project = await simpleProjectService.getProjectById(decodedId);

    if (!project) {
      return {
        title: 'Project Not Found | TWS Community Hub',
        description: 'The requested project could not be found.',
      };
    }

    return {
      title: `${project.name} | DevOps Project | TWS Community Hub`,
      description: project.description || 'A hands-on DevOps project from TrainWithShubham repositories.',
      keywords: project.technologies || ['DevOps', 'Project', 'Hands-on Learning'],
      openGraph: {
        title: `${project.name} | DevOps Project`,
        description: project.description || 'A hands-on DevOps project from TrainWithShubham repositories.',
        images: ['/og-image.svg'],
      },
    };
  } catch (error) {
    return {
      title: 'Project | TWS Community Hub',
      description: 'A hands-on DevOps project from TrainWithShubham repositories.',
    };
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const project = await simpleProjectService.getProjectById(decodedId);

  if (!project) {
    return notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Project Header */}
      <section className="relative py-6 md:py-8 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient-subtle" />
        
        <div className="container mx-auto relative">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {project.name}
            </h1>
                <p className="text-lg text-muted-foreground mb-4">
                  {project.description}
                </p>
                
                {/* Project Stats */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>{project.stars} stars</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{project.forks} forks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Updated {new Date(project.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Technology Tags */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.slice(0, 8).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="bg-brand-purple hover:bg-brand-purple/90">
                    <a href={project.url} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      View on GitHub
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Content */}
      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                Project README
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReadmeViewer 
                readmeUrl={project.url.replace('github.com', 'raw.githubusercontent.com') + '/master/README.md'} 
                projectTitle={project.name}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
