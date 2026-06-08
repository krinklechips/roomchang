"use client";

// Last-resort error boundary: replaces the root layout entirely, so global CSS
// and the i18n provider are NOT available here. Keep it fully self-contained
// (inline styles, English) and on-brand.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
          textAlign: "center",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          background: "#fdf2f7",
          color: "#2c1a28",
        }}
      >
        <div style={{ maxWidth: "30rem" }}>
          <h1 style={{ fontSize: "1.75rem", margin: "0 0 0.75rem", color: "#cc3771" }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, margin: "0 0 1.5rem", color: "#705569" }}>
            Sorry, an unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              display: "inline-block",
              background: "#cc3771",
              color: "#fff",
              border: "none",
              borderRadius: "999px",
              padding: "0.75rem 1.75rem",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
