import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Privacy Policy</h1>

      <p className="mb-4">
        Welcome to <strong>Kidzian</strong>! We value your privacy and are committed to
        protecting your personal information. This Privacy Policy outlines how we collect,
        use, and safeguard your data when you use our services.
      </p>

      <h2 className="text-xl font-semibold mb-3">About Us</h2>
      <p className="mb-4">
        Kidzian is a Bangalore-based company offering educational services for children aged
        7 to 17. Our courses include coding, app development, web design, AI basics, and
        more.
      </p>

      <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Personal details like name, age, and contact information.</li>
        <li>Parent/guardian contact details.</li>
        <li>Course preferences and feedback.</li>
        <li>Device and usage information for service improvement.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>To provide personalized learning experiences.</li>
        <li>To contact you regarding classes, updates, and events.</li>
        <li>To improve our courses and services based on feedback.</li>
        <li>To comply with legal and regulatory obligations.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-3">Data Protection</h2>
      <p className="mb-4">
        Kidzian takes data protection seriously. We use appropriate security measures to
        protect your personal information from unauthorized access and disclosure.
      </p>

      <h2 className="text-xl font-semibold mb-3">Third-Party Services</h2>
      <p className="mb-4">
        We may use trusted third-party tools for analytics, payment processing, or
        communication. These services comply with strict data privacy standards.
      </p>

      <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
      <p className="mb-4">
        You have the right to access, correct, or delete your personal information. To do so,
        please contact us at the details below.
      </p>

      <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
      <p className="mb-1">For any questions regarding this Privacy Policy:</p>
      <ul className="list-disc pl-6 mb-6">
        <li>Email: <a href="mailto:support@kidzian.com" className="text-blue-500">support@kidzian.com</a></li>
        <li>Phone: +91 9910413549</li>
        <li>Address: SM NEST, Sathya Sai Layout, Whitefield, Bengaluru, Karnataka 560066</li>
      </ul>

      <p className="text-sm text-gray-600">Last updated: May 16, 2025</p>
    </div>
  );
};

export default PrivacyPolicy;
