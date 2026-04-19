import React from "react";

interface LegalLayoutProps {
  title:    string;
  subtitle: string;
  updated:  string;
  children: React.ReactNode;
}

export default function LegalLayout({ title, subtitle, updated, children }: LegalLayoutProps) {
  return (
    <main className="legal-page">
      <div className="container">
        <a href="/" className="legal-back">← Volver al Bootcamp</a>
        <header className="legal-header">
          <div className="legal-eyebrow">Synergy Education · Sinergéticos</div>
          <h1 className="legal-title">{title}</h1>
          <p className="legal-subtitle">{subtitle}</p>
          <div className="legal-updated">Última actualización: {updated}</div>
        </header>
        <article className="legal-body">{children}</article>
        <footer className="legal-footer">
          <p>
            ¿Dudas? Escríbenos a{" "}
            <a href="mailto:hola@synergyforeducation.mx">hola@synergyforeducation.mx</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
