import Image from 'next/image'

export const Glitch: React.FC = () => {
  return (
    <div className="z-[9999] absolute h-screen w-screen pointer-events-none opacity-5">
      <Image
        src="https://i.pinimg.com/originals/d5/a7/cb/d5a7cb46e2f15a8fed10aaf1dd00965c.gif"
        alt="Gif 1"
        fill
      />
      <Image
        src="https://media1.giphy.com/media/kz6iUkQuGZmN5HfB0t/giphy.gif"
        alt="Gif 2"
        fill
      />
    </div>
  )
}
