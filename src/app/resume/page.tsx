import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import {
  SHOW_PHONE,
  basics,
  certifications,
  education,
  experience,
  languages,
  links,
  skills,
} from "@/data/resume";
import { PrintButton } from "@/components/PrintButton";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: `Resume — ${basics.name}`,
  description: `${basics.title} · ${basics.locationShort}`,
};

/**
 * Print-ready resume rendered entirely from the parsed data.
 * Screen: a centred sheet on the site's dark canvas.
 * Print:  plain black-on-white A4 (see the @media print block in globals.css).
 */
export default function ResumePage() {
  const resumeSkills = skills.filter((g) => g.source !== "linkedin");

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      {/* Toolbar — hidden when printing */}
      <div className="no-print container mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="glass">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Back to portfolio
            </Link>
          </Button>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="glass">
              <a href="/Bhavya_Jain_Resume.pdf" download>
                <Download className="size-4" />
                Original PDF
              </a>
            </Button>
            <PrintButton />
          </div>
        </div>
      </div>

      {/* The sheet */}
      <div className="container">
        <article className="print-plain mx-auto max-w-[820px] rounded-2xl glass p-6 sm:p-10 lg:p-12">
          {/* ---------- Header ---------- */}
          <header className="border-b border-border pb-5">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {basics.name}
            </h1>
            <p className="mt-1 text-base font-medium text-[hsl(var(--glow-cyan))] sm:text-lg">
              {basics.title}
            </p>

            <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-3.5" />
                {basics.email}
              </span>
              {SHOW_PHONE && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-3.5" />
                  {basics.phone}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {basics.location}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground sm:text-sm">
              {links
                .filter((l) => l.icon !== "mail")
                .map((link) => {
                  const Icon = link.icon === "github" ? Github : Linkedin;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      className="inline-flex items-center gap-1.5 hover:text-[hsl(var(--glow-cyan))]"
                    >
                      <Icon className="size-3.5" />
                      {link.display}
                    </a>
                  );
                })}
            </div>
          </header>

          {/* ---------- Summary ---------- */}
          <ResumeSection title="Summary">
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
              {basics.summary}
            </p>
          </ResumeSection>

          {/* ---------- Skills ---------- */}
          <ResumeSection title="Skills">
            <dl className="flex flex-col gap-2.5">
              {resumeSkills.map((group) => (
                <div key={group.name} className="text-sm leading-relaxed">
                  <dt className="inline font-semibold">{group.name}: </dt>
                  <dd className="inline text-muted-foreground">
                    {group.items.join(", ")}
                  </dd>
                </div>
              ))}
            </dl>
          </ResumeSection>

          {/* ---------- Experience ---------- */}
          <ResumeSection title="Experience">
            <div className="flex flex-col gap-6">
              {experience.map((role) => (
                <div key={role.id} className="print-break-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-sm font-semibold">
                      {role.company} — {role.role}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {role.location} | {role.dates}
                    </span>
                  </div>

                  {role.summary && (
                    <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                      {role.summary}
                    </p>
                  )}

                  {role.bullets.length > 0 && (
                    <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-[hsl(var(--glow-cyan))]">
                      {role.bullets.map((bullet, i) => (
                        <li key={i} className="text-pretty">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}

                  {role.projects
                    .filter((p) => p.bullets.length > 0)
                    .map((project) => (
                      <div key={project.id} className="mt-3 print-break-avoid">
                        <h4 className="text-sm font-medium">
                          {project.title} —{" "}
                          <span className="font-normal text-muted-foreground">
                            {project.tagline}
                          </span>
                        </h4>
                        <ul className="mt-1.5 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-[hsl(var(--glow-cyan))]">
                          {project.bullets.map((bullet, i) => (
                            <li key={i} className="text-pretty">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </ResumeSection>

          {/* ---------- Education ---------- */}
          <ResumeSection title="Education">
            {education.map((edu) => (
              <div key={edu.degree} className="text-sm">
                <p className="font-semibold">{edu.degree}</p>
                <p className="mt-0.5 text-muted-foreground">
                  {edu.institution}, {edu.location} | {edu.dates}
                  {edu.detail ? ` | ${edu.detail}` : ""}
                </p>
              </div>
            ))}
          </ResumeSection>

          {/* ---------- Certifications ---------- */}
          <ResumeSection title="Certifications">
            <p className="text-sm text-muted-foreground">
              {certifications.map((c) => c.name).join("  |  ")}
            </p>
          </ResumeSection>

          {/* ---------- Languages ---------- */}
          <ResumeSection title="Languages">
            <p className="text-sm text-muted-foreground">
              {languages.map((l) => `${l.name} (${l.level})`).join("  |  ")}
            </p>
          </ResumeSection>
        </article>
      </div>
    </div>
  );
}

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <h2 className="mb-2.5 border-b border-border pb-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[hsl(var(--glow-cyan))]">
        {title}
      </h2>
      {children}
    </section>
  );
}
