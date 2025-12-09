import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ClientHome from '@/components/ClientHome'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  // If admin is logged in, redirect to dashboard
  if (session?.user.role === 'admin') {
    redirect('/admin/dashboard')
  }

  return <ClientHome session={session} />
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'

              <Link href="/admin/compose" className="flex-1 sm:flex-none">
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-poppins font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  ✉️ Compose a Letter
                </button>
              </Link>
              <Link href="/admin/dashboard" className="flex-1 sm:flex-none">
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-gray-50 text-gray-900 font-poppins font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  📊 Dashboard
                </button>
              </Link>
            </>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8"
          >
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="font-bold text-gray-900 mb-3 text-xl font-poppins">Encrypted</h3>
            <p className="text-gray-600 font-poppins">
              PIN-protected messages that only the recipient can open
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8"
          >
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="font-bold text-gray-900 mb-3 text-xl font-poppins">Customizable</h3>
            <p className="text-gray-600 font-poppins">
              Choose colors, fonts, music, and images for your letters
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8"
          >
            <div className="text-5xl mb-4">💌</div>
            <h3 className="font-bold text-gray-900 mb-3 text-xl font-poppins">Personal</h3>
            <p className="text-gray-600 font-poppins">
              A unique unfolding experience for each letter
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
