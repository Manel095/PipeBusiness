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
    <section id="faq" className="py-16 md:py-20 bg-background">
      <div className="mx-auto max-w-3xl px-5">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[42px] font-serif font-bold tracking-tight text-foreground leading-[1.1]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={index} className={`border bg-white rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? "border-brand shadow-sm" : "border-border shadow-none"}`}>
                <button
                  type="button"
                  className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="font-bold text-base text-foreground pr-4">{faq.question}</span>
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${isOpen ? "bg-brand text-foreground" : "bg-muted text-foreground"}`}>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} strokeWidth={3} />
                  </div>
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? "max-h-48 pb-6 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <p className="text-foreground/80 leading-relaxed text-[15px]">
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
