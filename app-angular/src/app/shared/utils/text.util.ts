/**
 * Quita acentos/diacriticos de un texto (p. ej. la e con acento agudo de
 * Queretaro se vuelve una e normal).
 * El servicio de busqueda de destinos de INEGI no encuentra resultados para
 * nombres de lugares con acentos, asi que este helper se usa para limpiar el
 * termino de busqueda justo antes de enviarlo al backend, sin tocar el valor
 * que el usuario ve escrito en el input.
 */
export function stripAccents(value: string): string {
  // NFD separa cada letra acentuada en (letra base + marca diacritica combinante);
  // el rango \u0300-\u036f cubre esas marcas combinantes, asi se eliminan.
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
