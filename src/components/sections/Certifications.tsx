import { Award, ExternalLink } from 'lucide-react';
import type { Certification } from '../../types';

interface CertificationsProps {
  certifications: Certification[];
}

export function Certifications({ certifications }: CertificationsProps) {
  return (
    <section id="certifications" className="space-y-12">
      <div className="flex items-center gap-6">
        <h2 className="text-3xl font-bold tracking-tight">Certifications &amp; Expertise</h2>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.length === 0 ? (
          <p className="text-zinc-500 italic col-span-full">
            Certifications will appear here once added in admin.
          </p>
        ) : (
          certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-emerald-500/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-all">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {cert.date}
                </span>
              </div>
              <h4 className="text-lg font-bold mb-1 group-hover:text-emerald-500 transition-colors">
                {cert.name}
              </h4>
              <p className="text-zinc-500 text-sm mb-4">{cert.issuer}</p>
              {cert.url && cert.url !== '#' && (
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors"
                >
                  View Certificate <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
