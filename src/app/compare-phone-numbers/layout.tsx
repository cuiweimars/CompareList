import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Phone Numbers - CompareList | Free Online Tool",
  description:
    "Compare two phone number lists instantly. Find differences, common numbers, and unique entries. Free, private, no signup required.",
};

export default function ComparePhoneNumbersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
