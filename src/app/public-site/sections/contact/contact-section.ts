import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { ContactSectionContent } from '../../../core/models/site-config.model';
import { TechnicalConfigService } from '../../../core/services/technical-config.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

interface ContactFormState {
  name: string;
  email: string;
  message: string;
}

const EMPTY_FORM: ContactFormState = { name: '', email: '', message: '' };

@Component({
  selector: 'app-contact-section',
  imports: [FormsModule, ScrollRevealDirective],
  templateUrl: './contact-section.html',
  styleUrl: './contact-section.css',
})
export class ContactSection {
  private readonly technicalConfig = inject(TechnicalConfigService);

  readonly content = input.required<ContactSectionContent>();
  readonly form = signal<ContactFormState>({ ...EMPTY_FORM });
  readonly sending = signal(false);
  readonly status = signal<'idle' | 'success' | 'error'>('idle');

  get isConfigured(): boolean {
    return this.technicalConfig.isEmailJsConfigured();
  }

  updateField(field: keyof ContactFormState, value: string): void {
    this.form.set({ ...this.form(), [field]: value });
  }

  async submit(): Promise<void> {
    if (!this.isConfigured || this.sending()) return;
    this.sending.set(true);
    this.status.set('idle');
    const { serviceId, templateId, publicKey } = this.technicalConfig.config().emailJs;
    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: this.form().name,
          from_email: this.form().email,
          message: this.form().message,
          to_email: this.content().email,
        },
        { publicKey },
      );
      this.status.set('success');
      this.form.set({ ...EMPTY_FORM });
    } catch {
      this.status.set('error');
    } finally {
      this.sending.set(false);
    }
  }
}
