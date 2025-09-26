import { expect } from "vitest";

export async function expectToThrow<T = Error>(promise: Promise<any>, msg?: string): Promise<T> {
  let err: T | undefined = undefined;
  try {
    await promise;
  } catch (e) {
    err = e;
    if (msg && typeof e.message === "string") {
      expect(e.message).toContain(msg);
    } else if (msg && e.message.message) {
      // Nest error exceptions `message` key is of type `object` instead of `string`
      expect(e.message.message).toContain(msg);
    }
  }
  expect(err).toBeDefined();
  return err!;  
}
