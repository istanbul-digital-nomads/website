import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LoginForm } from "./login-form";
import { Container } from "@/components/ui/container";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("loginPage.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LoginPage() {
  const t = await getTranslations("loginPage");
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
            <h1 className="mt-6 text-2xl font-bold">{t("heading")}</h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-[#85929e]">
              {t("subheading")}
            </p>
          </div>

          <div className="mt-8">
            <LoginForm />
          </div>

          <p className="mt-8 text-center text-xs text-neutral-500 dark:text-[#85929e]">
            {t("disclaimer")}
          </p>
        </div>
      </Container>
    </section>
  );
}
