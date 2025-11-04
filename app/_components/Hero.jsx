import Ballpit from '@/components/Ballpit'
import React from 'react'

const Hero = () => {
  return (
    <div className="relative">
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: '960px', maxHeight: '960px', width: '100%' }}>
        <Ballpit
          count={120}
          gravity={0.01}
          friction={0.9975}
          wallBounce={0.95}
          followCursor={false}
          colors={[
            '#FFFFFF',  // White
            '#0000FF',  // Blue
          ]}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 px-4">
          <p className="text-7xl font-semibold text-white max-w-4xl">Think Smarter Write Freely Discover with Cognote.</p>
          <p className="text-xl text-white mt-4">
            your intelligent notebook. Write, organize, and create with the power of AI.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Hero