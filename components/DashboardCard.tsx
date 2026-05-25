type DashboardCardProps = {
  title: string
  value: string | number
}

export default function DashboardCard({
  title,
  value
}: DashboardCardProps) {

  return (

    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

      <p className="text-gray-400 mb-2">
        {title}
      </p>

      <h2 className="text-4xl font-bold">
        {value}
      </h2>

    </div>

  )
}