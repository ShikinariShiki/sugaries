import Image from 'next/image'
import iconImage from './icon.png'

export default function SugariesIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <Image
      src={iconImage}
      alt="Gulalies Logo"
      className={className}
      priority
    />
  )
}
