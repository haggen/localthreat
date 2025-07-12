export function copy(value: string) {
  if ("clipboard" in navigator) {
    navigator.clipboard.writeText(value);
    return;
  }

  const input = document.createElement("input");
  input.value = value;
  input.style.all = "unset";
  input.style.position = "fixed";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
}
