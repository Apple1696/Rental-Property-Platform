import { Hero151 } from '@/components/hero151'
import { Hero45 } from '@/components/hero45'
import { Gallery6 } from '@/components/gallery6'
import { Hero1 } from '@/components/hero1'

export default function Home() {
  return (
    <>
      <Hero151 
        images={{
          first: "/images/HomePage/Cabin.jpg",
          second: "/images/HomePage/StellaIsland.jpg",
          third: "/images/HomePage/LuxuryRoom.jpg",
          fourth: "/images/HomePage/LuxuryApartment.jpg",
        }}
      />
      <Hero45 heading="Experience the Best in Property Rentals" />
      <Gallery6/>
      <Hero1 heading="Turn Your Property into Profit" description="Join thousands of successful hosts who are earning extra income by sharing their spaces. List your property today and start welcoming guests from around the world." image={{ src: "/images/HomePage/HostDashboard.jpg", alt: "Host dashboard showing property management interface" }} />
    </>
  )
}