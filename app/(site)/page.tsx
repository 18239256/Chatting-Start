import Image from 'next/image'

export default function Home() {
  return (
    <div
      className='
      flex
      min-h-full
      flex-col
      justify-center
      py-12
      sm:px-6
      lg:px-8
      ' 
    >
      <p className='text-sky-500 text-3xl'>
        你好, Chatting!
      </p>
    </div>
  )
}
