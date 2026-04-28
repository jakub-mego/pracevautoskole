export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16">
      <div className="aurora">
        <div className="blob" />
      </div>
      <div className="absolute inset-0 surface-grain pointer-events-none opacity-50" />
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-paper)] p-8 shadow-[var(--shadow-elevated)] sm:p-10">
          {children}
        </div>
      </div>
    </main>
  );
}
