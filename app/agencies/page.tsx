import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Building2, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'

export default async function AgenciesPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = parseInt(searchParams.page || '1')
  const pageSize = 10
  const skip = (page - 1) * pageSize

  const [agencies, totalCount] = await Promise.all([
    prisma.agency.findMany({
      skip,
      take: pageSize,
      orderBy: { name: 'asc' },
    }),
    prisma.agency.count(),
  ])

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Agencies</h2>
          <p className="text-gray-500 mt-1">Manage and view all registered agencies.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border shadow-sm text-sm font-medium text-gray-600">
          Total Records: <span className="text-gray-900 font-bold">{totalCount}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 border-b text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Agency Name</th>
                <th className="px-6 py-4">State</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Population</th>
                <th className="px-6 py-4">Website</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {agencies.map((agency) => (
                <tr key={agency.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-900">{agency.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {agency.state}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{agency.type}</td>
                  <td className="px-6 py-4 font-mono text-gray-600">
                    {agency.population?.toLocaleString() || '-'}
                  </td>
                  <td className="px-6 py-4">
                    {agency.website ? (
                      <a
                        href={agency.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        Visit <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">No website</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t bg-gray-50/50 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Showing page <span className="font-medium text-gray-900">{page}</span> of{' '}
            <span className="font-medium text-gray-900">{totalPages}</span>
          </span>
          <div className="flex gap-2">
            <Link
              href={page > 1 ? `/agencies?page=${page - 1}` : '#'}
              className={`p-2 rounded-lg border transition-colors ${
                page > 1
                  ? 'bg-white hover:bg-gray-50 text-gray-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              aria-disabled={page <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <Link
              href={page < totalPages ? `/agencies?page=${page + 1}` : '#'}
              className={`p-2 rounded-lg border transition-colors ${
                page < totalPages
                  ? 'bg-white hover:bg-gray-50 text-gray-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              aria-disabled={page >= totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
