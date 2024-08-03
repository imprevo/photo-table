import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private ctx: CanvasRenderingContext2D | null = null;

  private prepareContext() {
    if (this.ctx) {
      return this.ctx;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Unable to create 2d context');
    }

    this.ctx = ctx;
    return ctx;
  }

  public resize(source: string, maxWidth: number, maxHeight: number) {
    const ctx = this.prepareContext();
    return new Promise<Blob>((res, rej) => {
      const image = new Image();
      image.addEventListener('load', () => {
        const { width, height } = this.calculateImageSize(
          image.width,
          image.height,
          maxWidth,
          maxHeight
        );

        ctx.canvas.width = width;
        ctx.canvas.height = height;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(image, 0, 0, width, height);
        ctx.canvas.toBlob((blob) => {
          if (blob) {
            res(blob);
          } else {
            rej('Processing error');
          }
        });
      });
      image.addEventListener('error', (e) => rej(e));
      image.src = source;
    });
  }

  private calculateImageSize(
    width: number,
    height: number,
    maxWidth: number,
    maxHeight: number
  ) {
    let scale = 1;
    if (width > maxWidth) {
      scale = maxWidth / width;
    } else if (height > maxHeight) {
      scale = maxHeight / height;
    }

    const newWidth = width * scale;
    const newHeight = height * scale;

    return { width: newWidth, height: newHeight };
  }
}
