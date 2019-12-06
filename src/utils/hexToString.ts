// TODO: This should never be needed. Instead, the subgraph should
// already return an ASCII string.
export function hexToString(hex: string): string {
  let str = '';

  for (let i = 54; i < hex.length; i += 2) {
    const value = parseInt(hex.substr(i, 2), 16);

    if (value) {
      str += String.fromCharCode(value);
    }
  }

  return str.trim();
}
