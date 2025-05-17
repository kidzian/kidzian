import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Terms and Conditions</h1>

      <p className="mb-4">
        Welcome to <strong>Kidzian</strong>, an educational platform based in Bangalore that
        offers courses in coding, app development, and other tech skills for students aged 7–17.
        By accessing or using our website and services, you agree to the following terms and conditions.
      </p>

      <h2 className="text-xl font-semibold mb-3">1. Eligibility</h2>
      <p className="mb-4">
        Our services are intended for children aged 7 to 17. Parents or legal guardians must
        register and authorize access for their children.
      </p>

      <h2 className="text-xl font-semibold mb-3">2. Registration</h2>
      <p className="mb-4">
        Users must provide accurate and complete information during registration. Kidzian is not
        responsible for any issues arising due to incorrect data provided by users.
      </p>

      <h2 className="text-xl font-semibold mb-3">3. Use of Services</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Users must not misuse our services or disrupt the learning environment.</li>
        <li>All course content is for personal use only and may not be shared or resold.</li>
        <li>Kidzian may suspend access if misuse is detected.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-3">4. Payments & Refunds</h2>
      <p className="mb-4">
        Payments for courses must be made in advance. We offer refunds only in specific cases
        outlined in our refund policy. Please contact our support team for assistance.
      </p>

      <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
      <p className="mb-4">
        All course materials, logos, content, and branding are the property of Kidzian. Any
        reproduction or distribution without permission is strictly prohibited.
      </p>

      <h2 className="text-xl font-semibold mb-3">6. Privacy</h2>
      <p className="mb-4">
        Our use of your personal information is governed by our{" "}
        <a href="/privacy-policy" className="text-blue-500 underline">Privacy Policy</a>.
      </p>

      <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
      <p className="mb-4">
        Kidzian is not liable for any indirect, incidental, or consequential damages arising
        from the use of our platform or services.
      </p>

      <h2 className="text-xl font-semibold mb-3">8. Termination</h2>
      <p className="mb-4">
        Kidzian reserves the right to suspend or terminate any account for violation of these
        terms or any misuse of the platform.
      </p>

      <h2 className="text-xl font-semibold mb-3">9. Changes to Terms</h2>
      <p className="mb-4">
        We may update these Terms and Conditions at any time. Changes will be posted on this
        page, and continued use of the platform constitutes agreement with the updated terms.
      </p>

      <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
      <p className="mb-1">If you have any questions about these Terms:</p>
      <ul className="list-disc pl-6 mb-6">
        <li>Email: <a href="mailto:support@kidzian.com" className="text-blue-500">support@kidzian.com</a></li>
        <li>Phone: +919910413549</li>
        <li>SM NEST, Sathya Sai Layout, Whitefield, Bengaluru, Karnataka 560066</li>
      </ul>

      <p className="text-sm text-gray-600">Last updated: May 16, 2025</p>
    </div>
  );
};

export default TermsAndConditions;
