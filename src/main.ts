/* istanbul ignore file */

import { App } from "@/app";

async function main() {
  const app = await App.create();

  await app.listen();
}

void main();
