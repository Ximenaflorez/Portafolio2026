import type { ReactNode } from "react";
import { TextLink } from "~/components/atoms/TextLink";
import { Anexar, Campo, PlantillaPrototipo } from "./piezas";

// Prototipo de aprobación T046: página de un caso de estudio largo, con contenido INVENTADO
// (anonimizado, FR-030). Solo en desarrollo; se borra al aprobarse.
// Las cajas «Qué anexar» y los recuadros de imagen son andamios del prototipo: no existirán.

const caso = {
  titulo: "Rediseño del flujo de despacho en una plataforma logística B2B",
  tipo: "B2B SaaS",
  resumen: {
    producto:
      "Plataforma web B2B para coordinar despachos de carga, usada por equipos de operaciones de empresas de logística medianas.",
    rol: "Product Designer líder",
    equipo: "1 PM, 4 desarrolladores, 1 QA",
    duracion: "6 meses",
    resultado:
      "Entre 20% y 30% menos abandono en el flujo de despacho, y cerca de un tercio menos de tickets de soporte relacionados.",
  },
};

const indice = [
  { id: "problema-inicial", label: "1. Problema inicial" },
  { id: "investigacion", label: "2. Investigación" },
  { id: "arquitectura", label: "3. Arquitectura de la solución" },
  { id: "resultados", label: "4. Resultados y aprendizajes" },
];

function Figura({ alt, pie, pista }: { alt: string; pie: string; pista: string }) {
  return (
    <figure className="mt-4">
      <div
        role="img"
        aria-label={alt}
        className="flex aspect-video items-center justify-center border border-dashed border-border-strong bg-surface p-4 text-center text-text-muted"
      >
        {pista}
      </div>
      <figcaption className="mt-1 text-sm text-text-muted">{pie}</figcaption>
    </figure>
  );
}

function Seccion({ id, titulo, children }: { id: string; titulo: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`t-${id}`} className="mt-12 border-t border-border pt-6">
      <h2 id={`t-${id}`} className="text-2xl">
        {titulo}
      </h2>
      {children}
    </section>
  );
}

