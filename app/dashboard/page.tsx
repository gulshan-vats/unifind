import { ChatView } from "@/components/chat-view"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ask AI",
};

export default function Page() {
  return <ChatView />
}
