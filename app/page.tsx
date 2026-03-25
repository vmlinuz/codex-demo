export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,211,192,0.28),_transparent_45%),linear-gradient(180deg,_#f6fffd_0%,_#eef9f7_52%,_#e4f2ef_100%)] px-6 py-20 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-5xl flex-col justify-center">
        <div className="max-w-3xl rounded-[2rem] border border-white/70 bg-white/70 p-10 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">
            TinyNotes
          </p>
          <h1 className="mt-4 font-display text-5xl leading-tight tracking-tight text-slate-950 sm:text-6xl">
            Notes architecture centered on Server Components and Server Actions.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            The spec now explicitly removes <code>context_text</code>, rejects query-param-based
            filtering and search, and standardizes on React Server Components for reads plus
            Next.js Server Actions for every mutation.
          </p>
        </div>
      </div>
    </main>
  );
}