function PaginaCaso() {
  return (
    <article className="py-8">
      <TextLink to="/#trabajos" variant="standalone">
        <span aria-hidden="true">←&nbsp;</span>Volver a Trabajos
      </TextLink>

      <p className="mt-4 text-text-muted">Caso de producto · {caso.tipo}</p>
      <h1 className="mt-1 text-3xl">{caso.titulo}</h1>

      <h2 className="mt-6 text-xl">Resumen en 30 segundos</h2>
      <dl className="mt-2 grid gap-2 border border-border bg-surface p-4 sm:grid-cols-2">
        <Campo etiqueta="Producto">{caso.resumen.producto}</Campo>
        <Campo etiqueta="Mi rol">{caso.resumen.rol}</Campo>
        <Campo etiqueta="Equipo">{caso.resumen.equipo}</Campo>
        <Campo etiqueta="Duración">{caso.resumen.duracion}</Campo>
        <div className="sm:col-span-2">
          <dt className="font-semibold">Resultado clave</dt>
          <dd className="mt-0.5 text-lg">{caso.resumen.resultado}</dd>
        </div>
      </dl>
      <Anexar>
        producto (qué es y para quién), tu rol, el equipo, la duración y el resultado clave en una
        frase con una métrica. Más una línea de resultado para la tarjeta de Trabajos. Todo
        anonimizado: sin nombres de empresa ni de personas.
      </Anexar>

      <nav aria-label="En este caso" className="mt-6">
        <p className="font-semibold">En este caso</p>
        <ol className="mt-1 flex flex-wrap gap-x-3">
          {indice.map((item) => (
            <li key={item.id}>
              <TextLink href={`#${item.id}`} variant="standalone">
                {item.label}
              </TextLink>
            </li>
          ))}
        </ol>
      </nav>

      <div className="max-w-prose">
        <Seccion id="problema-inicial" titulo="1. Problema inicial">
          <p className="mt-1 text-text-muted">Tensión: ¿por qué esto importaba?</p>
          <dl className="mt-2 space-y-2">
            <Campo etiqueta="Contexto de negocio">
              La empresa es una plataforma SaaS de logística de cerca de 200 personas. El despacho
              era la acción que generaba ingresos, y la tasa de despachos completados venía cayendo
              trimestre a trimestre.
            </Campo>
            <Campo etiqueta="Problema del usuario">
              Las coordinadoras de operaciones debían crear un despacho en dos flujos separados
              (carga y transporte) y repetir datos que ya habían ingresado. Perdían tiempo y
              cometían errores de captura.
            </Campo>
            <Campo etiqueta="Cómo lo sabíamos">
              Los tickets de soporte del tipo «no encuentro el despacho que creé» crecían cada mes,
              y el embudo de analítica mostraba que más de la mitad de quienes empezaban un despacho
              lo abandonaba en el segundo paso.
            </Campo>
            <Campo etiqueta="Objetivo y métrica de éxito">
              Reducir al menos 20% el abandono del flujo y bajar los tickets relacionados, medido a
              90 días del lanzamiento.
            </Campo>
            <Campo etiqueta="Restricciones">
              Un trimestre para la primera entrega, un sistema heredado que no se podía reemplazar y
              obligaciones regulatorias sobre los datos de la carga.
            </Campo>
          </dl>
          <Anexar>
            contexto de negocio, el problema del usuario, la señal inicial (tickets, métricas,
            quejas), el objetivo con su métrica y las restricciones reales.
          </Anexar>
        </Seccion>

        <Seccion id="investigacion" titulo="2. Investigación">
          <p className="mt-1 text-text-muted">Descubrimiento: ¿qué aprendiste que no era obvio?</p>
          <dl className="mt-2 space-y-2">
            <Campo etiqueta="Métodos">
              Entrevistas, análisis del embudo, revisión de 120 tickets y pruebas de usabilidad
              sobre un prototipo.
            </Campo>
            <Campo etiqueta="Muestra">
              9 entrevistas a coordinadoras y supervisores de 4 empresas clientes de distintos
              tamaños, y 6 sesiones de prueba.
            </Campo>
            <Campo etiqueta="Hallazgos">
              <ol className="list-decimal space-y-1 pl-4">
                <li>Más de la mitad abandonaba el flujo en el segundo paso.</li>
                <li>Abrían dos pestañas para copiar datos de un flujo al otro.</li>
                <li>
                  Las etiquetas («manifiesto», «orden de servicio») no coincidían con su
                  vocabulario.
                </li>
                <li>La mayoría trabajaba con cargas recurrentes, no con despachos nuevos.</li>
              </ol>
            </Campo>
            <Campo etiqueta="Evidencia">
              «Siempre termino copiando el número de carga en un bloc de notas para no perderlo.»
              Coordinadora de operaciones, empresa de logística mediana.
            </Campo>
            <Campo etiqueta="Insight que cambió el rumbo">
              El problema no era el formulario, sino separar en dos flujos lo que para la usuaria
              era una sola tarea.
            </Campo>
          </dl>
          <Anexar>
            los métodos, cuántas personas y de qué perfiles, entre 3 y 5 hallazgos, una cita o un
            dato real anonimizado y el insight que cambió el rumbo.
          </Anexar>
        </Seccion>
      </div>
      <Figura
        alt="Gráfico de barras del porcentaje de usuarias que continúan en cada paso del flujo original: la caída más fuerte ocurre entre el primer y el segundo paso."
        pie="Figura 1. Porcentaje de usuarias que continúan en cada paso del flujo original. La mayor caída está en el segundo paso."
        pista="Imagen o diagrama de apoyo, ancho completo (hasta 1024px)"
      />
      <Anexar>
        una imagen o diagrama (PNG, WebP o SVG, de unos 1600px de ancho, sin logos ni datos reales),
        su texto alternativo (qué se ve y qué conclusión muestra) y un pie de imagen. El caso tiene
        que entenderse aunque la imagen no cargue.
      </Anexar>

      <div className="max-w-prose">
        <Seccion id="arquitectura" titulo="3. Arquitectura de la solución">
          <p className="mt-1 text-text-muted">Decisión: ¿qué elegiste y qué descartaste?</p>
          <dl className="mt-2 space-y-2">
            <Campo etiqueta="Flujo o arquitectura de información">
              Unificamos los dos flujos en uno solo de tres pasos (carga, transporte y
              confirmación), con los datos persistentes de un paso al siguiente.
            </Campo>
            <Campo etiqueta="Decisiones clave">
              <ul className="space-y-2">
                <li>
                  <strong>Unificar los dos flujos.</strong> Motivo: eliminaba la copia de datos, que
                  era la causa del abandono. Alternativa descartada: un asistente guiado, porque
                  frenaba a las usuarias frecuentes.
                </li>
                <li>
                  <strong>Guardar borradores automáticamente.</strong> Motivo: nadie perdía lo ya
                  capturado al salir. Alternativa descartada: un botón de guardar manual, que muchas
                  no usaban.
                </li>
              </ul>
            </Campo>
            <Campo etiqueta="Sistema y componentes">
              Reutilizamos formularios, tablas y alertas del sistema de diseño y creamos un
              componente de paso con resumen persistente.
            </Campo>
            <Campo etiqueta="Colaboración con ingeniería">
              Taller de viabilidad con dos desarrolladores en la segunda semana. Acordamos entregar
              paso por paso detrás de un interruptor de funcionalidad y ajustamos las validaciones
              del servidor.
            </Campo>
            <Campo etiqueta="Validación">
              Prueba de usabilidad con 6 personas sobre un prototipo de alta fidelidad: 5 de 6
              completaron el flujo sin ayuda. Después, despliegue gradual al 10%, 50% y 100%.
            </Campo>
          </dl>
          <Anexar>
            el flujo o la arquitectura de información (con diagrama), al menos una decisión clave
            con su motivo y la alternativa descartada, qué componentes reutilizaste o creaste, cómo
            trabajaste con ingeniería y cómo validaste antes de lanzar.
          </Anexar>
        </Seccion>
      </div>
      <Figura
        alt="Diagrama comparativo: antes, dos flujos separados con datos repetidos; después, un solo flujo de tres pasos con datos persistentes."
        pie="Figura 2. Antes: dos flujos con datos repetidos. Después: un flujo de tres pasos con los datos persistentes."
        pista="Imagen o diagrama de apoyo, ancho completo (hasta 1024px)"
      />

      <div className="max-w-prose">
        <Seccion id="resultados" titulo="4. Resultados y aprendizajes">
          <p className="mt-1 text-text-muted">
            Impacto y reflexión: ¿qué cambió y cómo creciste como profesional?
          </p>
          <dl className="mt-2 space-y-2">
            <Campo etiqueta="Resultados">
              A 90 días del lanzamiento, el abandono del flujo bajó entre 20% y 30% y los tickets
              relacionados bajaron cerca de un tercio. En pruebas internas, crear un despacho
              tardaba casi la mitad.
            </Campo>
            <Campo etiqueta="Lo que no funcionó">
              El primer diseño del filtro de cargas recurrentes confundió a usuarias nuevas. Lo
              descubrimos tarde, durante el piloto, y retrasó una semana la entrega.
            </Campo>
            <Campo etiqueta="Lo que haría distinto">
              Incluiría usuarias nuevas desde la primera ronda de pruebas y mediría también los
              errores de captura, no solo el abandono.
            </Campo>
            <Campo etiqueta="Siguientes pasos">
              Extender el patrón de pasos con resumen persistente al flujo de devoluciones.
            </Campo>
          </dl>
          <Anexar>
            los resultados antes y después con una métrica o un efecto observado (en porcentajes o
            rangos), lo que no funcionó, lo que harías distinto y los siguientes pasos.
          </Anexar>
        </Seccion>
      </div>

      <div className="mt-12 border-t border-border pt-6">
        <TextLink to="/#trabajos" variant="standalone">
          <span aria-hidden="true">←&nbsp;</span>Volver a Trabajos
        </TextLink>
      </div>
    </article>
  );
}

export function meta() {
  return [{ title: "Prototipo: página de caso" }, { name: "robots", content: "noindex" }];
}

export default function PrototipoCaso() {
  return (
    <PlantillaPrototipo>
      <PaginaCaso />
    </PlantillaPrototipo>
  );
}
