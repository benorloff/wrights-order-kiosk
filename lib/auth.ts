export function checkPassword(input: string): boolean {
  return input === process.env.NEXT_PUBLIC_PASSWORD_PROTECT;
} 