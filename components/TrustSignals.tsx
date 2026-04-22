import { Shield, CreditCard, FileText, Phone } from 'lucide-react'

const items = [
  { icon: Shield, text: 'JCI / NABH Accredited Hospitals' },
  { icon: CreditCard, text: 'Book Now, Pay Later (BNPL)' },
  { icon: FileText, text: 'Free Visa Assistance Included' },
  { icon: Phone, text: '24/7 Patient Coordinator' },
]

export default function TrustSignals() {
  return (
    <div className="bg-blue-50 border-b border-blue-100 px-4 py-2">
      <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-x-6 gap-y-2">
        {items.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-1.5 text-xs text-blue-800">
            <Icon size={14} className="shrink-0" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
