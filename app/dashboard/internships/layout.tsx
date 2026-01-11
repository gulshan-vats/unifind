import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Internships",
};

export default function InternshipsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
