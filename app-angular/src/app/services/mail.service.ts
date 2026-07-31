import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

export interface ContactEmailPayload {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export interface ContactEmailResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private http = inject(HttpClient);
  env = environment;

  constructor() { }

  sendContactEmail(payload: ContactEmailPayload): Observable<ContactEmailResponse> {
    return this.http.post<ContactEmailResponse>(
      `${ this.env.urlbackend }/api/ds/mail/send-email`,
      payload
    );
  }
}
