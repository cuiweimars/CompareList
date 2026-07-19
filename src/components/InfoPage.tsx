import { ArrowLeft, ArrowRightLeft } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Link } from "@/i18n/navigation";

interface InfoPageProps {
  title: string;
  intro: string;
  sections: { title: string; body: string }[];
  backLabel: string;
}

export default function InfoPage({ title, intro, sections, backLabel }: InfoPageProps) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-surface/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <ArrowRightLeft size={15} className="text-white" />
            </span>
            CompareList
          </Link>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-14">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text mb-8">
          <ArrowLeft size={14} /> {backLabel}
        </Link>
        <h1 className="text-4xl font-bold font-[family-name:var(--font-sora)] mb-5">{title}</h1>
        <p className="text-lg text-text-secondary leading-relaxed mb-10">{intro}</p>
        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="glass rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
              <p className="text-text-secondary leading-7">{section.body}</p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
