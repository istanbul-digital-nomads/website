import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          Istanbul Digital Nomads
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
          A community for remote workers, freelancers, and digital nomads living
          in or visiting Istanbul. Join us for meetups, resources, and real
          connections.
        </p>
        <div className="mt-10 flex gap-4">
          <a
            href="https://t.me/istanbul_digital_nomads"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-700"
          >
            Join on Telegram
          </a>
          <Link
            href="/about"
            className="rounded-lg border border-neutral-300 px-6 py-3 font-medium transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Learn More
          </Link>
        </div>
      </section>
    </main>
  );
}
