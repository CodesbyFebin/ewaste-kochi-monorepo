'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, ExternalLink } from 'lucide-react'

interface WikiServiceCTAProps {
  title: string
  description: string
  serviceUrl: string
  serviceLabel: string
}

export function WikiServiceCTA({
  title,
  description,
  serviceUrl,
  serviceLabel,
}: WikiServiceCTAProps) {
  return (
    <div className="my-8 rounded-lg border border-primary/20 bg-primary/5 p-6 md:p-8">
      <div className="flex gap-6 items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-foreground/70 text-sm mb-4">{description}</p>
          <Button asChild className="gap-2" size="sm">
            <a href={serviceUrl} target="_blank" rel="noopener noreferrer">
              {serviceLabel}
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
EOF

cat > /vercel/share/v0-project/lib/wiki/service-mapping.ts << 'MAPPING_EOF'
export const wikiToServiceMapping = {
  'what-is-e-waste-comprehensive-guide': [
    {
      title: 'Ready to Recycle?',
      description: 'Schedule a free e-waste pickup from your location in Kochi. We handle collection, data destruction, and certified recycling.',
      serviceUrl: '/services/schedule-pickup',
      serviceLabel: 'Schedule Free Pickup',
    },
    {
      title: 'Business Solutions',
      description: 'For offices and enterprises, we offer comprehensive ITAD solutions with bulk collection and compliance documentation.',
      serviceUrl: '/services/enterprise-itad',
      serviceLabel: 'Enterprise ITAD',
    },
  ],
  'nist-800-88-data-destruction': [
    {
      title: 'Secure Data Destruction',
      description: 'Professional NIST 800-88 compliant data destruction for hard drives, SSDs, and all data-bearing devices.',
      serviceUrl: '/services/data-destruction',
      serviceLabel: 'Schedule Destruction',
    },
  ],
  'lithium-ion-battery-recycling-guide': [
    {
      title: 'Battery Recycling Service',
      description: 'Free pickup available for bulk lithium-ion and lead-acid batteries. Professional recycling with material recovery.',
      serviceUrl: '/services/battery-recycling',
      serviceLabel: 'Get Battery Quote',
    },
  ],
  'e-waste-management-rules-2022': [
    {
      title: 'Compliance-Ready Recycling',
      description: 'Our KSPCB-approved facilities ensure your e-waste disposal meets all regulatory requirements in Kerala.',
      serviceUrl: '/services/recycling-kochi',
      serviceLabel: 'View Our Facility',
    },
  ],
  'complete-itad-guide-india': [
    {
      title: 'Enterprise ITAD',
      description: 'Complete IT Asset Disposition for enterprises. Data destruction, bulk collection, and compliance documentation.',
      serviceUrl: '/services/enterprise-itad',
      serviceLabel: 'Enterprise ITAD',
    },
  ],
  'hard-drive-shredding-methods-standards': [
    {
      title: 'Professional Shredding',
      description: 'Secure hard drive destruction and document shredding services with certificate of destruction.',
      serviceUrl: '/services/data-destruction',
      serviceLabel: 'Schedule Service',
    },
  ],
  'environmental-impact-e-waste-kerala': [
    {
      title: 'Support Responsible Recycling',
      description: 'Every recycled device prevents environmental hazards. Schedule your pickup to make a positive impact.',
      serviceUrl: '/services/schedule-pickup',
      serviceLabel: 'Schedule Pickup',
    },
  ],
}

export function getServiceCTAsForArticle(slug: string) {
  return (
    wikiToServiceMapping[slug as keyof typeof wikiToServiceMapping] || []
  )
}
MAPPING_EOF

echo "Wiki-to-service mapping created"
