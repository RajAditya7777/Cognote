import Ballpit from '@/components/Ballpit'
import React from 'react'

const Hero = () => {
  return (
    <div>
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
      </div>
    </div>
  )
}

export default Hero