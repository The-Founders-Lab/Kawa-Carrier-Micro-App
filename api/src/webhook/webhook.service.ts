import { ForbiddenException, Injectable } from '@nestjs/common';
import { IntegrationKeysEnum } from './webhook.enum';
const { createHmac } = require('node:crypto');

@Injectable()
export class WebhookService {
  public MODE: IntegrationKeysEnum = IntegrationKeysEnum.test;
  private readonly INTEGRATION_KEYS: Record<string, any> = {
    test: 'ka_sk_test_d9cc6351f453be5cb2872a3148532daa25b5b4b6',
    live: 'ka_sk_live_d3e224249e9d299e8945deeff3d5634a8d15b97e',
  };
  public readonly INTEGRATION_KEY: string = this.INTEGRATION_KEYS[this.MODE];

  getIntegrationKey(environment: IntegrationKeysEnum) {
    return this.INTEGRATION_KEYS[environment];
  }

  verifyDataIsFromKawa(kawaSignatureKey: string, body: object) {
    const testHash: string = createHmac(
      'sha512',
      this.INTEGRATION_KEYS[IntegrationKeysEnum.test],
    )
      .update(JSON.stringify(body))
      .digest('hex');

    const liveHash: string = createHmac(
      'sha512',
      this.INTEGRATION_KEYS[IntegrationKeysEnum.live],
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
