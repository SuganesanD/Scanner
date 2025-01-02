import { Component, ViewChild, ElementRef } from '@angular/core';
import * as Tesseract from 'tesseract.js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;

  capturedPhoto: string | null = null;
  croppedImage: string = '';
  extractedText: string | null = null;
  uploadedImage: string | null = null;

  private stream!: MediaStream;
  private context!: CanvasRenderingContext2D;

  private startX: number = 0;
  private startY: number = 0;
  private width: number = 0;
  private height: number = 0;
  private isDrawing: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.initializeCamera();
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  async initializeCamera(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoElement.nativeElement.srcObject = this.stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
  }

  capturePhoto(): void {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.capturedPhoto = canvas.toDataURL('image/png');
      this.context = context;
    }
  }

  onMouseDown(event: MouseEvent): void {
    this.isDrawing = true;
    this.startX = event.offsetX;
    this.startY = event.offsetY;
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDrawing) return;

    const canvas = this.canvasElement.nativeElement;
    const context = this.context;

    this.width = event.offsetX - this.startX;
    this.height = event.offsetY - this.startY;

    const image = new Image();
    image.src = this.capturedPhoto!;
    image.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      context.strokeStyle = 'green';
      context.lineWidth = 2;
      context.strokeRect(this.startX, this.startY, this.width, this.height);
    };
  }

  onMouseUp(event: MouseEvent): void {
    this.isDrawing = false;
  }

  cropImage(): void {
    const canvas = this.canvasElement.nativeElement;
    const croppedCanvas = document.createElement('canvas');
    const croppedContext = croppedCanvas.getContext('2d')!;

    if (this.width === 0 || this.height === 0) {
      console.error('Invalid crop area');
      return;
    }

    croppedCanvas.width = Math.abs(this.width);
    croppedCanvas.height = Math.abs(this.height);

    croppedContext.drawImage(
      canvas,
      this.startX,
      this.startY,
      this.width,
      this.height,
      0,
      0,
      Math.abs(this.width),
      Math.abs(this.height)
    );

    this.croppedImage = croppedCanvas.toDataURL('image/png');
  }

  async extractTextFromImage(): Promise<void> {
    if (!this.croppedImage) {
      console.error('No image to extract text from');
      return;
    }

    Tesseract.recognize(this.croppedImage, 'eng', {
      logger: (m) => console.log(m),
    })
      .then(({ data: { text } }) => {
        this.extractedText = text;
        console.log('Extracted Text:', text);
      })
      .catch((err) => {
        console.error('OCR Error:', err);
      });
  }

  onFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedImage = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  sendExtractedTextToServer(): void {
    if (!this.extractedText) {
      console.error('No text to send to the server');
      return;
    }

    const serverUrl = 'http://localhost:3000/query-model';
    this.http
      .post(serverUrl, { prompt: this.extractedText }, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          console.log('Server Response:', response);
          alert(`Server Response: ${response}`);
        },
        error: (error) => {
          console.error('Error sending text to server:', error);
        },
      });
  }
}
