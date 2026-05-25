type SidebarProps = {
  activePage: string
  setActivePage: (page: string) => void
}

export default function Sidebar({
  activePage,
  setActivePage
}: SidebarProps) {

  const menuItems = [
    'Dashboard',
    'Schools',
    'Conversations',
    'Workflows',
    'Analytics'
  ]

  return (

    <div className="w-64 min-h-screen bg-gray-950 border-r border-gray-800 p-6">

      <h1 className="text-3xl font-bold text-white mb-10">
        Apex Frontier
      </h1>

      <div className="space-y-4">

        {menuItems.map((item) => (

          <div
            key={item}
            onClick={() => setActivePage(item)}
            className={`
              px-4 py-3 rounded-xl cursor-pointer transition-all
              ${activePage === item
                ? 'bg-white text-black font-semibold'
                : 'text-gray-300 hover:bg-gray-900'}
            `}
          >
            {item}
          </div>

        ))}

      </div>

    </div>

  )
}