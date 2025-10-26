// // src/prisma/prisma.service.ts
// import { Injectable, OnModuleDestroy } from '@nestjs/common';
// import type { PrismaClient } from '@prisma/client';
// import * as fs from 'fs';
// import * as path from 'path';

// // import { Injectable, OnModuleInit } from "@nestjs/common";
// // import { PrismaClient } from "@prisma/client";

// @Injectable()
// export class PrismaService implements OnModuleDestroy {
//   private _client: PrismaClient | null = null;

//   private getClient(): PrismaClient {
//     if (this._client) return this._client;

//     try {
//       // require at runtime and instantiate
//       // eslint-disable-next-line @typescript-eslint/no-var-requires
//       const { PrismaClient } = require('@prisma/client');
//       this._client = new PrismaClient();
//       return this._client;
//     } catch (err) {
//       // Helpful debug info:
//       try {
//         const resolved = require.resolve('@prisma/client');
//         console.error('Resolved @prisma/client to:', resolved);
//         const folder = path.dirname(resolved);
//         console.error('Files in that folder:', fs.readdirSync(folder));
//       } catch (e) {
//         console.error('Could not resolve @prisma/client:', e);
//       }

//       console.error('PrismaClient construction failed:', err);
//       // rethrow so calling code can handle or you can see stack trace
//       throw err;
//     }
//   }

//   // expose model getters commonly used in services
//   public get user() {
//     return this.getClient().user;
//   }

//   // avoid automatic connect on startup; connect lazily in operations
//   public async $connect() {
//     return this.getClient().$connect();
//   }

//   public async $disconnect() {
//     if (!this._client) return;
//     return this._client.$disconnect();
//   }

//   public $on(event: string, cb: (e: any) => void) {
//     return this.getClient().$on(event as any, cb);
//   }

//   async onModuleDestroy() {
//     if (this._client) await this._client.$disconnect();
//   }
// }

// // @Injectable()
// // export class PrismaService extends PrismaClient implements OnModuleInit {
// //     async onModuleInit() {
// //         await this.$connect();
// //     }
// // }


// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
