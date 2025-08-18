import { ClerkProvider } from "@clerk/nextjs";

export const metadata = { title: "Skillona — AI Viral Video Generator", description: "From prompt to viral-ready short." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body style={{margin:0,background:"#0b0b10",color:"#fff",fontFamily:"Inter,system-ui,Arial"}}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}




