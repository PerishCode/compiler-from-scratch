const encoder = new TextEncoder();

async function print(text: string) {
  await Deno.stdout.write(encoder.encode(text));
}

async function println(text: string) {
  await print(text + "\n");
}

export { print, println };
