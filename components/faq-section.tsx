"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Can I integrate with my current CRM?",
    answer: "Yes. PipeBusiness uses universal Webhooks and native APIs. You can easily forward events from Salesforce, HubSpot, or any other CRM directly into a process node to track lifecycle states."
  },
  {
    question: "What is semantic data mapping?",
    answer: "Semantic data mapping allows you to visually route data fields between different systems. For example, you can map a 'lead_id' from your marketing engine directly to a 'client_id' in your sales engine without writing any integration scripts."
  },
  {
    question: "Do I need to know how to code?",
    answer: "Not at all. The entire canvas is a drag-and-drop visual interface. If you understand your business operations, you can build a pipeline. The Command Bar is also built with natural language commands for ease of use."
  },
  {
    question: "How does the Business Intelligence panel work?",
    answer: "The BI panel tracks the volume of entities moving between your nested processes and automatically calculates the conversion rates. If a specific handover drops below a threshold, the system highlights it as a bottleneck."
  }
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 bg-surface border-t border-border">
      <div className="mx-auto max-w-3xl px-5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={index} className="border border-border bg-background rounded-2xl overflow-hidden transition-all duration-200 shadow-sm hover:border-brand/30">
                <button
                  type="button"
                  className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180 text-brand" : ""}`} />
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? "max-h-48 pb-5 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
