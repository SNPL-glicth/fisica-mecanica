'use client'

import { angleThetaDeg, computeArea, computeMass, fallTime, resultantVr, terminalVelocityY } from '@/lib/physics'

const g = 9.81

export default function FormulasPage() {
  // Ejemplo sencillo: gota de 3 mm cayendo desde 500 m con viento
  const d_mm = 3
  const d_m = d_mm / 1000
  const m = computeMass(d_m)
  const A = computeArea(d_m)
  const rhoAir = 1.225
  const Cd = 0.47
  const vt = terminalVelocityY(m, rhoAir, A, Cd)
  const Vy = vt
  const Vx = 8
  const Vr = resultantVr(Vx, Vy)
  const theta = angleThetaDeg(Vx, Vy)
  const H = 500
  const tFall = fallTime(H, vt)

  return (
    <main className="px-3 sm:px-6 py-4 sm:py-6 md:py-10 max-w-4xl mx-auto space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
          Fórmulas de Física Mecánica en la simulación
        </h1>
        <p className="text-white/70 text-sm sm:text-base">
          Aquí se muestran las funciones de código que implementan las ecuaciones de la caída de gotas de lluvia
          y su relación con las leyes de Newton.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-black/40 p-4 sm:p-5 space-y-3">
        <h2 className="text-lg font-semibold text-cyan">1. Masa y área de la gota</h2>
        <p className="text-sm text-white/70">
          Se modela la gota como una esfera de agua de diámetro <span className="mono">d</span>. A partir de eso se
          calculan la masa <span className="mono">m</span> y el área de sección transversal <span className="mono">A</span>.
        </p>
        <pre className="text-xs sm:text-sm bg-slate-900/80 border border-white/10 rounded-lg p-3 overflow-x-auto">
{`// Pseudocódigo (no es JavaScript real):
// d: diámetro en metros
// ρ_agua: densidad del agua

function computeMass(d) {
  const r = d / 2
  const volume = (4/3) * π * r^3
  return ρ_agua * volume // kg
}

function computeArea(d) {
  const r = d / 2
  return π * r^2 // m^2
}`}
        </pre>
        <p className="text-xs text-white/60">
          Estas expresiones vienen de la geometría de la esfera y permiten conectar el tamaño de la gota con su masa,
          que aparece en <span className="mono">F = m·a</span>. El código de producción usa constantes como
          <span className="mono">Math.PI</span> y nombres de variables válidos en JavaScript.
        </p>
      </section>

      <section className="rounded-xl border border-white/10 bg-black/40 p-4 sm:p-5 space-y-3">
        <h2 className="text-lg font-semibold text-cyan">2. Velocidad terminal y fuerzas</h2>
        <p className="text-sm text-white/70">
          Para la fuerza de arrastre cuadrática se usa la expresión estándar y se iguala a la fuerza peso para obtener
          la velocidad terminal <span className="mono">v_t</span>.
        </p>
        <pre className="text-xs sm:text-sm bg-slate-900/80 border border-white/10 rounded-lg p-3 overflow-x-auto">
{`// Fg = m·g    (peso)
// Fa = 1/2 · ρ_aire · A · C_d · v^2   (arrastre)
// En v = v_t se cumple Fg = Fa => v_t = sqrt( (2·m·g) / (ρ·A·C_d) )

function terminalVelocityY(m, ρ_aire, A, C_d, g = 9.81) {
  return Math.sqrt((2 * m * g) / (ρ_aire * A * C_d))
}`}
        </pre>
        <p className="text-xs text-white/60">
          La 2ª ley de Newton (<span className="mono">F = m·a</span>) se aplica componente a componente: mientras la
          gota acelera, la diferencia entre peso y arrastre es la fuerza neta que determina su aceleración.
        </p>
      </section>

      <section className="rounded-xl border border-white/10 bg-black/40 p-4 sm:p-5 space-y-3">
        <h2 className="text-lg font-semibold text-cyan">3. Velocidades horizontal, vertical y ángulo</h2>
        <p className="text-sm text-white/70">
          El viento aporta una velocidad horizontal constante <span className="mono">Vx</span>, mientras que la vertical
          <span className="mono">Vy</span> se aproxima a la velocidad terminal. La velocidad resultante y su ángulo se
          calculan con trigonometría básica.
        </p>
        <pre className="text-xs sm:text-sm bg-slate-900/80 border border-white/10 rounded-lg p-3 overflow-x-auto">
{`function resultantVr(Vx, Vy) {
  return Math.hypot(Vx, Vy) // √(Vx^2 + Vy^2)
}

function angleThetaDeg(Vx, Vy) {
  // ángulo entre el eje vertical y Vr
  const θ = Math.atan2(Math.abs(Vx), Math.abs(Vy))
  return (θ * 180) / Math.PI
}`}
        </pre>
        <p className="text-xs text-white/60">
          El ángulo de incidencia de la lluvia aparece como el ángulo entre la dirección vertical y la velocidad
          resultante <span className="mono">Vr</span>, lo que permite relacionar la lluvia oblicua con gráficas de
          vectores en clase.
        </p>
      </section>

      <section className="rounded-xl border border-white/10 bg-black/40 p-4 sm:p-5 space-y-3">
        <h2 className="text-lg font-semibold text-cyan">4. Tiempo de caída aproximado</h2>
        <p className="text-sm text-white/70">
          Para la caída con arrastre cuadrático se usa una aproximación basada en la solución analítica. Si el cálculo
          falla, se recurre a una estimación simple usando la velocidad terminal.
        </p>
        <pre className="text-xs sm:text-sm bg-slate-900/80 border border-white/10 rounded-lg p-3 overflow-x-auto">
{`// H: altura, v_t: velocidad terminal
function fallTime(H, v_t, g = 9.81) {
  const k = (g * H) / (v_t * v_t)
  const expK = Math.exp(k)
  const acosh = (x) => Math.log(x + Math.sqrt(x*x - 1))
  const t = (v_t / g) * acosh(expK)
  if (!Number.isFinite(t)) {
    return H / Math.max(v_t, 0.001)
  }
  return t
}`}
        </pre>
        <p className="text-xs text-white/60">
          Esto conecta el tiempo de vuelo con la altura inicial y la velocidad terminal, permitiendo comparar con una
          caída sin rozamiento (<span className="mono">H = 1/2·g·t²</span>) para discutir el efecto del aire.
        </p>
      </section>

      <section className="rounded-xl border border-white/10 bg-black/40 p-4 sm:p-5 space-y-2 text-xs sm:text-sm text-white/70">
        <h2 className="text-sm font-semibold text-cyan">Ejemplo numérico usado en la simulación</h2>
        <p>
          Para una gota de <span className="mono">{d_mm} mm</span> cayendo desde <span className="mono">{H} m</span> con
          viento horizontal de <span className="mono">{Vx} m/s</span> y aire estándar:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Masa aproximada: <span className="mono">{(m * 1e6).toFixed(1)} mg</span></li>
          <li>Área transversal: <span className="mono">{(A * 1e6).toFixed(1)} mm²</span></li>
          <li>Velocidad terminal vertical: <span className="mono">{vt.toFixed(2)} m/s</span></li>
          <li>Velocidad horizontal del viento: <span className="mono">{Vx.toFixed(2)} m/s</span></li>
          <li>Velocidad resultante: <span className="mono">{Vr.toFixed(2)} m/s</span></li>
          <li>Ángulo de incidencia de la lluvia: <span className="mono">{theta.toFixed(1)}°</span></li>
          <li>Tiempo aproximado de caída: <span className="mono">{tFall.toFixed(2)} s</span></li>
        </ul>
      </section>
    </main>
  );
}
