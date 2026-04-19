import type { Metadata } from "next";
import LegalLayout from "../legal-layout";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Cómo usamos cookies y tecnologías similares en Synergy Education.",
  robots: { index: true, follow: true },
};

export default function Cookies() {
  return (
    <LegalLayout
      title="Política de Cookies"
      subtitle="Qué tecnologías de seguimiento usamos y cómo controlarlas."
      updated="19 de abril de 2026"
    >
      <section>
        <h2>1. ¿Qué son las cookies?</h2>
        <p>Las cookies y el almacenamiento local del navegador (localStorage, sessionStorage) son pequeños archivos que los sitios guardan en tu dispositivo para reconocerte entre visitas, medir audiencia o personalizar tu experiencia.</p>
      </section>

      <section>
        <h2>2. Tipos de cookies que usamos</h2>
        <ul>
          <li><strong>Esenciales:</strong> ID de sesión anónimo para evitar duplicados y medir conversión. No se pueden desactivar sin romper la funcionalidad.</li>
          <li><strong>Analítica propia:</strong> medimos tiempo en página, secciones vistas, clics y scroll para mejorar la landing.</li>
          <li><strong>Publicidad (Meta Pixel, Google Ads, TikTok):</strong> permiten atribuir conversiones y optimizar campañas. Solo se activan si das consentimiento.</li>
        </ul>
      </section>

      <section>
        <h2>3. Identificadores tipo fbclid / gclid / ttclid</h2>
        <p>Guardamos estos parámetros de URL para atribuir correctamente tu registro a la campaña que te trajo, lo que nos permite optimizar el gasto publicitario.</p>
      </section>

      <section>
        <h2>4. Cómo controlar las cookies</h2>
        <ul>
          <li>Desde la configuración de tu navegador puedes bloquear o eliminar cookies.</li>
          <li>Puedes usar los opt-outs de los anunciantes: <a href="https://www.facebook.com/settings?tab=ads" target="_blank" rel="noopener noreferrer">Meta</a>, <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">Google</a>.</li>
          <li>El modo incógnito evita la persistencia entre sesiones.</li>
        </ul>
      </section>

      <section>
        <h2>5. Almacenamiento local</h2>
        <p>Guardamos dos identificadores anónimos (<code>_sid</code> y <code>_vid</code>) en <code>sessionStorage</code> y <code>localStorage</code> respectivamente. No contienen datos personales directos y puedes borrarlos en cualquier momento.</p>
      </section>
    </LegalLayout>
  );
}
