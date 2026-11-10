import { createServerFn } from "@tanstack/react-start";

/** The KV key holding the all-time visitor total. */
const totalKey = "visitors:total";

/**
 * Records a landing-page visit and returns the running total.
 *
 * The browser decides whether it is a new visitor (a localStorage flag) and
 * only then asks for an increment; returning visitors read the count. KV has
 * no atomic increment, so two simultaneous first visits can land on the same
 * number. That is acceptable for a vanity counter.
 *
 * Returns null when the KV binding is missing, so the footer can hide the
 * count instead of showing a wrong one.
 */
export const recordVisit = createServerFn({ method: "POST" })
  .validator((input: unknown) => ({
    isNew: (input as { isNew?: unknown } | null)?.isNew === true,
  }))
  .handler(async ({ data }): Promise<number | null> => {
    // Imported lazily so the Workers runtime module never reaches the client.
    const { env } = await import("cloudflare:workers");
    const kv = env.VISITORS;
    if (!kv) return null;
    const current = Number(await kv.get(totalKey)) || 0;
    if (!data.isNew) return current;
    const next = current + 1;
    await kv.put(totalKey, String(next));
    return next;
  });
