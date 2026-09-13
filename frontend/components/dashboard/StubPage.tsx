interface StubPageProps {
  title: string;
  description: string;
}

export function StubPage({ title, description }: StubPageProps) {
  return (
    <div className="min-h-[100dvh] bg-ground">
      <main className="shell flex flex-col items-start gap-3 py-section">
        <span className="inline-flex items-center rounded-sm bg-accent-soft px-3 py-1 text-fluid-xs font-semibold text-accent">
          Coming in a later phase
        </span>
        <h1 className="font-display text-fluid-2xl font-semibold leading-tight text-ink">
          {title}
        </h1>
        <p className="max-w-[62ch] text-fluid-base leading-relaxed text-ink-soft">{description}</p>
      </main>
    </div>
  );
}
