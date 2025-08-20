import Link from "next/link";

export function Hero() {
  return (
    <section 
      aria-labelledby="hero-heading"
      className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 overflow-x-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="text-[12px] leading-[18px] tracking-[.08em] uppercase text-slate-500">
            60 seconds to your first receipt
          </div>
          
          <h1 
            id="hero-heading"
            className="text-[56px] leading-[64px] sm:text-[36px] sm:leading-[44px] font-semibold text-slate-900 dark:text-slate-200 max-w-[16ch] mt-3"
          >
            Turn action into proof
          </h1>
          
          <p className="text-[18px] leading-[28px] sm:text-[16px] sm:leading-[26px] text-slate-600 dark:text-slate-300 max-w-[60ch] mt-4">
            For those who care about the planet. Measure, verify, and share environmental impact in minutes.
          </p>
          
          <div className="flex items-center gap-7 mt-6">
            <Link
              href="/new"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-3 text-[16px] leading-[24px] font-medium shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors cursor-pointer"
            >
              Create your first receipt
            </Link>
            <Link
              href="/r/demo"
              className="text-indigo-700 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 inline-flex items-center gap-1 underline-offset-4 hover:underline transition-colors cursor-pointer"
            >
              See example →
            </Link>
          </div>
          
          <p className="text-[13px] leading-[20px] text-slate-500 dark:text-slate-400 mt-3">
            No account needed. You can save later.
          </p>
        </div>

        <div className="hidden md:block">
          <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-md flex items-center justify-center">
            <div className="text-center text-slate-500 dark:text-slate-400">
              <div className="text-lg font-medium">Image Placeholder</div>
              <div className="text-sm">4:3 Aspect Ratio</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}