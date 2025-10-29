import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient / mesh background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1026] via-[#0F172A] to-[#030712]" />
      <div className="pointer-events-none absolute -top-40 -left-32 h-[40rem] w-[40rem] rounded-full bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-pink-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-indigo-500/20 blur-3xl" />

      <main className="relative flex min-h-screen items-center justify-center p-6">
        <Link
          href="/login"
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-3 text-base font-semibold text-white shadow-[0_10px_30px_-10px_rgba(99,102,241,0.7)] transition-all hover:scale-[1.02] hover:shadow-[0_14px_40px_-12px_rgba(99,102,241,0.8)] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-transparent"
        >
          <span className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
          <span className="relative">Go to Login</span>
        </Link>
      </main>
    </div>
  );
}
