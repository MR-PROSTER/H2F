const Navbar = () => {
  return (
    <nav className='h-16 w-full flex items-center justify-between px-4  border-b'>
      <div className='flex gap-4 items-center justify-center'>
        {/* <div className='rounded-4xl h-8 w-8 bg-white'></div> */}
        <div className='text-3xl text-white font-bold'>GSAP</div>
      </div>
      <div className='flex gap-4 items-center justify-center'>
        <div className='text-lg text-white font-bold hover:text-gray-500'>HOME</div>
        <div className='text-lg text-white font-bold hover:text-gray-500'>CONTACT</div>
        <div className='text-lg text-white font-bold hover:text-gray-500'>ABOUT</div>
      </div>
    </nav>
  )
}

export default Navbar
