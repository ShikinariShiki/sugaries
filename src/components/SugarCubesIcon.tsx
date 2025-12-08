import Image from 'next/image'
import iconImage from './icon.png'

export default function SugarCubesIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <Image
      src={iconImage}
      alt="Sugaries Logo"
      className={className}
      priority
    />
  )
}
