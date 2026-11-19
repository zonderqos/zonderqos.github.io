const POLISH_DIACRITICS_REGEX = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/;
const POLISH_WORDS_REGEX =
  /\b(oraz|który|która|które|przez|tylko|brak|strona|systemu|pobieranie|funkcjonalności|zrzuty|rozwoju|ustawienia)\b/i;

export function containsPolishCharacters(input: string): boolean {
  return POLISH_DIACRITICS_REGEX.test(input) || POLISH_WORDS_REGEX.test(input);
}

export function collectPolishViolations(value: unknown, path = 'root'): string[] {
  const violations: string[] = [];

  if (typeof value === 'string') {
    if (containsPolishCharacters(value)) {
      violations.push(`${path}: "${value.slice(0, 80)}"`);
    }
    return violations;
  }

  if (Array.isArray(value)) {
    value.forEach((item, idx) => {
      violations.push(...collectPolishViolations(item, `${path}[${idx}]`));
    });
    return violations;
  }

  if (value !== null && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      violations.push(...collectPolishViolations(v, `${path}.${k}`));
    }
  }

  return violations;
}
