import type { Metadata } from "next";
import { LoginForm } from "./login-form";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Istanbul Digital Nomads with your Google account.",
};

export default function LoginPage() {
  return (
    <section className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-16">
      <Container>
        <div className="mx-auto max-w-sm">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/30">
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                IN
              </span>
            </div>
            <h1 className="mt-6 text-2xl font-bold">Sign in</h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Sign in to RSVP to events and manage your profile.
            </p>
          </div>

          <div className="mt-8">
            <LoginForm />
          </div>

          <p className="mt-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
            By signing in, you agree to be a respectful member of the Istanbul
            Digital Nomads community.
          </p>
        </div>
      </Container>
    </section>
  );
}
