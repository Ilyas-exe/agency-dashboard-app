import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import RevealButton from '@/components/RevealButton'
import { Users, ChevronLeft, ChevronRight, Building } from 'lucide-react'

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = parseInt(searchParams.page || '1')
  const pageSize = 10
  const skip = (page - 1) * pageSize

  const [contacts, totalCount] = await Promise.all([
    prisma.contact.findMany({
      skip,
      take: pageSize,
      orderBy: { last_name: 'asc' },
      include: {
        agency: {
          select: { name: true },
        },
      },
    }),
    prisma.contact.count(),
  ])

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Contacts</h2>
          <p className="text-gray-500 mt-1">View and contact agency representatives.</p>
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
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Agency & Dept</th>
                <th className="px-6 py-4">Contact Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {contact.first_name} {contact.last_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 font-medium">{contact.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                        <Building className="w-3.5 h-3.5 text-gray-400" />
                        {contact.agency?.name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500 pl-5">
                        {contact.department}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <RevealButton contactId={contact.id} type="email" />
                      <RevealButton contactId={contact.id} type="phone" />
                    </div>
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
              href={page > 1 ? `/contacts?page=${page - 1}` : '#'}
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
              href={page < totalPages ? `/contacts?page=${page + 1}` : '#'}
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
