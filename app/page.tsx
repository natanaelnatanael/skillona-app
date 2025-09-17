import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function HomePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Welcome to Skillona
      </h1>

      {/* Ako user nije prijavljen */}
      <SignedOut>
        <div style={{ display: "flex", gap: 12 }}>
          <SignInButton mode="redirect">
            <button
              style={{
                background: "#6c47ff",
                color: "#fff",
                padding: "10px 18px",
                borderRadius: 8,
                fontWeight: 600,
              }}
            >
              Sign In
            </button>
          </SignInButton>

          <SignUpButton mode="redirect">
            <button
              style={{
                background: "#333",
                color: "#fff",
                padding: "10px 18px",
                borderRadius: 8,
                fontWeight: 600,
              }}
            >
              Sign Up
            </button>
          </SignUpButton>
        </div>
      </SignedOut>

      {/* Ako je user prijavljen */}
      <SignedIn>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <p style={{ fontSize: 18 }}>You are signed in 🎉</p>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </main>
  );
}

