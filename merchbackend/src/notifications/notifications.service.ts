import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebase: typeof admin,
  ) {}

  async sendToToken(
    token: string,
    title: string,
    body: string,
    link?: string,
  ) {
    return this.firebase.messaging().send({
      token,
      notification: { title, body },
      webpush: {
        fcmOptions: { link },
      },
    });
  }
}
