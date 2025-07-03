import AdminLayout from "@/layouts/AdminLayout"
import { DataTable } from "@/components/admin/data-table"
import { SectionCards } from "@/components/admin/section-cards"


export default function Dashboard() {
  return (
    <AdminLayout>
      <SectionCards />
      <div className="px-4 lg:px-6">
        {/* <ChartAreaInteractive /> */}
      </div>
      <DataTable/>
    </AdminLayout>
  )
}
