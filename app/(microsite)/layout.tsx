"use client";

import { LanguageProvider } from "@/lib/language-context";
import { ChatbotWidget } from "@/components/chatbot-widget";

export default function MicrositeRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <LanguageProvider>
            <div className="flex flex-col min-h-screen">
                {/* MicrositeHeader is rendered in the nested layout [id]/layout.tsx */}
                {children}
                {/* Chatbot can still be here if desired, or removed */}
                <ChatbotWidget />
            </div>
        </LanguageProvider>
    );
}
