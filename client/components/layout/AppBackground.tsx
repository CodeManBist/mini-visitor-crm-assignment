export default function AppBackground() {
  return (
    <>
      {/* Main Background */}
      <div className="app-bg-main fixed inset-0 -z-50 bg-[var(--background)]" />

      {/* Top Gradient */}
      <div className="app-bg-top fixed left-1/2 top-0 -z-40 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-600/14 blur-[180px]" />

      {/* Bottom Gradient */}
      <div className="app-bg-bottom fixed bottom-0 right-0 -z-40 h-[400px] w-[500px] rounded-full bg-cyan-500/10 blur-[150px]" />

      {/* Grid */}
      <div
        className="app-bg-grid fixed inset-0 -z-30 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in_srgb,var(--foreground),transparent 84%) 1px, transparent 1px), linear-gradient(to right,color-mix(in_srgb,var(--foreground),transparent 84%) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </>
  );
}