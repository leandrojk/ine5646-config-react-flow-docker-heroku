//@flow

export type Limites = {|
    min: number,
    max: number
|}

export default async function obtemLimites(): Promise<Limites> {
  const r = await fetch('/limites')

  if (!r.ok)
    throw new Error('ERRO: Servidor não respondeu. Tente mais tarede.')

  const limites: Limites = await r.json()
  return limites
}
