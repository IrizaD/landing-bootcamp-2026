import type { Metadata } from "next";
import LegalLayout from "../legal-layout";

export const metadata: Metadata = {
  title: "Eliminar mis datos · Data Deletion",
  description: "Solicita la eliminación de tus datos personales de Synergy Education (requerido por Meta/Facebook).",
  robots: { index: true, follow: true },
};

export default function EliminarDatos() {
  return (
    <LegalLayout
      title="Eliminar mis datos"
      subtitle="Ejerce tu derecho al olvido y elimina tu información personal de nuestros sistemas."
      updated="19 de abril de 2026"
    >
      <section>
        <h2>Instrucciones para eliminar tus datos</h2>
        <p>Puedes solicitar la eliminación de tus datos personales en cualquier momento. Seguimos el siguiente proceso:</p>
        <ol>
          <li>
            Envía un correo a{" "}
            <a href="mailto:hola@synergyforeducation.mx?subject=Eliminaci%C3%B3n%20de%20datos%20-%20Bootcamp%202026">
              hola@synergyforeducation.mx
            </a>{" "}
            con el asunto &ldquo;Eliminación de datos - Bootcamp 2026&rdquo;.
          </li>
          <li>Incluye el correo electrónico con el que te registraste. Si lo deseas, comparte tu número de WhatsApp para ayudarnos a localizar el registro.</li>
          <li>Confirmaremos la recepción en un plazo máximo de <strong>72 horas hábiles</strong>.</li>
          <li>Completaremos la eliminación en un plazo máximo de <strong>30 días naturales</strong> desde la confirmación.</li>
        </ol>
      </section>

      <section>
        <h2>¿Qué datos eliminamos?</h2>
        <ul>
          <li>Tu registro (nombre, email, teléfono, país).</li>
          <li>Eventos de analytics asociados a tus identificadores de sesión/visitante.</li>
          <li>Datos personales almacenados por nuestros proveedores (Supabase, email marketing).</li>
        </ul>
      </section>

      <section>
        <h2>Excepciones</h2>
        <p>Podemos conservar datos cuando sean estrictamente necesarios por obligación legal (facturación, contabilidad) o para defender reclamaciones. En ese caso, los datos conservados serán los mínimos requeridos.</p>
      </section>

      <section>
        <h2>Para integraciones con Meta (Facebook / Instagram)</h2>
        <p>Esta URL (<code>/eliminar-datos</code>) es nuestro callback oficial de Data Deletion Request según los requisitos de la Plataforma de Meta. Si llegaste aquí desde un redirect automático y tu solicitud no es atendida en los plazos indicados, escríbenos directamente.</p>
      </section>
    </LegalLayout>
  );
}
