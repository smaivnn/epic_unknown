import { CharacterService } from './../../character/service/character.service';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ExtractCharacterIdInterceptor implements NestInterceptor {
  constructor(private readonly characterSercive: CharacterService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const character = await this.characterSercive.findOne(request);

    request.character = character;

    return next.handle().pipe(tap());
  }
}
