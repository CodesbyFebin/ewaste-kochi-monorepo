'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Phone, MessageSquare, CheckCircle } from 'lucide-react'
import { conversionEvents } from '@/lib/analytics/conversion-events'

interface ContactFormProps {
  title: string
  description?: string
  phoneNumber?: string
  whatsappNumber?: string
  serviceType?: string
}

export function ContactForm({ title, description, phoneNumber, whatsappNumber, serviceType = 'contact' }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    conversionEvents.formSubmission(serviceType, window.location.pathname)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  const handlePhoneClick = () => {
    if (phoneNumber) {
      conversionEvents.phoneClick(phoneNumber, window.location.pathname)
    }
  }

  const handleWhatsappClick = () => {
    if (whatsappNumber) {
      conversionEvents.whatsappClick(whatsappNumber, window.location.pathname)
    }
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">{title}</h2>
          {description && <p className="text-foreground/70">{description}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input type="text" placeholder="Your Name" required />
              <Input type="email" placeholder="Your Email" required />
              <Input type="tel" placeholder="Phone Number" />
              <Textarea placeholder="Tell us about your e-waste" required />
              <Button className="w-full" type="submit">
                {submitted ? 'Form Submitted!' : 'Get Free Quote'}
              </Button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-border p-6 space-y-4">
              <h3 className="font-semibold">Quick Contact</h3>
              
              {phoneNumber && (
                <a
                  href={`tel:${phoneNumber}`}
                  onClick={handlePhoneClick}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-foreground/5 transition"
                >
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-foreground/60">Call Us</p>
                    <p className="font-medium">{phoneNumber}</p>
                  </div>
                </a>
              )}

              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                  onClick={handleWhatsappClick}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-foreground/5 transition"
                >
                  <MessageSquare className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-foreground/60">WhatsApp Us</p>
                    <p className="font-medium">{whatsappNumber}</p>
                  </div>
                </a>
              )}

              {submitted && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Thank you! We&apos;ll be in touch soon.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
