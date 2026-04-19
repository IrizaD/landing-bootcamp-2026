import type { Metadata } from "next";
import LegalLayout from "../legal-layout";

export const metadata: Metadata = {
  title: "Repetición · Bootcamp 2026",
  description: "Acceso por tiempo limitado a la repetición del Bootcamp de Aceleración 2026.",
  robots: { index: false, follow: false },
};

export default function Repeticion() {
  return (
    <LegalLayout
      title="Repetición del Bootcamp 2026"
      subtitle="Solo para quienes no pudieron conectarse los días 5, 6 y 7 de junio."
      updated="9 de junio de 2026"
    >
      <section>
        <p>
          El Bootcamp de Aceleración 2026 se transmitió <strong>únicamente en vivo</strong>. Estamos abriendo una ventana limitada de acceso a la repetición para personas registradas que no pudieron conectarse durante los 3 días.
        </p>
        <p>
          Escríbenos a{" "}
          <a href="mailto:hola@synergyforeducation.mx?subject=Repetici%C3%B3n%20Bootcamp%202026">
            hola@synergyforeducation.mx
          </a>{" "}
          con el correo con el que te registraste originalmente. Te enviaremos las instrucciones.
        </p>
      </section>

      <section>
        <h2>Condiciones de acceso</h2>
        <ul>
          <li>Solo personas que se registraron antes o durante el evento.</li>
          <li>Acceso por tiempo limitado (ventana de repetición).</li>
          <li>No incluye los sorteos en vivo (solo fueron para conectados durante la transmisión original).</li>
          <li>El contenido es propiedad de Synergy Education — no puedes redistribuirlo.</li>
        </ul>
      </section>

      <section>
        <h2>¿Te interesa el próximo Bootcamp?</h2>
        <p>
          Si quieres participar en la siguiente edición en vivo, regístrate en nuestra{" "}
          <a href="/">página principal</a> y te avisaremos primero cuando abramos registro.
        </p>
      </section>
    </LegalLayout>
  );
}
