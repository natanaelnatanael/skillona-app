export const metadata = { title: "Skillona — MVP", description: "AI Viral Video Generator" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body style={{margin:0,background:"#0b0b10",color:"#fff",fontFamily:"Inter,system-ui,Arial"}}>{children}</body></html>);
}
