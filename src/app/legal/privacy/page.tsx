import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Last updated: December 9, 2025</p>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We collect information to provide better services to all our users. The types of information we collect include:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li><strong>Account Information:</strong> When you sign up via Google OAuth, we collect your name, email address, and profile picture</li>
              <li><strong>Letter Content:</strong> Messages, recipient names, sender names, images, and music selections you include in your letters</li>
              <li><strong>Usage Data:</strong> Information about how you use our service, including when letters are opened and read</li>
              <li><strong>Device Information:</strong> Browser type, IP address, and other technical information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information to improve our service</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To send you notifications when your letters are opened (if enabled)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Data Security</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The security of your data is important to us. We implement industry-standard security measures:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>All letters are protected with PIN codes that are encrypted using bcrypt</li>
              <li>Data is transmitted over secure HTTPS connections</li>
              <li>We use secure database storage with PostgreSQL</li>
              <li>Regular security audits and updates</li>
              <li>Access controls to limit who can view your data</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Data Sharing & Disclosure</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li><strong>With Your Consent:</strong> When you authorize us to share information</li>
              <li><strong>Service Providers:</strong> With third-party vendors who help us operate our service (e.g., hosting, authentication)</li>
              <li><strong>Legal Requirements:</strong> If required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Your Rights & Choices</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You have control over your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li><strong>Access & Update:</strong> You can view and update your profile information at any time</li>
              <li><strong>Delete Account:</strong> You can request deletion of your account and all associated data</li>
              <li><strong>Notification Settings:</strong> Control which notifications you receive in your settings</li>
              <li><strong>Data Export:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Cookies & Tracking</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use cookies and similar tracking technologies to track activity on our service and hold certain information:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Session cookies to keep you logged in</li>
              <li>Preference cookies to remember your settings</li>
              <li>Analytics cookies to understand how you use our service</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Children's Privacy</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our service is not intended for children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. International Data Transfers</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Your information may be transferred to and maintained on computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ. We ensure appropriate safeguards are in place to protect your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="text-blue-600 dark:text-blue-400 mb-2">
              Email: privacy@sugaries.com
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              We will respond to your inquiry within 30 days.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            By using Sugaries, you consent to the collection and use of information in accordance with this policy.
          </p>
          <div className="mt-4">
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Return to Sugaries
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
