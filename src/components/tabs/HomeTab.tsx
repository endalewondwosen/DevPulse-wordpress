import type { FormEvent } from 'react';
import type { Certification, Experience, Skill } from '../../types';
import type { ContactFormState } from '../sections/Contact';
import { BuiltFor } from '../sections/BuiltFor';
import { Certifications } from '../sections/Certifications';
import { Contact } from '../sections/Contact';
import { Currently } from '../sections/Currently';
import { Experience as ExperienceSection } from '../sections/Experience';
import { Hero } from '../sections/Hero';
import { HowIWork } from '../sections/HowIWork';
import { SelectedWork } from '../sections/SelectedWork';
import { Skills as SkillsSection } from '../sections/Skills';
import { Testimonial } from '../sections/Testimonial';

interface HomeTabProps {
  settings: Record<string, string>;
  loading: boolean;
  skills: Skill[];
  experience: Experience[];
  certifications: Certification[];
  contactForm: ContactFormState;
  setContactForm: (next: ContactFormState) => void;
  onSubmitContact: (e: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  onExploreProjects: () => void;
  onOpenResume: () => void;
}

export function HomeTab({
  settings,
  loading,
  skills,
  experience,
  certifications,
  contactForm,
  setContactForm,
  onSubmitContact,
  isSubmitting,
  onExploreProjects,
  onOpenResume,
}: HomeTabProps) {
  return (
    <>
      <Hero
        settings={settings}
        loading={loading}
        onExploreProjects={onExploreProjects}
        onOpenResume={onOpenResume}
      />

      <BuiltFor />

      <SelectedWork onSeeAllProjects={onExploreProjects} />

      <Currently />

      <SkillsSection skills={skills} />

      <HowIWork />

      <ExperienceSection experience={experience} />

      <Certifications certifications={certifications} />

      <Testimonial contactEmail={settings.contact_email} />

      <Contact
        contactForm={contactForm}
        setContactForm={setContactForm}
        onSubmit={onSubmitContact}
        isSubmitting={isSubmitting}
        contactEmail={settings.contact_email}
      />
    </>
  );
}

