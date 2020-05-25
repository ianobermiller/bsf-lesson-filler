/**
 * Simple functions to obfuscate answer text so that it isn't trivially readable
 * in the database.
 */

export function obfuscate(text: string): string {
  return btoa(text);
}

export function deobfuscate(text: string): string {
  return atob(text);
}
