import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { socialLinks } from "@/lib/constants";

export async function CtaBanner() {
  const t = await getTranslations("ctaBanner");

  return (
    <section className="bg-primary-600 py-16 dark:bg-primary-900">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-primary-100">{t("body")}</p>
          <div className="mt-8">
            <a
              href={socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-700 hover:bg-primary-50"
              >
                {t("cta")}
                <ArrowRight className="h-5 w-5 rtl:-scale-x-100" />
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
