import Link from 'next/link'

export const dynamic = 'force-static'

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white text-gray-900 p-8 font-sans">
            <div className="max-w-3xl mx-auto space-y-6">
                <Link href="/" className="text-pink-500 hover:underline mb-8 block">&larr; Back to Home</Link>

                <h1 className="text-3xl font-bold mb-4">Privacy Policy for Gulalies</h1>
                <p className="text-gray-600 text-sm">Last updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
                    <p>
                        Welcome to Gulalies ("we," "our," or "us"). We respect your privacy and are committed to protecting the personal information you share with us.
                        This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services, particularly in relation to Google OAuth.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
                    <p>We collect the following personal information when you sign in with Google:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Email Address:</strong> To identify your account and send service-related notifications.</li>
                        <li><strong>Name:</strong> To address you in the application.</li>
                        <li><strong>Profile Picture:</strong> To display your avatar in the user interface.</li>
                    </ul>
                    <p className="mt-2">
                        We do not not share your Google user data with third-party AI models or external advertisers.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
                    <p>We use your information solely for the following purposes:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Authentication:</strong> To log you in securely via Google OAuth.</li>
                        <li><strong>Service Functionality:</strong> To allow you to create, send, and manage digital letters.</li>
                        <li><strong>Communication:</strong> To notify you when your letters are opened or replied to.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">4. Data Storage and Security</h2>
                    <p>
                        Your data is stored securely in our database. We implement industry-standard security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">5. Third-Party Services</h2>
                    <p>
                        Our application's use of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">6. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:shikimanmaru@gmail.com" className="text-pink-500 hover:underline">shikimanmaru@gmail.com</a>.
                    </p>
                </section>
            </div>
        </div>
    )
}
