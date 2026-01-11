import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Resource Hub",
};

export default function ResourcesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
