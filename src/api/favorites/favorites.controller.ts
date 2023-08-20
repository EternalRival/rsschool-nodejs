import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ApiTags } from '@nestjs/swagger';
import { ParseUUIDV4Pipe } from '../../shared/pipes/parse-uuid-v4.pipe';
import { isDatabaseError } from '../../shared/helpers/is-database-error';
import { Favorites } from './dto/favorites-response.dto';
import { ApiFindAll, ApiCreate, ApiDelete } from './decorators';
import { EntityNotExistException, IsNotFavoriteException } from './exceptions';
import { WhiteListPipe } from '../../shared/pipes/whitelist.pipe';

@ApiTags('Favorites')
@Controller('favs')
@UsePipes(WhiteListPipe)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiFindAll({ name: 'Favorite', type: Favorites })
  private findAll() {
    return this.favoritesService.findAll();
  }

  @Post('/track/:id')
  @ApiCreate({ name: 'Track' })
  private async createFavoriteTrack(
    @Param('id', ParseUUIDV4Pipe) id: string,
  ): Promise<string> {
    try {
      const entity = await this.favoritesService.createFavoriteTrack(id);
      return `the track ${entity.favorite.id} was added to favorites`;
    } catch (error) {
      if (isDatabaseError(error)) {
        if (error.detail?.includes('is not present in table')) {
          throw new EntityNotExistException(id, 'track');
        }
        if (error.detail?.includes('already exists')) {
          return `the track ${id} was added to favorites`;
        }
      }
      throw error;
    }
  }

  @Delete('/track/:id')
  @ApiDelete({ name: 'Track' })
  @HttpCode(HttpStatus.NO_CONTENT)
  private async removeFavoriteTrack(
    @Param('id', ParseUUIDV4Pipe) id: string,
  ): Promise<void> {
    const entity = await this.favoritesService.findFavoriteTrack(id);

    if (!entity) {
      throw new IsNotFavoriteException('track');
    }

    await this.favoritesService.removeFavoriteTrack(entity);
  }

  @Post('/album/:id')
  @ApiCreate({ name: 'Album' })
  private async createFavoriteAlbum(
    @Param('id', ParseUUIDV4Pipe) id: string,
  ): Promise<string> {
    try {
      const entity = await this.favoritesService.createFavoriteAlbum(id);
      return `the album ${entity.favorite.id} was added to favorites`;
    } catch (error) {
      if (isDatabaseError(error)) {
        if (error.detail?.includes('is not present in table')) {
          throw new EntityNotExistException(id, 'album');
        }
        if (error.detail?.includes('already exists')) {
          return `the album ${id} was added to favorites`;
        }
      }
      throw error;
    }
  }

  @Delete('/album/:id')
  @ApiDelete({ name: 'Album' })
  @HttpCode(HttpStatus.NO_CONTENT)
  private async removeFavoriteAlbum(
    @Param('id', ParseUUIDV4Pipe) id: string,
  ): Promise<void> {
    const entity = await this.favoritesService.findFavoriteAlbum(id);

    if (!entity) {
      throw new IsNotFavoriteException('album');
    }

    await this.favoritesService.removeFavoriteAlbum(entity);
  }

  @Post('/artist/:id')
  @ApiCreate({ name: 'Artist' })
  private async createFavoriteArtist(
    @Param('id', ParseUUIDV4Pipe) id: string,
  ): Promise<string> {
    try {
      const entity = await this.favoritesService.createFavoriteArtist(id);
      return `the artist ${entity.favorite.id} was added to favorites`;
    } catch (error) {
      if (isDatabaseError(error)) {
        if (error.detail?.includes('is not present in table')) {
          throw new EntityNotExistException(id, 'artist');
        }
        if (error.detail?.includes('already exists')) {
          return `the artist ${id} was added to favorites`;
        }
      }
      throw error;
    }
  }

  @Delete('/artist/:id')
  @ApiDelete({ name: 'Artist' })
  @HttpCode(HttpStatus.NO_CONTENT)
  private async removeFavoriteArtist(
    @Param('id', ParseUUIDV4Pipe) id: string,
  ): Promise<void> {
    const entity = await this.favoritesService.findFavoriteArtist(id);

    if (!entity) {
      throw new IsNotFavoriteException('artist');
    }

    await this.favoritesService.removeFavoriteArtist(entity);
  }
}
