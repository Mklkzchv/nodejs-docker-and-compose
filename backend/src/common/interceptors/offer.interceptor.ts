import {
  ExecutionContext,
  Injectable,
  CallHandler,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Wish } from 'src/wishes/wish.entity';

@Injectable()
export class OfferInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map((responseData) => this.hideOfferAmount(responseData)));
  }
  private hideOfferAmount(wishData: Wish): Wish {
    {
      if (this.isValidWish(wishData)) {
        for (const offer of wishData.offers) {
          if (offer.hidden) {
            this.removeSensitiveData(offer);
          }
        }
      }
      return wishData;
    }
  }

  private isValidWish(data: any): data is Wish {
    return data && typeof data === 'object' && Array.isArray(data.offers);
  }

  private removeSensitiveData(offer: any): void {
    delete offer.amount;
  }
}
