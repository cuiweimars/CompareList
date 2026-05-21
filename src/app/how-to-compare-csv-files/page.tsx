import type { Metadata } from "next";
import { ArrowRightLeft, ArrowRight, FileSpreadsheet, Check } from "lucide-react";
import RelatedTools from "@/components/RelatedTools";

export const metadata: Metadata = {
  title: "How to Compare Two CSV Files Online - Free CSV Comparison Guide | CompareList",
  description:
    "Learn how to compare two CSV files online for free. Find differences between CSV files, compare specific columns, and export comparison results. Step-by-step tutorial.",
  keywords: [
    "compare csv files",
    "compare two csv files",
    "csv comparison tool",
    "find differences in csv",
    "compare csv columns",
    "csv diff tool",
  ],
  openGraph: {
    title: "How to Compare Two CSV Files Online",
    description: "Free guide to comparing CSV files. Find differences, compare columns, and export results instantly.",
  },
};

export default function HowToCompareCSVFilesPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-surface/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <ArrowRightLeft size={14} className="text-white" />
            </div>
            <span className="font-bold text-lg font-[family-name:var(--font-sora)]">CompareList</span>
          </a>
          <span className="text-text-muted text-sm">/ Tutorials</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-16 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Tutorial</span>
          <h1 className="text-4xl font-bold font-[family-name:var(--font-sora)] mt-3 mb-4">
            How to Compare Two CSV Files
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Compare CSV files to find added, removed, and common rows. Works with any CSV structure and lets you pick specific columns.
          </p>
        </div>

        {/* Why compare CSVs */}
        <div className="glass rounded-xl p-6 mb-12">
          <h2 className="font-semibold text-lg mb-4 font-[family-name:var(--font-sora)]">Why Compare CSV Files?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Data Auditing", desc: "Verify data changes between exports from different dates or systems." },
              { title: "List Reconciliation", desc: "Find items present in one dataset but missing from another." },
              { title: "Deduplication", desc: "Identify overlapping records across multiple CSV files." },
              { title: "Migration Validation", desc: "Confirm all records transferred correctly after data migration." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check size={16} className="text-success mt-1 shrink-0" />
                <div>
                  <h3 className="font-medium text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-text-secondary">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-16">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-sora)]">Steps to Compare CSV Files</h2>
          {[
            {
              title: "Upload Your CSV Files",
              desc: 'Click the "Upload File" button on each input panel to select a CSV file. You can also drag and drop files directly onto the input areas. When you upload a multi-column CSV, a column selector dropdown appears automatically — pick the column you want to compare.',
            },
            {
              title: "Select the Right Column",
              desc: "For multi-column CSVs, use the column selector dropdown to pick which column to compare. This lets you compare specific fields like email addresses, IDs, or product names from within larger datasets.",
            },
            {
              title: "Run the Comparison",
              desc: 'Click "Compare Lists" to get instant results. The tool will show you items only in file A, only in file B, and items present in both files. Statistics and a Venn diagram give you a quick overview.',
            },
            {
              title: "Export the Results",
              desc: 'Export individual categories as CSV or TXT, or use "Full Report" to download everything in a single categorized CSV file. You can also copy results directly to your clipboard.',
            },
          ].map((step, i) => (
            <div key={i} className="glass rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center shrink-0 border border-border">
                  <span className="text-lg font-bold font-[family-name:var(--font-sora)] hero-gradient-text">{i + 1}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 font-[family-name:var(--font-sora)]">{step.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Supported Formats */}
        <div className="glass rounded-xl p-6 mb-12">
          <h2 className="font-semibold text-lg mb-4 font-[family-name:var(--font-sora)]">Supported File Formats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { ext: ".csv", name: "Comma-Separated Values", desc: "Standard CSV with header detection and column selection." },
              { ext: ".tsv", name: "Tab-Separated Values", desc: "Auto-detected tab-delimited files with column support." },
              { ext: ".txt", name: "Plain Text", desc: "One item per line, or comma/semicolon/tab separated." },
            ].map((fmt, i) => (
              <div key={i} className="flex items-start gap-3">
                <FileSpreadsheet size={18} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-medium text-sm mb-1">{fmt.ext} — {fmt.name}</h3>
                  <p className="text-xs text-text-secondary">{fmt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Tools */}
        <div className="mb-16">
          <RelatedTools current="/how-to-compare-csv-files" />
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="glass rounded-2xl p-8 gradient-border glow-primary inline-block">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-sora)] mb-3">Compare Your CSV Files Now</h2>
            <p className="text-text-secondary mb-6">Free, instant, and completely private. No signup required.</p>
            <a href="/" className="btn-primary inline-flex items-center gap-2 px-7 py-3 text-base font-semibold text-white rounded-xl">
              Start Comparing <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
