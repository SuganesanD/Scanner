import { Component } from '@angular/core';
import { FileUploadService } from '../file-upload.service';  // Make sure the service path is correct

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  selectedFile: File | null = null;
  uploadSuccessMessage: string = '';
  uploadErrorMessage: string = '';

  constructor(private fileUploadService: FileUploadService) {}

  // Method to handle file selection
  onFileSelect(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // Method to handle file upload
  onUpload(): void {
    if (this.selectedFile) {
      this.fileUploadService.uploadFile(this.selectedFile).subscribe(
        (response) => {
          console.log('Upload successful!', response);  // Log response from server
          this.uploadSuccessMessage = response.message;  // Show success message
          this.uploadErrorMessage = '';  // Clear error message if upload is successful
        },
        (error) => {
          console.error('Upload failed!', error);  // Log any errors
          this.uploadErrorMessage = 'File upload failed. Please try again.';  // Show error message
          this.uploadSuccessMessage = '';  // Clear success message on failure
        }
      );
    } else {
      console.error('No file selected!');
      this.uploadErrorMessage = 'No file selected. Please select a file to upload.';  // Show error if no file is selected
      this.uploadSuccessMessage = '';
    }
  }
}
