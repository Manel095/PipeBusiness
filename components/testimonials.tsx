export function Testimonials() {
  return (
    <section className="py-16 md:py-20 bg-[#F3EEF0]/30">
      <div className="mx-auto max-w-[1200px] px-5 text-center">
        <h2 className="text-[32px] md:text-[42px] font-serif font-bold tracking-tight text-foreground leading-[1.1] mb-16 relative inline-block">
          <span className="text-brand font-serif text-[48px] leading-none absolute -left-8 -top-2">"</span>
          Finally, operations software that <br />
          doesn't feel like a spreadsheet.
          <span className="text-brand font-serif text-[48px] leading-none absolute -right-8 top-10">"</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-16 text-left">
          {/* Testimonial 1 */}
          <div className="bg-white p-8 rounded-[12px] border border-border shadow-[0_8px_24px_rgba(47,6,47,0.04)]">
            <p className="text-foreground/80 leading-relaxed mb-6 text-[15px] min-h-[100px]">
              "We used to rely on a massive tangled web of Zapier scripts and Google Sheets. PipeBusiness gave us a semantic map of how our entire sales floor operates. It's beautiful."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-foreground">
                JD
              </div>
              <div>
                <p className="font-bold text-foreground text-[14px]">Julian De Santos</p>
                <p className="text-[12px] text-foreground/60">VP Operations, NexusHQ</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white p-8 rounded-[12px] border border-border shadow-[0_8px_24px_rgba(47,6,47,0.04)]">
            <p className="text-foreground/80 leading-relaxed mb-6 text-[15px] min-h-[100px]">
              "The CLI alone saved my team 10 hours a week. Instead of clicking through five different menus to update a schema, we just type <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-[12px]">/update</code> and it's done across all connected engines."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-brand/20 text-brand flex items-center justify-center font-bold">
                MR
              </div>
              <div>
                <p className="font-bold text-foreground text-[14px]">Maya Rossi</p>
                <p className="text-[12px] text-foreground/60">RevOps Manager, Acme</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white p-8 rounded-[12px] border border-border shadow-[0_8px_24px_rgba(47,6,47,0.04)]">
            <p className="text-foreground/80 leading-relaxed mb-6 text-[15px] min-h-[100px]">
              "Being able to generate a markdown snapshot of our exact pipeline status and drop it directly into our weekly stakeholder report is a game changer. The visual mapping is the icing on the cake."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#3D1952] text-white flex items-center justify-center font-bold">
                TK
              </div>
              <div>
                <p className="font-bold text-foreground text-[14px]">Tom Kolar</p>
                <p className="text-[12px] text-foreground/60">CEO, Vertex Labs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
