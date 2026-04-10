import {
  Component,
  input,
  signal,
  ElementRef,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-image-magnifier',
  standalone: true,
  templateUrl: './image-magnifier.component.html',
  styleUrl: './image-magnifier.component.css',
})
export class ImageMagnifierComponent {
  images = input.required<string[]>();
  selectedIndex = signal(0);

  readonly imageContainer = viewChild<ElementRef<HTMLDivElement>>('imageContainer');

  isZooming = signal(false);
  lensX = signal(0);
  lensY = signal(0);
  bgPosX = signal(0);
  bgPosY = signal(0);

  private readonly zoomLevel = 2.5;
  private readonly lensSize = 160;

  selectImage(index: number) {
    this.selectedIndex.set(index);
    this.isZooming.set(false);
  }

  get selectedImage(): string {
    return this.images()[this.selectedIndex()];
  }

  onMouseMove(event: MouseEvent) {
    const container = this.imageContainer()?.nativeElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const halfLens = this.lensSize / 2;

    const lx = Math.max(halfLens, Math.min(x, rect.width - halfLens));
    const ly = Math.max(halfLens, Math.min(y, rect.height - halfLens));

    this.lensX.set(lx - halfLens);
    this.lensY.set(ly - halfLens);

    const percentX = (lx / rect.width) * 100;
    const percentY = (ly / rect.height) * 100;
    this.bgPosX.set(percentX);
    this.bgPosY.set(percentY);

    this.isZooming.set(true);
  }

  onMouseLeave() {
    this.isZooming.set(false);
  }

  get zoomPanelStyle() {
    return {
      'background-image': `url(${this.selectedImage})`,
      'background-size': `${this.zoomLevel * 100}%`,
      'background-position': `${this.bgPosX()}% ${this.bgPosY()}%`,
    };
  }

  get lensStyle() {
    return {
      width: `${this.lensSize}px`,
      height: `${this.lensSize}px`,
      left: `${this.lensX()}px`,
      top: `${this.lensY()}px`,
    };
  }
}
