import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private apiUrl = 'http://localhost:3000/upload';  // The server endpoint for file upload

  constructor(private http: HttpClient) {}

  // Method to upload the file
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);  // Add the file to the form data
    return this.http.post(this.apiUrl, formData);  // POST the form data to the server
  }
}
