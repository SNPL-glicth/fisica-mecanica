export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export function computeMass(diameter_m: number, rhoWater = 1000) {
  const r = diameter_m / 2
  const volume = (4 / 3) * Math.PI * Math.pow(r, 3)
  return rhoWater * volume // kg
}

export function computeArea(diameter_m: number) {
  const r = diameter_m / 2
  return Math.PI * r * r // m^2
}

export function terminalVelocityY(mass_kg: number, rhoAir: number, area: number, Cd: number, g = 9.81) {
  return Math.sqrt((2 * mass_kg * g) / (rhoAir * area * Cd))
}

export function resultantVr(Vx: number, Vy: number) {
  return Math.hypot(Vx, Vy)
}

export function angleThetaDeg(Vx: number, Vy: number) {
  // ángulo entre Vy (vertical) y Vr; usamos atan(Vx/Vy)
  const theta = Math.atan2(Math.abs(Vx), Math.abs(Vy))
  return (theta * 180) / Math.PI
}

export function fallTime(H: number, vt: number, g = 9.81) {
  // Para arrastre cuadrático: y(t) = (vt^2/g) ln cosh(gt/vt)
  // Resolver t: H = (vt^2/g) ln cosh(gt/vt)
  const k = (g * H) / (vt * vt)
  const expK = Math.exp(k)
  // acosh(x) = ln(x + sqrt(x^2 - 1))
  const acosh = (x: number) => Math.log(x + Math.sqrt(x * x - 1))
  const t = (vt / g) * acosh(expK)
  if (!isFinite(t) || isNaN(t)) {
    return H / Math.max(vt, 0.001)
  }
  return t
}
