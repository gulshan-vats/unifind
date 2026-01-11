import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hackathons",
};

export default function HackathonsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
