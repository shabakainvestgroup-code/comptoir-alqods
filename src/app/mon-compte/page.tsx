import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AccountLookup } from "@/components/AccountLookup";

export const metadata: Metadata = {
  title: "Mon compte | Comptoir AlQods",
  description: "Accédez à votre compte client Comptoir AlQods avec téléphone, CNI ou email."
};

export default function AccountPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Mon compte" }]} />
      <section className="bg-soft-bg py-12">
        <div className="container-page">
          <AccountLookup />
        </div>
      </section>
    </>
  );
}
