import Razorpay from "razorpay";

let razorpayInstance: Razorpay | null = null;

/** Lazily create Razorpay so Next.js build/prerender does not require API keys. */
export function getRazorpayInstance(): Razorpay {
  const key_id = process.env.RAZORPAY_API_KEY?.trim();
  const key_secret = process.env.RAZORPAY_API_SECRET?.trim();

  if (!key_id || !key_secret) {
    throw new Error(
      "Razorpay API keys not configured (RAZORPAY_API_KEY, RAZORPAY_API_SECRET)"
    );
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({ key_id, key_secret });
  }

  return razorpayInstance;
}
