export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE "ShopierWebhookEvents" (
      id BIGSERIAL PRIMARY KEY,
      shopier_webhook_id TEXT UNIQUE,
      shopier_order_id TEXT NOT NULL UNIQUE,
      event TEXT NOT NULL,
      shopier_account_id TEXT,
      payload JSONB NOT NULL DEFAULT '{}'::jsonb,
      processing_result JSONB NOT NULL DEFAULT '{}'::jsonb,
      processed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

export const down = (pgm) => {
  pgm.sql('DROP TABLE IF EXISTS "ShopierWebhookEvents";');
};
