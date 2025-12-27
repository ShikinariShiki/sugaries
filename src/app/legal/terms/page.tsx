import Link from 'next/link'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Terms of Service</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Last updated: December 9, 2025</p>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              By accessing and using Gulalies ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Use License</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Permission is granted to temporarily use Gulalies for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on Gulalies</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. User Content</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You retain all rights to the content you create and share through Gulalies. By using our service, you grant us permission to store and display your content for the purpose of providing the service. You are responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Ensuring your content does not violate any laws or regulations</li>
              <li>Not uploading harmful, offensive, or inappropriate content</li>
              <li>Respecting intellectual property rights of others</li>
              <li>Maintaining the security of your PIN codes and access credentials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Privacy & Data Protection</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We take your privacy seriously. All letters are PIN-protected and encrypted. We do not share your personal information with third parties except as described in our Privacy Policy. Your data is stored securely and you can request deletion at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Disclaimer</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The materials on Gulalies are provided on an 'as is' basis. Gulalies makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Limitations</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              In no event shall Gulalies or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use Gulalies, even if Gulalies or a Gulalies authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Service Modifications</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Gulalies reserves the right to modify or discontinue the service at any time, with or without notice. We may also update these terms from time to time. Continued use of the service after such modifications constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Governing Law</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              These terms and conditions are governed by and construed in accordance with applicable international laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Contact Information</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-blue-600 dark:text-blue-400">
              support@gulalies.com
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            By using Gulalies, you acknowledge that you have read and understood these terms and agree to be bound by them.
          </p>
          <div className="mt-4">
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Return to Gulalies
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
