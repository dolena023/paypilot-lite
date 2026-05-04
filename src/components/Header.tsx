interface Props {
  businessName: string
}

export default function Header({ businessName }: Props) {
  if (!businessName) return null
  return (
    <header className="no-print bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
      <p className="text-right text-gray-500 font-medium text-lg">{businessName}</p>
    </header>
  )
}
