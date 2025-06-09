export function checkPassword(input: string): boolean {
  return input === process.env.PASSWORD_PROTECT;
} 