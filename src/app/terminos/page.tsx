import type { Metadata } from "next";
import LegalLayout from "../legal-layout";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Términos de uso del Bootcamp y la plataforma Synergy Education.",
  robots: { index: true, follow: true },
};

export default function Terminos() {
  return (
    <LegalLayout
      title="Términos y Condiciones"
      subtitle="Reglas de uso de la landing y del Bootcamp de Aceleración 2026."
      updated="19 de abril de 2026"
    >
      <section>
        <h2>1. Aceptación</h2>
        <p>Al registrarte y/o utilizar este sitio, aceptas estos Términos y la <a href="/privacidad">Política de Privacidad</a>. Si no estás de acuerdo, no uses el sitio ni te registres al evento.</p>
      </section>

      <section>
        <h2>2. Sobre el Bootcamp</h2>
        <ul>
          <li>Evento 100% online los días <strong>5, 6 y 7 de junio de 2026</strong>.</li>
          <li>Valor referencial: <strong>$497 USD</strong>. Los registros hechos antes del 20 de mayo reciben acceso digital de cortesía sin costo.</li>
          <li>Nos reservamos el derecho de modificar la agenda, lista de speakers o bases de premios, notificando con anticipación razonable.</li>
        </ul>
      </section>

      <section>
        <h2>3. Premios y sorteos</h2>
        <p>Los sorteos son promocionales, abiertos a quienes estén registrados y conectados en vivo durante el evento. Cada premio tiene bases específicas que serán anunciadas durante la transmisión. La decisión del organizador es final.</p>
      </section>

      <section>
        <h2>4. Testimonios y resultados</h2>
        <p>Los testimonios mostrados son reales y representan experiencias individuales. <strong>No constituyen garantía de resultados</strong>. Los resultados de cada participante dependen de su experiencia, esfuerzo, ejecución y condiciones de mercado.</p>
      </section>

      <section>
        <h2>5. Propiedad intelectual</h2>
        <p>Todo el contenido de este sitio y del Bootcamp (marca, copy, diseño, materiales, grabaciones) es propiedad de Synergy Education / Sinergéticos. Queda prohibida su reproducción sin autorización escrita.</p>
      </section>

      <section>
        <h2>6. Conducta</h2>
        <p>Durante el evento te comprometes a no grabar, redistribuir ni compartir el contenido en plataformas externas. El incumplimiento puede resultar en la remoción del acceso y acciones legales.</p>
      </section>

      <section>
        <h2>7. Comunicaciones</h2>
        <p>Al registrarte, aceptas recibir comunicaciones relacionadas con el evento y el ecosistema Sinergéticos por correo, WhatsApp o SMS. Siempre puedes darte de baja.</p>
      </section>

      <section>
        <h2>8. Limitación de responsabilidad</h2>
        <p>En la máxima extensión permitida por la ley, Synergy Education no será responsable por daños indirectos o consecuentes derivados del uso del sitio o del evento.</p>
      </section>

      <section>
        <h2>9. Ley aplicable</h2>
        <p>Estos términos se rigen por las leyes de México. Cualquier disputa será resuelta por los tribunales competentes de Guadalajara, Jalisco.</p>
      </section>

      <section>
        <h2>10. Contacto</h2>
        <p>Escríbenos a <a href="mailto:hola@synergyforeducation.mx">hola@synergyforeducation.mx</a>.</p>
      </section>
    </LegalLayout>
  );
}
