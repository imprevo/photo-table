/// <reference types="@types/wicg-file-system-access" />

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FSAdapter {
  public openDirectory() {
    return window.showDirectoryPicker({ mode: 'readwrite' });
  }

  public async getFiles(dirHandle: FileSystemDirectoryHandle) {
    await this.getReadWritePermission(dirHandle);
    const files: File[] = [];
    for await (const handle of dirHandle.values()) {
      if (handle.kind === 'file') {
        files.push(await handle.getFile());
      }
    }
    return files;
  }

  private async hasReadWritePermission(handle: FileSystemHandle) {
    const permission = await handle.queryPermission({ mode: 'readwrite' });
    return permission === 'granted';
  }

  private async requestReadWritePermission(handle: FileSystemHandle) {
    const permission = await handle.requestPermission({ mode: 'readwrite' });
    return permission === 'granted';
  }

  private async getReadWritePermission(handle: FileSystemHandle) {
    if (
      (await this.hasReadWritePermission(handle)) ||
      (await this.requestReadWritePermission(handle))
    ) {
      return true;
    }

    throw new Error('No permission to open file');
  }
}
