import { Hero45 } from '@/components/home/hero45'
import { Hero1 } from '@/components/home/hero1'
import { Hero151 } from '@/components/home/hero151'

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
      <Hero1 heading="Turn Your Property into Profit" description="Join thousands of successful hosts who are earning extra income by sharing their spaces. List your property today and start welcoming guests from around the world." image={{ src: "/images/HomePage/HostDashboard.jpg", alt: "Host dashboard showing property management interface" }} />
    </>
  )
}