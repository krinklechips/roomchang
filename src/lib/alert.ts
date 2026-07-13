/**
 * Telegram alert channel for site-health notifications.
 *
 * Deliberately NOT email: when the thing that's broken IS email (the usual
 * case — see the July 2026 SMTP outage), an email alert would never arrive.
 * Configure with:
 *   TELEGRAM_BOT_TOKEN      from @BotFather
 *   TELEGRAM_ALERT_CHAT_ID  the chat/group to notify (negative id for groups)
 * No-op (returns ok:false with a reason) when unconfigured.
 *
 * Lives in its own module so both the mailer (instant send-failure alerts) and
 * the health cron can use it without a circular import.
 */
export async function sendTelegramAlert(text: string): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ALERT_CHAT_ID;
  if (!token || !chatId) return { ok: false, error: "Telegram alerting not configured" };
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    });
    if (!res.ok) return { ok: false, error: `Telegram API ${res.status}: ${await res.text()}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
