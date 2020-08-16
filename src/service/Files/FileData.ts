export class Resolution {
  width: number;
  height: number;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

export class FileData {
  fileName: string;
  filePath: string;
  size?: Number;
  resolution?: Resolution;
  imagePath?: string | undefined;
  GIFRendered?: string | undefined;
  duration?: Number;

  constructor(fileName: string, filePath: string) {
    this.fileName = fileName;
    this.filePath = filePath;
  }
}
