import MagicBento from '@/components/MagicBento'
import React from 'react'

const Feautures = () => {
    return (
        <div>
            <MagicBento
                textAutoHide={true}
                enableStars={true}
                enableSpotlight={true}
                enableBorderGlow={true}
                enableTilt={true}
                enableMagnetism={true}
                clickEffect={true}
                spotlightRadius={300}
                particleCount={12}
                glowColor="132, 0, 255"
            />
        </div>
    )
}

export default Feautures