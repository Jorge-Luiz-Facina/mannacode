export default function convertValueToPtBr(value, minimumFractionDigits = 0): string{
  const valueInt = parseInt(value)
  return valueInt.toLocaleString('pt-br', {minimumFractionDigits: minimumFractionDigits}).toString()
}