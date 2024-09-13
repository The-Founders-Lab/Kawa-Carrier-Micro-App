import { ForbiddenException, Injectable } from '@nestjs/common';
import { IntegrationKeysEnum } from './webhook.enum';
import config from 'src/config';
const { createHmac } = require('node:crypto');

@Injectable()
export class WebhookService {
  private readonly INTEGRATION_KEYS: Record<string, any> = {
    test: config.KAWA_SECRET_TEST_KEY,
    live: config.KAWA_SECRET_LIVE_KEY,
  };

  getIntegrationKey(environment: IntegrationKeysEnum) {
    return this.INTEGRATION_KEYS[environment];
  }

  verifyDataIsFromKawa(kawaSignatureKey: string, body: object) {
    const testHash: string = createHmac(
      'sha512',
      this.INTEGRATION_KEYS[IntegrationKeysEnum.test] ?? '',
    )
      .update(JSON.stringify(body))
      .digest('hex');

    const liveHash: string = createHmac(
      'sha512',
      this.INTEGRATION_KEYS[IntegrationKeysEnum.live] ?? '',
    )
      .update(JSON.stringify(body))
      .digest('hex');

    const dataIsFromKnownSource =
      kawaSignatureKey === testHash || kawaSignatureKey === liveHash;
    if (!dataIsFromKnownSource) {
      throw new ForbiddenException('Unknown data source');
    }
    return dataIsFromKnownSource;
  }
}
