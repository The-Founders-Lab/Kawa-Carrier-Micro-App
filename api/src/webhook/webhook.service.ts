import { ForbiddenException, Injectable } from '@nestjs/common';
import config from 'src/config';
const { createHmac } = require('node:crypto');

@Injectable()
export class WebhookService {
  verifyDataIsFromKawa(kawaSignatureKey: string, body: object) {
    const hash: string = createHmac(
      'sha512',
      config.KAWA_INTEGRATION_KEY as string,
    )
      .update(JSON.stringify(body))
      .digest('hex');

    if (kawaSignatureKey !== hash) {
      throw new ForbiddenException('Unknown data source');
    }
    return kawaSignatureKey === hash;
  }
}
