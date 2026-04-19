import type { Metadata } from "next";
import LegalLayout from "../legal-layout";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Cómo recolectamos, usamos y protegemos tus datos personales en Synergy Education.",
  robots: { index: true, follow: true },
};

export default function Privacidad() {
  return (
    <LegalLayout
      title="Política de Privacidad"
      subtitle="Transparencia sobre cómo tratamos tus datos personales."
      updated="19 de abril de 2026"
    >
      <section>
        <h2>1. Responsable del tratamiento</h2>
        <p>
          <strong>Synergy Education / Sinergéticos</strong> (&ldquo;nosotros&rdquo;) es responsable del tratamiento de los
          datos personales que nos proporcionas en esta landing. Puedes contactarnos en{" "}
          <a href="mailto:hola@synergyforeducation.mx">hola@synergyforeducation.mx</a>.
        </p>
      </section>

      <section>
        <h2>2. Datos que recolectamos</h2>
        <ul>
          <li><strong>Datos de registro:</strong> nombre, correo electrónico, teléfono (WhatsApp) y país.</li>
          <li><strong>Datos técnicos y de uso:</strong> dirección IP, país/ciudad aproximados, dispositivo, sistema operativo, navegador, tamaño de pantalla, idioma, zona horaria, tiempo en página, secciones vistas, scroll, clics, páginas visitadas, fuente de tráfico (UTMs, referer, fbclid, gclid, ttclid).</li>
          <li><strong>Cookies y almacenamiento local:</strong> identificador anónimo de sesión y visitante para evitar duplicados y medir conversión.</li>
        </ul>
      </section>

      <section>
        <h2>3. Finalidades del tratamiento</h2>
        <ul>
          <li>Confirmar tu registro al Bootcamp y enviarte información del evento.</li>
          <li>Medir tráfico, engagement y conversión (analytics propio).</li>
          <li>Optimizar campañas publicitarias en Meta, Google, TikTok y canales similares.</li>
          <li>Enviarte comunicaciones comerciales relacionadas al ecosistema Sinergéticos. Siempre podrás dar de baja.</li>
        </ul>
      </section>

      <section>
        <h2>4. Bases legales</h2>
        <p>Tratamos tus datos con base en tu consentimiento explícito al registrarte y en el interés legítimo de operar, medir y mejorar el evento.</p>
      </section>

      <section>
        <h2>5. Tiempo de conservación</h2>
        <p>Conservamos tus datos mientras exista relación con el ecosistema Sinergéticos y durante los plazos legalmente exigibles. Puedes pedir su eliminación en cualquier momento.</p>
      </section>

      <section>
        <h2>6. Terceros con acceso a los datos</h2>
        <ul>
          <li><strong>Supabase</strong> — base de datos y almacenamiento.</li>
          <li><strong>Vercel</strong> — infraestructura de hosting y geolocalización por IP.</li>
          <li><strong>Meta (Facebook / Instagram)</strong> — publicidad y pixel de conversión.</li>
          <li><strong>Google (Ads / Analytics / Tag Manager)</strong> — medición y publicidad.</li>
          <li><strong>Email / WhatsApp providers</strong> — envío de comunicaciones transaccionales.</li>
        </ul>
        <p>No vendemos tus datos a terceros bajo ninguna circunstancia.</p>
      </section>

      <section>
        <h2>7. Tus derechos (ARCO / GDPR)</h2>
        <p>Tienes derecho a <strong>acceder, rectificar, cancelar u oponerte</strong> al tratamiento, así como a la <strong>portabilidad</strong> de tus datos. Para ejercerlos escríbenos a <a href="mailto:hola@synergyforeducation.mx">hola@synergyforeducation.mx</a> o utiliza nuestro formulario de <a href="/eliminar-datos">Eliminar mis datos</a>.</p>
      </section>

      <section>
        <h2>8. Seguridad</h2>
        <p>Aplicamos medidas técnicas y organizativas razonables para proteger tus datos, incluyendo cifrado en tránsito (TLS), control de acceso y minimización del dato.</p>
      </section>

      <section>
        <h2>9. Cambios en esta política</h2>
        <p>Podemos actualizar esta política cuando cambien nuestras prácticas. La versión vigente siempre estará publicada en esta URL con su fecha de actualización.</p>
      </section>
    </LegalLayout>
  );
}
