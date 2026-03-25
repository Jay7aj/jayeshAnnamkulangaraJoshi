// src/components/layout/Layout.tsx

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f3f4f6", minHeight: "100vh" }}>
      
      {/* Header */}
      <header
        style={{
          background: "#1f2937",
          color: "white",
          padding: "12px 20px",
          fontSize: "18px",
          fontWeight: "bold"
        }}
      >
        Issue Tracker
      </header>

      {/* Content */}
      <main
        style={{
          maxWidth: "900px",
          margin: "20px auto",
          padding: "0 15px"
        }}
      >
        {children}
      </main>

    </div>
  );
}